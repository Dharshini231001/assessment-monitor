import { eventLogger } from './eventLogger'

class LockdownService {
    private element: HTMLElement | null = null

    init() {
        this.element = document.documentElement
        this.attachListeners()
        this.requestFullscreen()
    }

    private attachListeners() {
        document.addEventListener('fullscreenchange', this.handleFullscreenChange)
        document.addEventListener('visibilitychange', this.handleVisibilityChange)
        window.addEventListener('blur', () => eventLogger.log('TAB_BLUR'))
        window.addEventListener('focus', () => eventLogger.log('TAB_FOCUS'))

        // Block interactions
        document.addEventListener('copy', this.preventAndLog('COPY_ATTEMPT'))
        document.addEventListener('cut', this.preventAndLog('COPY_ATTEMPT'))
        document.addEventListener('paste', this.preventAndLog('PASTE_ATTEMPT'))
        document.addEventListener('contextmenu', this.preventAndLog('RIGHT_CLICK_ATTEMPT'))
        document.addEventListener('keydown', this.handleKeydown)
    }

    private handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            eventLogger.log('FULLSCREEN_EXIT')
        } else {
            eventLogger.log('FULLSCREEN_ENTER')
        }
    }

    private handleVisibilityChange = () => {
        if (document.hidden) {
            eventLogger.log('TAB_BLUR')
        } else {
            eventLogger.log('TAB_FOCUS')
        }
    }

    private preventAndLog = (type: any) => (e: Event) => {
        e.preventDefault()
        eventLogger.log(type)
        return false
    }

    private handleKeydown = (e: KeyboardEvent) => {
        // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Alt+Tab (hard to block in browser but we can log blur)
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault()
            eventLogger.log('DEVTOOLS_ATTEMPT')
        }
    }

    requestFullscreen() {
        if (!document.fullscreenElement && this.element) {
            this.element.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`)
            })
        }
    }

    cleanup() {
        document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
        document.removeEventListener('visibilitychange', this.handleVisibilityChange)
        // In a real app we'd remove all specific listeners
    }
}

export const lockdownService = new LockdownService()

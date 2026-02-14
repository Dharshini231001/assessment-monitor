import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { lockdownService } from '../services/lockdownService'

export const LockdownOverlay = () => {
    const [isFullscreen, setIsFullscreen] = useState(true)

    useEffect(() => {
        const checkFullscreen = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', checkFullscreen)
        // Initial check (give a small grace period for startup)
        setTimeout(checkFullscreen, 1000)

        return () => document.removeEventListener('fullscreenchange', checkFullscreen)
    }, [])

    if (isFullscreen) return null

    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="max-w-md space-y-6">
                <div className="text-6xl text-destructive mb-4">⚠️</div>
                <h2 className="text-3xl font-bold text-destructive">Assessment Halted</h2>
                <p className="text-muted-foreground text-lg">
                    Fullscreen mode is required to continue correctly.
                    Exiting fullscreen is a violation of assessment rules.
                </p>
                <Button
                    size="lg"
                    onClick={() => lockdownService.requestFullscreen()}
                    className="w-full text-lg h-14"
                >
                    Return to Assessment
                </Button>
            </div>
        </div>
    )
}

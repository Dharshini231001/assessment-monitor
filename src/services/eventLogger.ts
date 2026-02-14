import { supabase } from './supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export type EventType =
    | 'TIMER_STARTED'
    | 'TIMER_WARNING'
    | 'TIMER_PAUSED'
    | 'TIMER_RESUMED'
    | 'TIMER_EXPIRED'
    | 'AUTO_SUBMIT'
    | 'FULLSCREEN_EXIT'
    | 'FULLSCREEN_ENTER'
    | 'TAB_BLUR'
    | 'TAB_FOCUS'
    | 'COPY_ATTEMPT'
    | 'PASTE_ATTEMPT'
    | 'RIGHT_CLICK_ATTEMPT'
    | 'DEVTOOLS_ATTEMPT'
    | 'ASSESSMENT_STARTED'
    | 'ASSESSMENT_SUBMITTED'

interface LogEvent {
    event_type: EventType
    client_timestamp: string
    metadata?: any
}

class EventLogger {
    private attemptId: string | null = null
    private eventQueue: LogEvent[] = []
    private isSubmitted = false
    private flushInterval: Timer | null = null

    constructor() {
        // Load pending events from local storage if any
        const stored = localStorage.getItem('pending_events')
        if (stored) {
            try {
                this.eventQueue = JSON.parse(stored)
            } catch (e) {
                console.error('Failed to parse pending events', e)
                this.eventQueue = []
            }
        }

        // Start flush timer
        this.startFlushTimer()
    }

    private startFlushTimer() {
        this.flushInterval = setInterval(() => this.flush(), 5000)
    }

    setAttemptId(id: string) {
        this.attemptId = id
    }

    log(eventType: EventType, metadata?: any) {
        if (this.isSubmitted && eventType !== 'ASSESSMENT_SUBMITTED') return

        const event: LogEvent = {
            event_type: eventType,
            client_timestamp: new Date().toISOString(),
            metadata,
        }

        this.eventQueue.push(event)
        this.persistLocal()

        if (this.eventQueue.length >= 20) {
            this.flush()
        }
    }

    private persistLocal() {
        localStorage.setItem('pending_events', JSON.stringify(this.eventQueue))
    }

    async flush() {
        if (this.eventQueue.length === 0 || !this.attemptId) return

        const batch = [...this.eventQueue]
        // Optimistically clear queue, will re-add on failure
        this.eventQueue = []
        this.persistLocal()

        try {
            const { error } = await supabase.from('event_logs').insert(
                batch.map(evt => ({
                    attempt_id: this.attemptId,
                    event_type: evt.event_type,
                    client_timestamp: evt.client_timestamp,
                    metadata: evt.metadata,
                }))
            )

            if (error) {
                console.error('Failed to flush logs:', error)
                // Re-queue if failed
                this.eventQueue = [...batch, ...this.eventQueue]
                this.persistLocal()
            }
        } catch (err) {
            console.error('Error flushing logs:', err)
            this.eventQueue = [...batch, ...this.eventQueue]
            this.persistLocal()
        }
    }

    stop() {
        this.isSubmitted = true
        this.flush()
        if (this.flushInterval) clearInterval(this.flushInterval)
    }
}

export const eventLogger = new EventLogger()

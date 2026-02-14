import { supabase } from './supabaseClient'
import { eventLogger } from './eventLogger'

interface TimerConfig {
    durationSeconds: number
    warningThresholds: number[]
}

class TimerService {
    private remainingSeconds: number = 0
    private intervalId: Timer | null = null
    private lastTick: number = 0
    private attemptId: string | null = null
    private warningThresholds: number[] = []
    private onTickCallbacks: ((remaining: number) => void)[] = []
    private onTimeUpCallbacks: (() => void)[] = []

    constructor() {
        this.remainingSeconds = 0
    }

    async init(attemptId: string, config: TimerConfig) {
        this.attemptId = attemptId
        this.warningThresholds = config.warningThresholds.sort((a, b) => b - a)

        // Check for existing server state first
        const { data: serverState } = await supabase
            .from('timer_state')
            .select('remaining_seconds')
            .eq('attempt_id', attemptId)
            .single()

        if (serverState) {
            this.remainingSeconds = serverState.remaining_seconds
        } else {
            this.remainingSeconds = config.durationSeconds
            // Create initial timer state
            await supabase.from('timer_state').insert({
                attempt_id: attemptId,
                remaining_seconds: this.remainingSeconds,
            })
        }

        this.start()
    }

    start() {
        if (this.intervalId) return
        this.lastTick = Date.now()
        eventLogger.log('TIMER_STARTED', { remaining: this.remainingSeconds })

        this.intervalId = setInterval(() => {
            const now = Date.now()
            const delta = now - this.lastTick

            // Anti-manipulation: detected drift > 2000ms
            if (delta > 2000) {
                console.warn('Timer drift detected:', delta)
            }

            this.tick()
            this.lastTick = now
        }, 1000)

        // Sync to server every 30s
        setInterval(() => this.syncServer(), 30000)
    }

    private tick() {
        this.remainingSeconds--

        // Notify subscribers
        this.onTickCallbacks.forEach(cb => cb(this.remainingSeconds))

        // Check thresholds
        if (this.warningThresholds.includes(this.remainingSeconds)) {
            eventLogger.log('TIMER_WARNING', { remaining: this.remainingSeconds })
        }

        // Persist local state
        localStorage.setItem('timer_local', JSON.stringify({
            remaining: this.remainingSeconds,
            timestamp: Date.now()
        }))

        if (this.remainingSeconds <= 0) {
            this.stop()
            eventLogger.log('TIMER_EXPIRED')
            this.onTimeUpCallbacks.forEach(cb => cb())
        }
    }

    private async syncServer() {
        if (!this.attemptId) return
        await supabase
            .from('timer_state')
            .update({
                remaining_seconds: this.remainingSeconds,
                last_synced_at: new Date().toISOString()
            })
            .eq('attempt_id', this.attemptId)
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    onTick(callback: (remaining: number) => void) {
        this.onTickCallbacks.push(callback)
    }

    onTimeUp(callback: () => void) {
        this.onTimeUpCallbacks.push(callback)
    }

    getRemaining() {
        return this.remainingSeconds
    }
}

export const timerService = new TimerService()

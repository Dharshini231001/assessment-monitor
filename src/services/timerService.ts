import { supabase } from './supabaseClient'

export const timerService = {
    intervalId: null as any,
    remainingSeconds: 0,
    tickCallbacks: [] as ((seconds: number) => void)[],
    timeUpCallbacks: [] as (() => void)[],

    async init(attemptId: string, config: { durationSeconds: number; warningThresholds: number[] }) {
        this.remainingSeconds = config.durationSeconds
        this.start()
    },

    start() {
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = setInterval(() => {
            if (this.remainingSeconds > 0) {
                this.remainingSeconds--
                this.tickCallbacks.forEach(cb => cb(this.remainingSeconds))
            } else {
                this.stop()
                this.timeUpCallbacks.forEach(cb => cb())
            }
        }, 1000)
    },

    stop() {
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = null
    },

    onTick(callback: (seconds: number) => void) {
        this.tickCallbacks.push(callback)
    },

    onTimeUp(callback: (() => void)) {
        this.timeUpCallbacks.push(callback)
    }
}

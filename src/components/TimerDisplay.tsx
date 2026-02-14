import { useAssessment } from '../contexts/AssessmentContext'
import { cn } from '../lib/utils'

export const TimerDisplay = () => {
    const { timerRemaining } = useAssessment()

    const minutes = Math.floor(timerRemaining / 60)
    const seconds = timerRemaining % 60

    const isWarning = timerRemaining < 300 // 5 mins
    const isCritical = timerRemaining < 60 // 1 min

    return (
        <div className={cn(
            "fixed top-4 right-4 px-6 py-3 rounded-xl font-mono text-2xl font-bold backdrop-blur-md border shadow-lg transition-all duration-300 z-50",
            isCritical ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" :
                isWarning ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" :
                    "bg-background/80 border-border text-foreground"
        )}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    )
}

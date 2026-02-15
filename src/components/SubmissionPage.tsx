import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { CheckCircle2, Clock, ListChecks, BarChart3, Home } from 'lucide-react'
import { Button } from './ui/button'
import { useAssessment } from '../contexts/AssessmentContext'

export const SubmissionPage = () => {
    const { questions, selectedAnswers, timerRemaining, totalDuration, resetAssessment } = useAssessment()

    const timeTakenSeconds = totalDuration - timerRemaining
    const minutes = Math.floor(timeTakenSeconds / 60)
    const seconds = timeTakenSeconds % 60
    
    const totalQuestions = questions.length
    const answeredCount = Object.keys(selectedAnswers).length

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-4 animate-in zoom-in-95 duration-500">
            <Card className="max-w-md w-full text-center border-green-500/20 shadow-2xl shadow-green-500/10 overflow-hidden bg-background/60 backdrop-blur-xl">
                <div className="h-2 bg-green-500 w-full" />
                <CardHeader className="pt-8">
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                        Assessment completed successfully
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Your professional evaluation has been securely processed.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 px-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 border border-border/50">
                            <Clock className="w-5 h-5 text-primary mb-2" />
                            <span className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Time Taken</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 border border-border/50">
                            <ListChecks className="w-5 h-5 text-green-500 mb-2" />
                            <span className="text-2xl font-bold">{answeredCount}/{totalQuestions}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Answered</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                         <div className="p-2 bg-primary/10 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-primary" />
                         </div>
                         <div className="text-left">
                            <div className="text-sm font-semibold">Technical Feedback</div>
                            <div className="text-xs text-muted-foreground">Results will be available shortly.</div>
                         </div>
                    </div>
                </CardContent>
                <CardFooter className="pb-8 pt-2 flex flex-col gap-3 px-8">
                    <Button onClick={resetAssessment} className="w-full gap-2 h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                        <Home className="w-5 h-5" />
                        Return to Dashboard
                    </Button>
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest pt-2">
                        Session ID: {localStorage.getItem('attempt_id') || 'ASSESS_7721'}
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

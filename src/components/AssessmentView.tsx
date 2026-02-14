import { TimerDisplay } from './TimerDisplay'
import { LockdownOverlay } from './LockdownOverlay'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { useAssessment } from '../contexts/AssessmentContext'

export const AssessmentView = () => {
    const { questions } = useAssessment()

    return (
        <div className="relative w-full h-screen bg-background flex flex-col overflow-hidden font-sans text-foreground">
            <LockdownOverlay />
            <TimerDisplay />

            <div className="flex-1 flex overflow-hidden">
                {/* Main Assessment Area */}
                <div className="flex-1 relative bg-muted/20 border-r border-border/40">
                    <iframe
                        src="https://example.com/"
                        className="w-full h-full border-0 block"
                        title="Assessment Content"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                </div>

                {/* Side Panel - Questions */}
                <div className="w-96 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col border-l border-border/50 shadow-2xl">
                    <div className="p-4 border-b border-border/50 bg-muted/10">
                        <h3 className="font-semibold text-lg tracking-tight">Assessment Questions</h3>
                        <p className="text-sm text-muted-foreground">Answer the following questions based on your task.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {questions.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                No questions loaded.
                            </div>
                        ) : (
                            questions.map((q, i) => (
                                <Card key={q.id} className="border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card/50">
                                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Question {i + 1}
                                        </CardTitle>
                                        <Badge variant={q.difficulty === 'Hard' ? 'destructive' : q.difficulty === 'Medium' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0 uppercase">
                                            {q.difficulty}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <p className="text-sm leading-relaxed">{q.question_text}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

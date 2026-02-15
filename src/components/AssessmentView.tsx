import { TimerDisplay } from './TimerDisplay'
import { LockdownOverlay } from './LockdownOverlay'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useAssessment } from '../contexts/AssessmentContext'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { cn } from '../lib/utils'

export const AssessmentView = () => {
    const { 
        questions, 
        currentQuestionIndex, 
        nextQuestion, 
        prevQuestion,
        goToQuestion,
        markedQuestions, 
        toggleMarkQuestion,
        selectedAnswers,
        selectAnswer,
        submitAssessment
    } = useAssessment()

    const currentQuestion = questions[currentQuestionIndex]

    if (!currentQuestion) {
        return <div className="flex items-center justify-center h-screen">Loading Questions...</div>
    }

    const isMarked = markedQuestions.has(currentQuestion.id)
    const currentAnswer = selectedAnswers[currentQuestion.id]

    return (
        <div className="relative w-full h-screen bg-background flex flex-col overflow-hidden font-sans text-foreground">
            <LockdownOverlay />
            <TimerDisplay />

            <div className="flex-1 flex overflow-hidden">
                {/* Main Assessment Area */}
                <div className="flex-1 flex flex-col relative bg-muted/20 border-r border-border/40 p-6 md:p-10 overflow-y-auto">
                   <div className="max-w-3xl w-full mx-auto space-y-6">
                        {/* Header Area */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold tracking-tight">Question {currentQuestionIndex + 1}</h2>
                            <div className="flex gap-2">
                                <Badge variant={currentQuestion.difficulty === 'Hard' ? 'destructive' : currentQuestion.difficulty === 'Medium' ? 'default' : 'secondary'} className="uppercase">
                                    {currentQuestion.difficulty}
                                </Badge>
                                <Button 
                                    variant={isMarked ? "secondary" : "ghost"} 
                                    size="sm" 
                                    onClick={() => toggleMarkQuestion(currentQuestion.id)}
                                    className={cn("gap-2 transition-colors", isMarked && "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400")}
                                >
                                    <Flag className={cn("w-4 h-4", isMarked ? "fill-current" : "")} />
                                    {isMarked ? 'Marked as Doubt' : 'Mark as Doubt'}
                                </Button>
                            </div>
                        </div>

                        {/* Question Card */}
                        <Card className="border-border/60 shadow-lg bg-card/80 backdrop-blur-sm">
                            <CardHeader className="p-6 pb-2">
                                <CardTitle className="text-lg md:text-xl font-medium leading-relaxed">
                                    {currentQuestion.question_text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-4">
                                <RadioGroup value={currentAnswer} onValueChange={(val: string) => selectAnswer(currentQuestion.id, val)} className="space-y-3">
                                    {currentQuestion.options.map((option, idx) => (
                                        <div key={idx} className={cn(
                                            "flex items-center space-x-3 space-y-0 rounded-md border p-4 transition-all hover:bg-accent hover:text-accent-foreground cursor-default select-none",
                                            currentAnswer === option ? "border-primary bg-primary/5 shadow-sm" : "border-muted"
                                        )}>
                                            <RadioGroupItem value={option} id={`option-${idx}`} className="cursor-default" />
                                            <Label htmlFor={`option-${idx}`} className="flex-1 cursor-default font-normal text-base">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex justify-between">
                                <Button variant="outline" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>
                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button onClick={submitAssessment} className="bg-green-600 hover:bg-green-700 text-white">
                                        Submit Assessment
                                        <Flag className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={nextQuestion}>
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                   </div>
                </div>

                {/* Side Panel - Questions Palette */}
                <div className="w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col border-l border-border/50 shadow-2xl">
                    <div className="p-4 border-b border-border/50 bg-muted/10">
                        <h3 className="font-semibold text-lg tracking-tight">Question Palette</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Doubt
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-3 mr-1"></span> Answered
                            <span className="inline-block w-3 h-3 rounded-full bg-primary ml-3 mr-1"></span> Current
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-4 gap-3">
                            {questions.map((q, i) => {
                                const isCurrent = currentQuestionIndex === i;
                                const isMarkedDoubt = markedQuestions.has(q.id);
                                const isAnswered = !!selectedAnswers[q.id];

                                let variant = "outline";
                                let className = "h-10 w-10 p-0 font-medium transition-all hover:scale-105";

                                if (isCurrent) {
                                    className += " border-primary ring-2 ring-primary/20 bg-primary/10 text-primary";
                                } else if (isMarkedDoubt) {
                                    className += " bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800";
                                } else if (isAnswered) {
                                    className += " bg-green-100 text-green-700 border-green-300 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800";
                                } else {
                                     className += " text-muted-foreground hover:bg-muted";
                                }

                                return (
                                    <Button
                                        key={q.id}
                                        variant="outline"
                                        className={className}
                                        onClick={() => goToQuestion(i)}
                                    >
                                        {i + 1}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


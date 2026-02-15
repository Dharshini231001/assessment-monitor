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
        <div className="relative w-full h-screen bg-transparent flex flex-col overflow-hidden font-sans text-foreground">
            <LockdownOverlay />
            <TimerDisplay />

            <div className="flex-1 flex overflow-hidden gap-8 px-8">
                <div className="w-3/4 flex flex-col relative py-8 overflow-y-auto pr-4">
                   <div className="w-full space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold tracking-tight">Question {currentQuestionIndex + 1}</h2>
                            <div className="flex gap-3">
                                <Badge variant={currentQuestion.difficulty === 'Hard' ? 'destructive' : currentQuestion.difficulty === 'Medium' ? 'default' : 'secondary'} className="uppercase px-3 py-1 text-xs font-bold">
                                    {currentQuestion.difficulty}
                                </Badge>
                                <Button 
                                    variant={isMarked ? "secondary" : "ghost"} 
                                    size="sm" 
                                    onClick={() => toggleMarkQuestion(currentQuestion.id)}
                                    className={cn("gap-2 transition-all hover:scale-105 cursor-pointer", isMarked && "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400")}
                                >
                                    <Flag className={cn("w-4 h-4", isMarked ? "fill-current" : "")} />
                                    {isMarked ? 'Marked as Doubt' : 'Mark as Doubt'}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6 p-1">
                            <h1 className="text-xl md:text-2xl font-semibold leading-tight text-balance">
                                {currentQuestion.question_text}
                            </h1>
                            
                            <RadioGroup value={currentAnswer} onValueChange={(val: string) => selectAnswer(currentQuestion.id, val)} className="space-y-4">
                                {currentQuestion.options.map((option, idx) => (
                                    <div key={idx} className={cn(
                                        "flex items-center space-x-4 space-y-0 rounded-2xl border-2 p-5 transition-all cursor-pointer select-none",
                                        currentAnswer === option 
                                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/20" 
                                            : "border-border/50 bg-background/40 backdrop-blur-md hover:bg-background/60 hover:border-border"
                                    )}>
                                        <RadioGroupItem value={option} id={`option-${idx}`} className="h-4 w-4 cursor-pointer" />
                                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer font-medium text-base">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            <div className="pt-8 flex justify-between items-center border-t border-border/20">
                                <Button variant="ghost" onClick={prevQuestion} disabled={currentQuestionIndex === 0} className="h-12 px-6 text-lg hover:bg-background/20 cursor-pointer">
                                    <ChevronLeft className="w-5 h-5 mr-3" />
                                    Previous
                                </Button>
                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button onClick={submitAssessment} className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 text-lg font-bold shadow-lg shadow-green-500/20 cursor-pointer">
                                        Submit Assessment
                                        <Flag className="w-5 h-5 ml-3" />
                                    </Button>
                                ) : (
                                    <Button onClick={nextQuestion} className="h-12 px-8 text-lg hover:translate-x-1 transition-transform cursor-pointer">
                                        Next
                                        <ChevronRight className="w-5 h-5 ml-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                   </div>
                </div>

                <div className="w-1/4 bg-background/30 backdrop-blur-xl flex flex-col border-x border-border/20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] rounded-3xl my-8">
                    <div className="p-6 border-b border-border/20">
                        <h3 className="font-bold text-xl tracking-tight">Question Palette</h3>
                        <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Doubt</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Answered</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                            {questions.map((q, i) => {
                                const isCurrent = currentQuestionIndex === i;
                                const isMarkedDoubt = markedQuestions.has(q.id);
                                const isAnswered = !!selectedAnswers[q.id];

                                let className = "h-12 w-full rounded-xl p-0 font-bold transition-all hover:scale-110 cursor-pointer";

                                if (isCurrent) {
                                    className += " border-2 border-primary ring-4 ring-primary/20 bg-primary/20 text-primary z-10 scale-110";
                                } else if (isMarkedDoubt) {
                                    className += " bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/20";
                                } else if (isAnswered) {
                                    className += " bg-green-500 text-white border-green-600 shadow-lg shadow-green-500/20";
                                } else {
                                     className += " bg-background/40 text-muted-foreground border border-border/50 hover:bg-background/60 hover:border-border";
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


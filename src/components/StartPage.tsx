import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { useAssessment } from '../contexts/AssessmentContext'
import { ShieldCheck, Clock, Eye, MousePointerClick, Code2 } from 'lucide-react'

export const StartPage = () => {
    const { startAssessment } = useAssessment()
    const [techStack, setTechStack] = useState<string>('Frontend')

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-2xl w-full shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center pb-8 border-b">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Assessment Portal
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Please select your domain and review the rules before beginning.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 pt-8">
                    {/* Tech Stack Selection */}
                    <div className="flex flex-col gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 font-semibold text-primary mb-1">
                            <Code2 className="w-5 h-5" />
                            Select Tech Stack
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="tech-stack" className="min-w-fit">Target Domain:</Label>
                            <Select value={techStack} onValueChange={setTechStack}>
                                <SelectTrigger id="tech-stack" className="w-full bg-background">
                                    <SelectValue placeholder="Select a tech stack" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Frontend">Frontend Development</SelectItem>
                                    <SelectItem value="Backend">Backend Development</SelectItem>
                                    <SelectItem value="Full Stack">Full Stack Development</SelectItem>
                                    <SelectItem value="Mobile">Mobile Development</SelectItem>
                                    <SelectItem value="DevOps">DevOps & Infrastructure</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 border flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <Clock className="w-5 h-5 text-primary" />
                                Timed Assessment
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Timer cannot be paused. Auto-submit on expiration.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50 border flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Fullscreen Enforced
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You must remain in fullscreen mode. Exiting triggers a warning.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50 border flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <Eye className="w-5 h-5 text-primary" />
                                Proctored Environment
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Tab switching and focus loss are monitored and logged.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50 border flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <MousePointerClick className="w-5 h-5 text-primary" />
                                Restricted Actions
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Copy, paste, and right-click menus are disabled.
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-center pt-6 pb-8">
                    <Button
                        size="lg"
                        className="w-full max-w-sm text-lg h-14 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
                        onClick={() => startAssessment(techStack)}
                    >
                        Start {techStack} Assessment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

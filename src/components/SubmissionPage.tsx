import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { CheckCircle2 } from 'lucide-react'

export const SubmissionPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in zoom-in-95 duration-500">
            <Card className="max-w-md w-full text-center border-green-500/20 shadow-2xl shadow-green-500/10">
                <CardHeader>
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                        Assessment Submitted
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Your responses have been recorded securely. You may now close this window.
                    </p>
                    <div className="text-sm text-muted-foreground/60">
                        Session ID: <span className="font-mono">{localStorage.getItem('attempt_id') || 'N/A'}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

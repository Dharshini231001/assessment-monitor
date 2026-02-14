import React, { createContext, useContext, useEffect, useState } from 'react'
import { timerService } from '../services/timerService'
import { eventLogger } from '../services/eventLogger'
import { lockdownService } from '../services/lockdownService'
import { supabase } from '../services/supabaseClient'

export interface Question {
    id: string
    tech_stack: string
    question_text: string
    difficulty: string
}

interface AssessmentContextType {
    attemptId: string | null
    isStarted: boolean
    isSubmitted: boolean
    timerRemaining: number
    questions: Question[]
    startAssessment: (techStack: string) => Promise<void>
    submitAssessment: () => Promise<void>
}

const AssessmentContext = createContext<AssessmentContextType | null>(null)

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [attemptId, setAttemptId] = useState<string | null>(null)
    const [isStarted, setIsStarted] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [timerRemaining, setTimerRemaining] = useState(0)
    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        // Timer subscription
        timerService.onTick((remaining) => {
            setTimerRemaining(remaining)
        })

        timerService.onTimeUp(() => {
            submitAssessment()
        })
    }, [])

    const startAssessment = async (techStack: string) => {
        // 1. Fetch Questions for the selected stack
        const { data: fetchedQuestions, error: questionError } = await supabase
            .from('questions')
            .select('*')
            .eq('tech_stack', techStack)

        if (questionError) {
            console.error('Failed to fetch questions', questionError)
            alert('Failed to load questions. Please try again.')
            return
        }

        if (fetchedQuestions && fetchedQuestions.length > 0) {
            setQuestions(fetchedQuestions)
        } else {
            console.warn('No questions found for this stack')
            // Optional: fallback or alert
        }

        // 2. Create Attempt
        // For demo, we get a random assessment (or the seeded one)
        const { data: assessment } = await supabase
            .from('assessments')
            .select('*')
            .limit(1)
            .single()

        if (!assessment) {
            console.error('No assessment found')
            alert('No assessment configuration found in database.')
            return
        }

        const { data: attempt, error } = await supabase
            .from('attempts')
            .insert({
                assessment_id: assessment.id,
                status: 'IN_PROGRESS'
            })
            .select()
            .single()

        if (error || !attempt) {
            console.error('Failed to create attempt', error)
            return
        }

        setAttemptId(attempt.id)
        setIsStarted(true)

        // 3. Initialize Services
        eventLogger.setAttemptId(attempt.id)
        eventLogger.log('ASSESSMENT_STARTED', { tech_stack: techStack })

        lockdownService.init()

        await timerService.init(attempt.id, {
            durationSeconds: assessment.duration_seconds,
            warningThresholds: assessment.warning_threshold_seconds || []
        })
    }

    const submitAssessment = async () => {
        if (isSubmitted) return

        setIsSubmitted(true)
        timerService.stop()
        lockdownService.cleanup()
        eventLogger.log('ASSESSMENT_SUBMITTED')
        eventLogger.stop()

        if (attemptId) {
            await supabase.from('attempts').update({
                status: 'SUBMITTED',
                ended_at: new Date().toISOString()
            }).eq('id', attemptId)
        }
    }

    return (
        <AssessmentContext.Provider value={{
            attemptId,
            isStarted,
            isSubmitted,
            timerRemaining,
            questions,
            startAssessment,
            submitAssessment
        }}>
            {children}
        </AssessmentContext.Provider>
    )
}

export const useAssessment = () => {
    const context = useContext(AssessmentContext)
    if (!context) throw new Error('useAssessment must be used within AssessmentProvider')
    return context
}

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
    options: string[]
}

interface AssessmentContextType {
    attemptId: string | null
    isStarted: boolean
    isSubmitted: boolean
    timerRemaining: number
    totalDuration: number
    questions: Question[]
    currentQuestionIndex: number
    markedQuestions: Set<string>
    selectedAnswers: Record<string, string>
    startAssessment: (techStack: string) => Promise<void>
    submitAssessment: () => Promise<void>
    resetAssessment: () => void
    nextQuestion: () => void
    prevQuestion: () => void
    goToQuestion: (index: number) => void
    toggleMarkQuestion: (questionId: string) => void
    selectAnswer: (questionId: string, answer: string) => void
}

const AssessmentContext = createContext<AssessmentContextType | null>(null)

const MOCK_QUESTIONS: Record<string, Question[]> = {
    'Frontend Development': [
        { id: 'fq1', tech_stack: 'Frontend Development', difficulty: 'Easy', question_text: 'What is the virtual DOM in React?', options: ['A direct copy of the real DOM', 'A lightweight JavaScript representation of the DOM', 'A browser API', 'A new HTML element'] },
        { id: 'fq2', tech_stack: 'Frontend Development', difficulty: 'Medium', question_text: 'Which hook is used for side effects in functional components?', options: ['useState', 'useReducer', 'useEffect', 'useCallback'] },
        { id: 'fq3', tech_stack: 'Frontend Development', difficulty: 'Medium', question_text: 'What does CSS Box Model consist of?', options: ['Margin, Border, Padding, Content', 'Header, Footer, Main, Sidebar', 'Grid, Flex, Block, Inline', 'Relative, Absolute, Fixed, Sticky'] },
        { id: 'fq4', tech_stack: 'Frontend Development', difficulty: 'Hard', question_text: 'What is the purpose of Redux thunk?', options: ['To handle synchronous actions', 'To handle asynchronous actions', 'To store component state', 'To optimize rendering'] },
        { id: 'fq5', tech_stack: 'Frontend Development', difficulty: 'Easy', question_text: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Syntax check', 'JavaScript X-ray'] },
    ],
    'Backend': [
        { id: 'bq1', tech_stack: 'Backend', difficulty: 'Easy', question_text: 'What is middleware in Express.js?', options: ['A database driver', 'Functions that execute during request-response cycle', 'A frontend framework', 'A testing tool'] },
        { id: 'bq2', tech_stack: 'Backend', difficulty: 'Medium', question_text: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'CONNECT'] },
        { id: 'bq3', tech_stack: 'Backend', difficulty: 'Medium', question_text: 'What is connection pooling?', options: ['Merging multiple databases', 'Reusing database connections', 'Sharing internet connection', 'Load balancing'] },
        { id: 'bq4', tech_stack: 'Backend', difficulty: 'Hard', question_text: 'Explain CAP theorem.', options: ['Consistency, Availability, Partition Tolerance', 'Consistency, Accuracy, Performance', 'Concurrency, Availability, Process', 'Cache, API, Protocol'] },
        { id: 'bq5', tech_stack: 'Backend', difficulty: 'Easy', question_text: 'What is an ORM?', options: ['Object-Relational Mapping', 'Object-Resource Management', 'Operational Risk Management', 'Online Reputation Management'] },
    ],
    'SQL': [
        { id: 'sq1', tech_stack: 'SQL', difficulty: 'Easy', question_text: 'What is a Primary Key?', options: ['A key that allows null values', 'A unique identifier for a row', 'A link to another table', 'An optional field'] },
        { id: 'sq2', tech_stack: 'SQL', difficulty: 'Medium', question_text: 'Which SQL clause is used to filter group results?', options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'] },
        { id: 'sq3', tech_stack: 'SQL', difficulty: 'Medium', question_text: 'What is the purpose of an Index?', options: ['To save space', 'To speed up data retrieval', 'To secure the database', 'To link tables'] },
        { id: 'sq4', tech_stack: 'SQL', difficulty: 'Hard', question_text: 'What is ACID in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Atomicity, Complexity, Isolation, Data', 'Accuracy, Consistency, Integration, Durability', 'Access, Control, Information, Data'] },
        { id: 'sq5', tech_stack: 'SQL', difficulty: 'Easy', question_text: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Level', 'Stateless Query Logic', 'Standard Quality List'] },
    ],
    'Devops': [
        { id: 'dq1', tech_stack: 'Devops', difficulty: 'Easy', question_text: 'What is Docker?', options: ['A programming language', 'A containerization platform', 'A database', 'An operating system'] },
        { id: 'dq2', tech_stack: 'Devops', difficulty: 'Medium', question_text: 'What is CI/CD?', options: ['Continuous Integration / Continuous Deployment', 'Code Integration / Code Design', 'Cloud Integration / Cloud Data', 'Computer Interface / Core Design'] },
        { id: 'dq3', tech_stack: 'Devops', difficulty: 'Medium', question_text: 'What is the purpose of Kubernetes?', options: ['Version control', 'Orchestration of containerized apps', 'Styling websites', 'Writing server logic'] },
        { id: 'dq4', tech_stack: 'Devops', difficulty: 'Hard', question_text: 'Explain Infrastructure as Code (IaC).', options: ['Writing manuals for hardware', 'Managing infrastructure through machine-readable files', 'Manual server configuration', 'Hardcoding server IPs'] },
        { id: 'dq5', tech_stack: 'Devops', difficulty: 'Easy', question_text: 'Which tool is commonly used for version control?', options: ['Jenkins', 'Git', 'Docker', 'Ansible'] },
    ],
    'Android/IOS Development': [
        { id: 'mq1', tech_stack: 'Android/IOS Development', difficulty: 'Easy', question_text: 'What is the main language for native iOS development today?', options: ['Objective-C', 'Swift', 'Kotlin', 'Java'] },
        { id: 'mq2', tech_stack: 'Android/IOS Development', difficulty: 'Easy', question_text: 'What is the main language for modern Android development?', options: ['Swift', 'Kotlin', 'C#', 'Ruby'] },
        { id: 'mq3', tech_stack: 'Android/IOS Development', difficulty: 'Medium', question_text: 'What is React Native?', options: ['A native Android IDE', 'A framework for building cross-platform apps using React', 'A styling library', 'A database'] },
        { id: 'mq4', tech_stack: 'Android/IOS Development', difficulty: 'Medium', question_text: 'What is an Activity in Android?', options: ['A class that represents a single screen with a UI', 'A background service', 'A database connection', 'A CSS file'] },
        { id: 'mq5', tech_stack: 'Android/IOS Development', difficulty: 'Hard', question_text: 'What is Flutter?', options: ['A game engine', 'A UI toolkit for building natively compiled cross-platform apps', 'A web browser', 'A physical device'] },
    ]
}

const DEFAULT_QUESTIONS = MOCK_QUESTIONS['Frontend Development']

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [attemptId, setAttemptId] = useState<string | null>(null)
    const [techStack, setTechStack] = useState<string>('Frontend Development')
    const [isStarted, setIsStarted] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [timerRemaining, setTimerRemaining] = useState(0)
    const [totalDuration, setTotalDuration] = useState(0)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set())
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})

    useEffect(() => {
        timerService.onTick((remaining) => {
            setTimerRemaining(remaining)
        })

        timerService.onTimeUp(() => {
            submitAssessment()
        })
    }, [])

    const startAssessment = async (techStack: string) => {
        const stackQuestions = (MOCK_QUESTIONS[techStack as keyof typeof MOCK_QUESTIONS] || DEFAULT_QUESTIONS) as Question[]
        setQuestions([...stackQuestions])

        const { data: assessment } = await supabase
            .from('assessments')
            .select('*')
            .limit(1)
            .single()

        if (!assessment) {
            setAttemptId('mock-attempt-id')
            setIsStarted(true)
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
            setAttemptId('mock-attempt-id')
            setIsStarted(true)
            return
        }

        setAttemptId(attempt.id)
        setIsStarted(true)

        eventLogger.setAttemptId(attempt.id)
        eventLogger.log('ASSESSMENT_STARTED', { tech_stack: techStack })

        lockdownService.init()

        const duration = assessment?.duration_seconds || 3600
        setTotalDuration(duration)

        await timerService.init(attempt.id, {
            durationSeconds: duration,
            warningThresholds: assessment?.warning_threshold_seconds || []
        })
    }

    const resetAssessment = () => {
        setIsStarted(false)
        setIsSubmitted(false)
        setAttemptId(null)
        setQuestions([])
        setCurrentQuestionIndex(0)
        setMarkedQuestions(new Set())
        setSelectedAnswers({})
        setTimerRemaining(0)
        setTotalDuration(0)
        timerService.stop()
        lockdownService.cleanup()
        eventLogger.stop()
    }

    const submitAssessment = async () => {
        if (isSubmitted) return

        setIsSubmitted(true)
        timerService.stop()
        lockdownService.cleanup()
        eventLogger.log('ASSESSMENT_SUBMITTED')
        eventLogger.stop()

        if (attemptId && attemptId !== 'mock-attempt-id') {
            await supabase.from('attempts').update({
                status: 'SUBMITTED',
                ended_at: new Date().toISOString()
            }).eq('id', attemptId)
        }
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index)
        }
    }

    const toggleMarkQuestion = (questionId: string) => {
        setMarkedQuestions(prev => {
            const next = new Set(prev)
            if (next.has(questionId)) {
                next.delete(questionId)
            } else {
                next.add(questionId)
            }
            return next
        })
    }

    const selectAnswer = (questionId: string, answer: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }))
    }

    return (
        <AssessmentContext.Provider value={{
            attemptId,
            isStarted,
            isSubmitted,
            timerRemaining,
            totalDuration,
            questions,
            currentQuestionIndex,
            markedQuestions,
            selectedAnswers,
            startAssessment,
            submitAssessment,
            resetAssessment,
            nextQuestion,
            prevQuestion,
            goToQuestion,
            toggleMarkQuestion,
            selectAnswer
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


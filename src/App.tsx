import { AssessmentProvider, useAssessment } from './contexts/AssessmentContext'
import { StartPage } from './components/StartPage'
import { AssessmentView } from './components/AssessmentView'
import { SubmissionPage } from './components/SubmissionPage'
import './index.css'

const AppContent = () => {
  const { isStarted, isSubmitted } = useAssessment()

  if (isSubmitted) {
    return <SubmissionPage />
  }

  if (isStarted) {
    return <AssessmentView />
  }

  return <StartPage />
}

export function App() {
  return (
    <AssessmentProvider>
      <AppContent />
    </AssessmentProvider>
  )
}

export default App

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Upload from '@/pages/Upload';
import Results from '@/pages/Results';
import ResumeDetails from '@/pages/ResumeDetails';
import Compare from '@/pages/Compare';
import Recommendations from '@/pages/Recommendation';
import Chatbot from '@/pages/Chatbot';
import Feedback from '@/pages/Feedback';
import Settings from '@/pages/Settings';
import FAQ from '@/pages/FAQ';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/results" element={<Results />} />
              <Route path="/resume/:id" element={<ResumeDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
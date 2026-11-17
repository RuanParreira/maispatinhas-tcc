import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/auth/AuthProvider'
import './index.css'
import App from './App.jsx'

// Router de dados só para habilitar o useBlocker; as rotas continuam no App.
const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <AuthProvider>
        <TooltipProvider>
          <App />
          <Toaster position="top-center" />
        </TooltipProvider>
      </AuthProvider>
    ),
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

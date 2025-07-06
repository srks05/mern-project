import React from 'react'
import AppRoutes from './AppRoutes'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <div>
      <AuthProvider>
      <AppRoutes/>
      </AuthProvider>
    </div>
  )
}

export default App
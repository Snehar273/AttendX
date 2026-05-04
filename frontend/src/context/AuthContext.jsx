import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('ax_token'))

  useEffect(() => {
    const u = localStorage.getItem('ax_user')
    if (u && token) setUser(JSON.parse(u))
  }, [])

  const login = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('ax_token', accessToken)
    localStorage.setItem('ax_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('ax_token')
    localStorage.removeItem('ax_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
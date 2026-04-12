import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useGoogleLogin } from '@react-oauth/google'

const API = "https://electronics-shop-api-id3m.onrender.com";

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /[0-9]/.test(password) },
    { label: 'Contains special char', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const barColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`flex-1 h-1.5 rounded ${i < score ? barColors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  )
}

function Spinner() {
  return <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
}

function InputField({ label, error, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="relative">
        <input {...props} className="w-full border px-3 py-2 rounded-lg" />
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function GoogleIcon() {
  return <span>G</span>
}

export default function AuthPage() {
  const { login, user } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // ✅ FIXED HOOK
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json())

        const res = await fetch(`${API}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: tokenResponse.access_token,
            email: userInfo.email,
            name: userInfo.name
          }),
        })

        const data = await res.json()
        if (!res.ok) { setErrors({ general: data.error }); return }
        localStorage.setItem('token', data.token)
        login(data.user)
        navigate('/')
      } catch {
        setErrors({ general: 'Google login failed' })
      }
    }
  })

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error })
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({ general: 'Network error' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">

        {errors.general && <div className="text-red-500">{errors.general}</div>}

        <form onSubmit={handleLogin} className="space-y-3">
          <InputField
            label="Email"
            value={loginForm.email}
            onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
          />

          <InputField
            label="Password"
            type="password"
            value={loginForm.password}
            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? <Spinner /> : 'Login'}
          </button>
        </form>

        <button onClick={() => googleLogin()} className="w-full border py-2 rounded flex justify-center gap-2">
          <GoogleIcon /> Google
        </button>

      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

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
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const labelColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600']
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < score ? barColors[score - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {score > 0 && <p className={`text-xs font-semibold ${labelColors[score]}`}>{labels[score]}</p>}
      <div className="grid grid-cols-2 gap-1">
        {checks.map(c => (
          <div
            key={c.label}
            className={`text-xs flex items-center gap-1 ${
              c.pass ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span>{c.pass ? '✓' : '○'}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

import { useGoogleLogin } from '@react-oauth/google'

// Inside AuthPage component, add this:
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // Get user info from Google
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      }).then(r => r.json())

      // Send to our backend
      const res = await fetch(`${API}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: tokenResponse.access_token, email: userInfo.email, name: userInfo.name }),
      })
      const data = await res.json()
      if (!res.ok) { setErrors({ general: data.error }); return }
      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({ general: 'Google login failed. Try again.' })
    }
  },
  onError: () => setErrors({ general: 'Google login failed. Try again.' })
})



function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function AuthPage() {
  const { login, user } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false })
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const updateLogin = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setLoginForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
    if (errors.general) setErrors(er => ({ ...er, general: '' }))
  }

  const updateRegister = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setRegisterForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
    if (errors.general) setErrors(er => ({ ...er, general: '' }))
  }

  const validateLogin = () => {
    const e = {}
    if (!loginForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = 'Invalid email address'
    if (!loginForm.password) e.password = 'Password is required'
    return e
  }

  const validateRegister = () => {
    const e = {}
    if (!registerForm.firstName.trim()) e.firstName = 'First name is required'
    if (!registerForm.lastName.trim()) e.lastName = 'Last name is required'
    if (!registerForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) e.email = 'Invalid email address'
    if (!registerForm.phone) e.phone = 'Phone number is required'
    if (!registerForm.password) e.password = 'Password is required'
    else if (registerForm.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!registerForm.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (registerForm.password !== registerForm.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!registerForm.agreeTerms) e.agreeTerms = 'You must agree to the terms'
    return e
  }

  const handleLogin = async e => {
    e.preventDefault()
    const errs = validateLogin()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error || 'Invalid email or password' })
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({ general: 'Network error. Check your connection and try again.' })
    }
    setLoading(false)
  }

  const handleRegister = async e => {
    e.preventDefault()
    const errs = validateRegister()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${registerForm.firstName} ${registerForm.lastName}`,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error || 'Registration failed' })
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({ general: 'Network error. Check your connection and try again.' })
    }
    setLoading(false)
  }

  const switchMode = newMode => {
    setMode(newMode)
    setErrors({})
    setShowPassword(false)
    setShowConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
              TS
            </div>
            <span className="font-black text-2xl text-gray-900">
              Tech<span className="text-blue-600">Store</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {mode === 'login'
              ? 'Welcome back! Sign in to your account'
              : 'Join thousands of happy shoppers'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Mode tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {[['login', 'Sign In'], ['register', 'Create Account']].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchMode(tab)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  mode === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* General error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <InputField
                label="Email Address"
                type="email"
                value={loginForm.email}
                onChange={updateLogin('email')}
                error={errors.email}
                placeholder="you@example.com"
                required
              />
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={updateLogin('password')}
                error={errors.password}
                placeholder="Enter your password"
                required
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginForm.remember}
                    onChange={updateLogin('remember')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:underline font-semibold">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base"
              >
                {loading && <Spinner />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchMode('register')} className="text-blue-600 font-bold hover:underline">
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="First Name"
                  value={registerForm.firstName}
                  onChange={updateRegister('firstName')}
                  error={errors.firstName}
                  placeholder="John"
                  required
                />
                <InputField
                  label="Last Name"
                  value={registerForm.lastName}
                  onChange={updateRegister('lastName')}
                  error={errors.lastName}
                  placeholder="Doe"
                  required
                />
              </div>

              <InputField
                label="Email Address"
                type="email"
                value={registerForm.email}
                onChange={updateRegister('email')}
                error={errors.email}
                placeholder="you@example.com"
                required
              />

              <InputField
                label="Phone Number"
                type="tel"
                value={registerForm.phone}
                onChange={updateRegister('phone')}
                error={errors.phone}
                placeholder="+123456789"
                required
              />

              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={updateRegister('password')}
                error={errors.password}
                placeholder="Enter password"
                required
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <PasswordStrength password={registerForm.password} />

              <InputField
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                value={registerForm.confirmPassword}
                onChange={updateRegister('confirmPassword')}
                error={errors.confirmPassword}
                placeholder="Confirm password"
                required
              >
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={registerForm.agreeTerms}
                  onChange={updateRegister('agreeTerms')}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
              </label>
              {errors.agreeTerms && <p className="text-xs text-red-500 mt-1">⚠ {errors.agreeTerms}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base"
              >
                {loading && <Spinner />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')} className="text-blue-600 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* Social login */}
          <div className="mt-6 space-y-3">
            <button
  type="button"
  onClick={() => googleLogin()}
  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
>
  <GoogleIcon /> Google
</button>
            
          </div>
        </div>
      </div>
    </div>
  )
}
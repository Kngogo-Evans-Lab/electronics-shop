import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const API = 'https://electronics-shop-api-id3m.onrender.com'

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
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
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i < score ? barColors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      {score > 0 && <p className={`text-xs font-semibold ${labelColors[score]}`}>{labels[score]}</p>}
      <div className="grid grid-cols-2 gap-1">
        {checks.map(c => (
          <div key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{c.pass ? 'v' : 'o'}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
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
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false,
  })

  useEffect(() => { if (user) navigate('/') }, [user, navigate])

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
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      })
      const data = await res.json()
      if (!res.ok) { setErrors({ general: data.error || 'Invalid email or password' }); setLoading(false); return }
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
    if (Object.keys(errs).length) { setErrors(errs); return }
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
      if (!res.ok) { setErrors({ general: data.error || 'Registration failed' }); setLoading(false); return }
      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({ general: 'Network error. Check your connection and try again.' })
    }
    setLoading(false)
  }

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  const InputField = ({ label, type = 'text', value, onChange, error, placeholder, required, children }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">&#9888; {error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">TS</div>
            <span className="font-black text-2xl text-gray-900">Tech<span className="text-blue-600">Store</span></span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {mode === 'login' ? 'Welcome back! Sign in to your account' : 'Join thousands of happy shoppers'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {[['login', 'Sign In'], ['register', 'Create Account']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setErrors({}) }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  mode === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">&#9888;</span>
              <span>{errors.general}</span>
            </div>
          )}

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
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={loginForm.remember} onChange={updateLogin('remember')} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:underline font-semibold">Forgot password?</button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base">
                {loading && <Spinner />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setErrors({}) }} className="text-blue-600 font-bold hover:underline">Create one</button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name" value={registerForm.firstName} onChange={updateRegister('firstName')} error={errors.firstName} placeholder="John" required />
                <InputField label="Last Name" value={registerForm.lastName} onChange={updateRegister('lastName')} error={errors.lastName} placeholder="Doe" required />
              </div>
              <InputField label="Email Address" type="email" value={registerForm.email} onChange={updateRegister('email')} error={errors.email} placeholder="you@example.com" required />
              <InputField label="Phone Number" type="tel" value={registerForm.phone} onChange={updateRegister('phone')} error={errors.phone} placeholder="+254 700 000 000" required />
              <div>
                <InputField label="Password" type={showPassword ? 'text' : 'password'} value={registerForm.password} onChange={updateRegister('password')} error={errors.password} placeholder="Min 6 characters" required>
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </InputField>
                <PasswordStrength password={registerForm.password} />
              </div>
              <InputField label="Confirm Password" type={showConfirm ? 'text' : 'password'} value={registerForm.confirmPassword} onChange={updateRegister('confirmPassword')} error={errors.confirmPassword} placeholder="Repeat your password" required>
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={registerForm.agreeTerms} onChange={updateRegister('agreeTerms')} className="w-4 h-4 text-blue-600 rounded border-gray-300 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">
                    I agree to the <button type="button" className="text-blue-600 hover:underline font-semibold">Terms of Service</button> and <button type="button" className="text-blue-600 hover:underline font-semibold">Privacy Policy</button>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-red-500 mt-1">&#9888; {errors.agreeTerms}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base">
                {loading && <Spinner />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setErrors({}) }} className="text-blue-600 font-bold hover:underline">Sign in</button>
              </p>
            </form>
          )}

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button"
              onClick={() => { login({ id: Date.now(), name: 'Google User', email: 'user@gmail.com', phone: '' }); navigate('/') }}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors">
              <GoogleIcon /> Google
            </button>
            <button type="button"
              onClick={() => { login({ id: Date.now(), name: 'Apple User', email: 'user@icloud.com', phone: '' }); navigate('/') }}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold text-gray-700 transition-colors">
              <AppleIcon /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
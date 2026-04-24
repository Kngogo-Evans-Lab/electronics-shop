import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useGoogleLogin } from '@react-oauth/google'

const API = "https://electronics-shop-api-id3m.onrender.com"

// ── small pieces ───────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ chars',  pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number',    pass: /[0-9]/.test(password) },
    { label: 'Symbol',    pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score      = checks.filter(c => c.pass).length
  const barColors  = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const textColors = ['text-red-400', 'text-orange-400', 'text-yellow-500', 'text-green-500']
  const labels     = ['Weak', 'Fair', 'Good', 'Strong']
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className={`flex-1 h-1 rounded transition-all ${i < score ? barColors[score-1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        {score > 0 && <span className={`text-xs font-semibold ${textColors[score-1]}`}>{labels[score-1]}</span>}
        <div className="flex gap-2 ml-auto">
          {checks.map((c, i) => (
            <span key={i} className={`text-xs ${c.pass ? 'text-green-500' : 'text-gray-400'}`}>
              {c.pass ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function OtpInput({ length = 6, value, onChange }) {
  const refs   = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const handle = (i, e) => {
    const val  = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]; next[i] = val
    onChange(next.join(''))
    if (val && i < length - 1) refs.current[i + 1]?.focus()
  }
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center my-4">
      {digits.map((d, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={e => handle(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          className={`w-11 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all
            ${d ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-300 bg-white text-gray-900'}
            focus:border-blue-500`}
          style={{ height: '52px' }}
        />
      ))}
    </div>
  )
}

function Stepper({ steps, current }) {
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${i < current ? 'bg-green-500 text-white' : i === current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i < current
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${i === current ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-1 mb-4 transition-all ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── icons ──────────────────────────────────────────────────────────────────────

const emailIco = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const lockIco = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const userIco = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const eyeOpen = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const eyeClosed = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>
  </svg>
)
const warnIco = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

// ── main component ─────────────────────────────────────────────────────────────

export default function AuthPage() {
  const { login, user } = useApp()
  const navigate        = useNavigate()
  const [searchParams]  = useSearchParams()

  const [mode,        setMode]        = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [step,        setStep]        = useState(0)
  const [loading,     setLoading]     = useState(false)
  const [errors,      setErrors]      = useState({})
  const [showPwd,     setShowPwd]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otp,         setOtp]         = useState('')
  const [otpError,    setOtpError]    = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [showToast,   setShowToast]   = useState(false)
  const timerRef = useRef(null)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm,   setRegForm]   = useState({ name: '', email: '', password: '', confirm: '' })

  useEffect(() => { if (user) navigate('/') }, [user, navigate])
  useEffect(() => () => clearInterval(timerRef.current), [])

  const startTimer = () => {
    setResendTimer(60)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0 } return t - 1 })
    }, 1000)
  }

  const switchMode = (m) => {
    setMode(m); setStep(0); setErrors({}); setOtp(''); setOtpError('')
  }

  // ── Google OAuth ────────────────────────────────────────────────────────────
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
            name:  userInfo.name,
          }),
        })
        const data = await res.json()
        if (!res.ok) { setErrors({ general: data.error }); return }
        localStorage.setItem('token', data.token)
        login(data.user)
        navigate('/')
      } catch {
        setErrors({ general: 'Google login failed. Please try again.' })
      }
    },
    onError: () => setErrors({ general: 'Google login failed. Please try again.' }),
  })

  // ── Login ───────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) { setErrors({ general: data.message || data.error }); setLoading(false); return }
      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({ general: 'Network error. Please try again.' })
    }
    setLoading(false)
  }

  // ── Validate register (email only) ──────────────────────────────────────────
  const validateReg = () => {
    const e = {}
    if (!regForm.name.trim())                                  e.name     = 'Full name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email))   e.email    = 'Enter a valid email address'
    if (regForm.password.length < 8)                          e.password = 'Minimum 8 characters'
    if (regForm.password !== regForm.confirm)                 e.confirm  = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Step 0: Send OTP to email ────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!validateReg()) return
    setLoading(true)
    setErrors({})
    try {
      const res  = await fetch(`${API}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: 'email', email: regForm.email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error || 'Failed to send code. Please try again.' })
        setLoading(false)
        return
      }
      setStep(1)
      startTimer()
    } catch {
      setErrors({ general: 'Network error. Please try again.' })
    }
    setLoading(false)
  }

  // ── Step 1: Verify OTP & create account ─────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 6) { setOtpError('Enter the complete 6-digit code'); return }
    setLoading(true)
    setOtpError('')
    try {
      const res  = await fetch(`${API}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     regForm.name,
          email:    regForm.email,
          password: regForm.password,
          otp,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOtpError(data.error || 'Invalid or expired code. Please try again.')
        setLoading(false)
        return
      }
      setOtpError('')
      setShowToast(true)
      setTimeout(() => { setShowToast(false); switchMode('login') }, 2500)
    } catch {
      setOtpError('Network error. Please try again.')
    }
    setLoading(false)
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return
    setOtp(''); setOtpError('')
    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ type: 'email', email: regForm.email }),
      })
      if (res.ok) startTimer()
    } catch { /* silent fail */ }
  }

  // ── helpers ─────────────────────────────────────────────────────────────────
  const inputCls = (err) =>
    `w-full border ${err ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'} px-3 py-2.5 pl-10 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all`

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
      {show ? eyeOpen : eyeClosed}
    </button>
  )

  const FieldIcon = ({ icon }) => (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex">
      {icon}
    </span>
  )

  const ErrorMsg = ({ msg }) => msg ? (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{warnIco}{msg}</p>
  ) : null

  const GeneralError = () => errors.general ? (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 flex items-center gap-2">
      {warnIco} {errors.general}
    </div>
  ) : null

  const Divider = () => (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">or continue with</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )

  const GoogleBtn = () => (
    <button type="button" onClick={() => googleLogin()}
      className="w-full flex items-center justify-center gap-2.5 border border-gray-300 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-all">
      <GoogleIcon /> Continue with Google
    </button>
  )

  // ── render: LOGIN ────────────────────────────────────────────────────────────
  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email or Phone</label>
        <div className="relative">
          <FieldIcon icon={emailIco} />
          <input type="text" placeholder="Enter email or phone number"
            value={loginForm.email}
            onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
            className={inputCls(false)} />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <FieldIcon icon={lockIco} />
          <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password"
            value={loginForm.password}
            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
            className={`${inputCls(false)} pr-10`} />
          <EyeBtn show={showPwd} toggle={() => setShowPwd(v => !v)} />
        </div>
      </div>

      <GeneralError />

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
        {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
      </button>

      <Divider />
      <GoogleBtn />
    </form>
  )

  // ── render: REGISTER step 0 ──────────────────────────────────────────────────
  const renderRegDetails = () => (
    <form onSubmit={handleSendOtp} className="space-y-4">

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <FieldIcon icon={userIco} />
          <input type="text" placeholder="Your full name"
            value={regForm.name}
            onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
            className={inputCls(errors.name)} />
        </div>
        <ErrorMsg msg={errors.name} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <FieldIcon icon={emailIco} />
          <input type="email" placeholder="you@example.com"
            value={regForm.email}
            onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
            className={inputCls(errors.email)} />
        </div>
        <ErrorMsg msg={errors.email} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <div className="relative">
          <FieldIcon icon={lockIco} />
          <input type={showPwd ? 'text' : 'password'} placeholder="Minimum 8 characters"
            value={regForm.password}
            onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
            className={`${inputCls(errors.password)} pr-10`} />
          <EyeBtn show={showPwd} toggle={() => setShowPwd(v => !v)} />
        </div>
        <PasswordStrength password={regForm.password} />
        <ErrorMsg msg={errors.password} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <FieldIcon icon={lockIco} />
          <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password"
            value={regForm.confirm}
            onChange={e => setRegForm(f => ({ ...f, confirm: e.target.value }))}
            className={`${inputCls(errors.confirm)} pr-10`} />
          <EyeBtn show={showConfirm} toggle={() => setShowConfirm(v => !v)} />
        </div>
        <ErrorMsg msg={errors.confirm} />
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        By registering you agree to our{' '}
        <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
        <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
      </p>

      <GeneralError />

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
        {loading ? <><Spinner /> Sending code…</> : 'Continue →'}
      </button>

      <Divider />
      <GoogleBtn />
    </form>
  )

  // ── render: REGISTER step 1 — verify email ───────────────────────────────────
  const renderVerify = () => (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center mx-auto mb-5 shadow-md">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">Verify your email address</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-1">We sent a 6-digit verification code to</p>
      <p className="text-sm font-semibold text-gray-800 mb-2">{regForm.email}</p>
      <p className="text-xs text-gray-400 mb-4">Check your inbox (and spam folder)</p>

      <OtpInput length={6} value={otp} onChange={setOtp} />

      {otpError && (
        <p className="text-xs text-red-500 flex items-center justify-center gap-1 mb-3">
          {warnIco} {otpError}
        </p>
      )}

      <button onClick={handleVerifyOtp} disabled={loading}
        className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mb-5 shadow-sm">
        {loading ? <><Spinner /> Verifying…</> : 'Verify & Create Account'}
      </button>

      <p className="text-sm text-gray-500">
        Didn't receive the code?{' '}
        {resendTimer > 0
          ? <span className="text-orange-400 font-medium">Resend in {resendTimer}s</span>
          : <button type="button" onClick={handleResend} className="text-orange-400 font-semibold hover:underline">Resend now</button>
        }
      </p>

      <button type="button" onClick={() => { setStep(0); setOtp(''); setOtpError('') }}
        className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Change email address
      </button>
    </div>
  )

  // ── page shell ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">

      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-white border border-green-200 shadow-2xl rounded-2xl px-6 py-4 min-w-72">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Account created successfully!</p>
              <p className="text-xs text-gray-500 mt-0.5">Redirecting you to sign in…</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-blue-900 tracking-tight">TechStore</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Kenya's trusted electronics marketplace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} type="button" onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                  ${mode === m ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {mode === 'register' && <Stepper steps={['Your Details', 'Verify Email']} current={step} />}

          {mode === 'login'                  && renderLogin()}
          {mode === 'register' && step === 0 && renderRegDetails()}
          {mode === 'register' && step === 1 && renderVerify()}
        </div>

        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
          <Link to="/help"    className="hover:text-gray-600 transition-colors">Help Center</Link>
          <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms"   className="hover:text-gray-600 transition-colors">Terms of Service</Link>
        </div>

      </div>
    </div>
  )
}
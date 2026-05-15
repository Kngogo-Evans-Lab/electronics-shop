// FILE: src/pages/ResetPasswordPage.jsx
// Route: /reset-password?token=<rawToken>
// Also doubles as /forgot-password when no token is present in URL

import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

const API = 'https://electronics-shop-api-id3m.onrender.com'

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin inline-block">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function PasswordStrength({ pw }) {
  if (!pw) return null
  const checks = [
    { label: '8+',  ok: pw.length >= 8 },
    { label: 'A-Z', ok: /[A-Z]/.test(pw) },
    { label: '0-9', ok: /[0-9]/.test(pw) },
    { label: '!@#', ok: /[^A-Za-z0-9]/.test(pw) },
  ]
  const score = checks.filter(c => c.ok).length
  const bars  = ['bg-red-400','bg-orange-400','bg-yellow-400','bg-green-500']
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div key={i} className={`flex-1 h-1 rounded transition-all ${i < score ? bars[score-1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex gap-2">
        {checks.map((c,i) => (
          <span key={i} className={`text-xs ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [searchParams]   = useSearchParams()
  const navigate         = useNavigate()
  const token            = searchParams.get('token')

  // ── Forgot Password (no token) ─────────────────────────────────────────────
  const [email,    setEmail]    = useState('')
  const [sent,     setSent]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email')
    setLoading(true); setError('')
    try {
      await fetch(`${API}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      setSent(true) // always show success (prevents enumeration)
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  // ── Reset Password (has token) ─────────────────────────────────────────────
  const [newPw,    setNewPw]    = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [done,     setDone]     = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPw.length < 8)     return setError('Password must be at least 8 characters')
    if (newPw !== confirm)    return setError('Passwords do not match')
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${API}/api/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, newPassword: newPw }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setDone(true)
      setTimeout(() => navigate('/auth'), 3000)
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all bg-white'
  const btn = 'w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-indigo-900 tracking-tight">TechStore</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* ── FORGOT PASSWORD ────────────────────────────────────────────── */}
          {!token && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Forgot your password?</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send you a reset link.</p>
              </div>

              {sent ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900">Check your inbox</p>
                  <p className="text-sm text-gray-500 mt-1">If <strong>{email}</strong> is registered, a reset link is on its way.</p>
                  <Link to="/auth" className="mt-4 inline-block text-sm text-indigo-600 font-semibold hover:underline">← Back to Sign In</Link>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" className={inp} />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={loading} className={btn}>
                    {loading ? <><Spinner /> Sending…</> : 'Send Reset Link'}
                  </button>
                  <Link to="/auth" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-2">← Back to Sign In</Link>
                </form>
              )}
            </>
          )}

          {/* ── RESET PASSWORD ──────────────────────────────────────────────── */}
          {token && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Set new password</h2>
                <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account.</p>
              </div>

              {done ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900">Password reset!</p>
                  <p className="text-sm text-gray-500 mt-1">Redirecting you to sign in…</p>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={newPw}
                        onChange={e => setNewPw(e.target.value)}
                        placeholder="Min 8 characters" className={`${inp} pr-10`} />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    <PasswordStrength pw={newPw} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Re-enter password" className={inp} />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={loading} className={btn}>
                    {loading ? <><Spinner /> Saving…</> : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
// FILE: src/components/SecurityTab.jsx
// Drop this inside your AccountPage as the Security tab content.
// Requires: useApp() providing { user, token, updateUser, logout, toast }

import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'

const API = 'https://electronics-shop-api-id3m.onrender.com'

// ── tiny helpers ───────────────────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className="animate-spin inline-block">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function OtpInput({ length = 6, value, onChange }) {
  const refs   = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)
  const handle = (i, e) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const n = [...digits]; n[i] = v
    onChange(n.join(''))
    if (v && i < length - 1) refs.current[i + 1]?.focus()
  }
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(p.padEnd(length, '').slice(0, length))
    refs.current[Math.min(p.length, length - 1)]?.focus()
  }
  return (
    <div className="flex gap-2 justify-center my-3">
      {digits.map((d, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={e => handle(i, e)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
          className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-lg outline-none transition-all
            ${d ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-gray-300 bg-white text-gray-900'}
            focus:border-indigo-500`}
        />
      ))}
    </div>
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

// ── Section card wrapper ───────────────────────────────────────────────────────
function Card({ icon, title, subtitle, badge, badgeColor = 'bg-green-100 text-green-700', children, action }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl transition-all ${open ? 'border-indigo-300 shadow-md' : 'border-gray-200'} bg-white overflow-hidden`}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
        {action && !open && (
          <button
            onClick={e => { e.stopPropagation(); setOpen(true) }}
            className="ml-2 px-4 py-1.5 rounded-full border border-indigo-500 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 transition-colors">
            {action}
          </button>
        )}
        <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && <div className="px-5 pb-5 pt-1 border-t border-gray-100">{children}</div>}
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────
export default function SecurityTab() {
  const { user, token, updateUser, logout, toast } = useApp()

  // shared
  const [loading, setLoading] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const timerRef = useRef(null)
  const startTimer = () => {
    setResendTimer(60)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0 } return t - 1 })
    }, 1000)
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token || localStorage.getItem('token')}`,
  }

  const call = async (method, path, body) => {
    const res  = await fetch(`${API}/api/auth${path}`, {
      method,
      headers: authHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong')
    return data
  }

  // ── Change Password ──────────────────────────────────────────────────────────
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError]   = useState('')
  const [showPws, setShowPws]   = useState({ current: false, next: false, confirm: false })

  const handleChangePw = async () => {
    setPwError('')
    if (!pwForm.current)                          return setPwError('Enter your current password')
    if (pwForm.next.length < 8)                   return setPwError('New password must be 8+ characters')
    if (pwForm.next !== pwForm.confirm)            return setPwError('Passwords do not match')
    setLoading('pw')
    try {
      await call('POST', '/change-password', { currentPassword: pwForm.current, newPassword: pwForm.next })
      toast?.('Password changed successfully!', 'success')
      setPwForm({ current: '', next: '', confirm: '' })
    } catch (e) { setPwError(e.message) }
    setLoading('')
  }

  // ── Email Verification ───────────────────────────────────────────────────────
  const [emailOtp,   setEmailOtp]   = useState('')
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailErr,   setEmailErr]   = useState('')

  const sendEmailOtp = async () => {
    setEmailErr(''); setLoading('email')
    try {
      await call('POST', '/send-email-verify', {})
      setEmailOtpSent(true)
      startTimer()
      toast?.('Verification code sent to your email', 'info')
    } catch (e) { setEmailErr(e.message) }
    setLoading('')
  }

  const verifyEmail = async () => {
    if (emailOtp.length < 6) return setEmailErr('Enter the 6-digit code')
    setEmailErr(''); setLoading('email-verify')
    try {
      await call('POST', '/verify-email', { otp: emailOtp })
      updateUser?.({ emailVerified: true })
      toast?.('Email verified!', 'success')
      setEmailOtpSent(false); setEmailOtp('')
    } catch (e) { setEmailErr(e.message) }
    setLoading('')
  }

  // ── Phone Verification ───────────────────────────────────────────────────────
  const [phoneInput,   setPhoneInput]   = useState(user?.phone || '')
  const [phoneOtp,     setPhoneOtp]     = useState('')
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [phoneErr,     setPhoneErr]     = useState('')

  const sendPhoneOtp = async () => {
    if (!phoneInput) return setPhoneErr('Enter your phone number')
    setPhoneErr(''); setLoading('phone')
    try {
      await call('POST', '/send-phone-otp', { phone: phoneInput })
      setPhoneOtpSent(true)
      startTimer()
      toast?.('Verification code sent via SMS', 'info')
    } catch (e) { setPhoneErr(e.message) }
    setLoading('')
  }

  const verifyPhone = async () => {
    if (phoneOtp.length < 6) return setPhoneErr('Enter the 6-digit code')
    setPhoneErr(''); setLoading('phone-verify')
    try {
      await call('POST', '/verify-phone', { otp: phoneOtp })
      updateUser?.({ phoneVerified: true, phone: phoneInput })
      toast?.('Phone verified!', 'success')
      setPhoneOtpSent(false); setPhoneOtp('')
    } catch (e) { setPhoneErr(e.message) }
    setLoading('')
  }

  // ── 2FA ──────────────────────────────────────────────────────────────────────
  const [tfaPhone,   setTfaPhone]   = useState(user?.twoFAPhone || '')
  const [tfaOtp,     setTfaOtp]     = useState('')
  const [tfaOtpSent, setTfaOtpSent] = useState(false)
  const [tfaErr,     setTfaErr]     = useState('')

  const send2FAOtp = async () => {
    if (!tfaPhone) return setTfaErr('Enter your phone number for 2FA')
    setTfaErr(''); setLoading('2fa')
    try {
      await call('POST', '/2fa/send', { phone: tfaPhone })
      setTfaOtpSent(true)
      startTimer()
      toast?.('2FA setup code sent via SMS', 'info')
    } catch (e) { setTfaErr(e.message) }
    setLoading('')
  }

  const enable2FA = async () => {
    if (tfaOtp.length < 6) return setTfaErr('Enter the 6-digit code')
    setTfaErr(''); setLoading('2fa-enable')
    try {
      await call('POST', '/2fa/enable', { otp: tfaOtp })
      updateUser?.({ twoFAEnabled: true, twoFAPhone: tfaPhone })
      toast?.('Two-factor authentication enabled!', 'success')
      setTfaOtpSent(false); setTfaOtp('')
    } catch (e) { setTfaErr(e.message) }
    setLoading('')
  }

  const disable2FA = async () => {
    setLoading('2fa-disable')
    try {
      await call('POST', '/2fa/disable', {})
      updateUser?.({ twoFAEnabled: false })
      toast?.('2FA disabled', 'info')
    } catch (e) { toast?.(e.message, 'error') }
    setLoading('')
  }

  // ── Login Alerts ─────────────────────────────────────────────────────────────
  const [alerts,  setAlerts]  = useState(user?.loginAlertsEnabled ?? false)
  const [history, setHistory] = useState(null)

  const toggleAlerts = async () => {
    setLoading('alerts')
    try {
      const d = await call('POST', '/login-alerts', { enabled: !alerts })
      setAlerts(d.loginAlertsEnabled)
      updateUser?.({ loginAlertsEnabled: d.loginAlertsEnabled })
      toast?.(`Login alerts ${d.loginAlertsEnabled ? 'enabled' : 'disabled'}`, 'success')
    } catch (e) { toast?.(e.message, 'error') }
    setLoading('')
  }

  const loadHistory = async () => {
    if (history) return
    try {
      const d = await call('GET', '/login-history')
      setHistory(d.loginHistory || [])
    } catch { setHistory([]) }
  }

  // ── shared input style ────────────────────────────────────────────────────────
  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all bg-white'
  const btn = 'w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60'
  const err = (msg) => msg ? <p className="text-xs text-red-500 mt-1.5">{msg}</p> : null
  const resend = (fn) => (
    <p className="text-xs text-center text-gray-500 mt-2">
      Didn't get the code?{' '}
      {resendTimer > 0
        ? <span className="text-indigo-500">Resend in {resendTimer}s</span>
        : <button onClick={fn} className="text-indigo-600 font-semibold hover:underline">Resend</button>}
    </p>
  )

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-3 max-w-2xl">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-500">Keep your account safe and secure</p>
      </div>

      {/* ── CHANGE PASSWORD ─────────────────────────────────────────────────── */}
      <Card icon="🔑" title="Password"
        subtitle={`Last changed: ${user?.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleDateString() : 'Never'}`}
        action="Change Password">
        <div className="space-y-3 mt-2">
          {['current','next','confirm'].map((k, i) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">
                {k === 'current' ? 'Current Password' : k === 'next' ? 'New Password' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  type={showPws[k] ? 'text' : 'password'}
                  value={pwForm[k]}
                  onChange={e => setPwForm(f => ({ ...f, [k]: e.target.value }))}
                  placeholder={k === 'current' ? '••••••••' : k === 'next' ? 'Min 8 characters' : 'Re-enter new password'}
                  className={`${inp} pr-10`}
                />
                <button type="button" onClick={() => setShowPws(s => ({ ...s, [k]: !s[k] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPws[k]
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {k === 'next' && <PasswordStrength pw={pwForm.next} />}
            </div>
          ))}
          {err(pwError)}
          <button onClick={handleChangePw} disabled={loading === 'pw'} className={btn}>
            {loading === 'pw' ? <><Spinner /> Saving…</> : 'Save New Password'}
          </button>
        </div>
      </Card>

      {/* ── TWO-FACTOR AUTH ─────────────────────────────────────────────────── */}
      <Card icon="📱" title="Two-Factor Auth"
        subtitle={user?.twoFAEnabled ? `Active · ${user?.twoFAPhone || ''}` : 'Protect your account with 2FA'}
        badge={user?.twoFAEnabled ? 'Enabled' : undefined}
        badgeColor="bg-green-100 text-green-700"
        action={user?.twoFAEnabled ? undefined : 'Enable 2FA'}>
        {user?.twoFAEnabled ? (
          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="text-sm font-semibold text-green-800">2FA is active</p>
                <p className="text-xs text-green-600">SMS codes sent to {user?.twoFAPhone}</p>
              </div>
            </div>
            <button onClick={disable2FA} disabled={loading === '2fa-disable'}
              className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {loading === '2fa-disable' ? <><Spinner /> Disabling…</> : 'Disable 2FA'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <p className="text-xs text-gray-500">Enter the phone number that will receive SMS codes when you log in.</p>
            {!tfaOtpSent ? (
              <>
                <input value={tfaPhone} onChange={e => setTfaPhone(e.target.value)}
                  placeholder="+254712345678" className={inp} />
                {err(tfaErr)}
                <button onClick={send2FAOtp} disabled={loading === '2fa'} className={btn}>
                  {loading === '2fa' ? <><Spinner /> Sending…</> : 'Send Verification Code'}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 text-center">Enter the code sent to <strong>{tfaPhone}</strong></p>
                <OtpInput length={6} value={tfaOtp} onChange={setTfaOtp} />
                {err(tfaErr)}
                <button onClick={enable2FA} disabled={loading === '2fa-enable'} className={btn}>
                  {loading === '2fa-enable' ? <><Spinner /> Verifying…</> : 'Confirm & Enable 2FA'}
                </button>
                {resend(send2FAOtp)}
              </>
            )}
          </div>
        )}
      </Card>

      {/* ── EMAIL VERIFICATION ─────────────────────────────────────────────── */}
      <Card icon="📧" title="Email Verification"
        subtitle={user?.emailVerified ? `${user?.email} · Verified` : `${user?.email} · Not verified`}
        badge={user?.emailVerified ? 'Verified ✓' : 'Unverified'}
        badgeColor={user?.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
        action={user?.emailVerified ? undefined : 'Manage'}>
        {user?.emailVerified ? (
          <div className="flex items-center gap-3 mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Email verified</p>
              <p className="text-xs text-green-600">{user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {!emailOtpSent ? (
              <>
                <p className="text-xs text-gray-500">We'll send a verification code to <strong>{user?.email}</strong></p>
                {err(emailErr)}
                <button onClick={sendEmailOtp} disabled={loading === 'email'} className={btn}>
                  {loading === 'email' ? <><Spinner /> Sending…</> : 'Send Verification Code'}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 text-center">Enter the code sent to <strong>{user?.email}</strong></p>
                <OtpInput length={6} value={emailOtp} onChange={setEmailOtp} />
                {err(emailErr)}
                <button onClick={verifyEmail} disabled={loading === 'email-verify'} className={btn}>
                  {loading === 'email-verify' ? <><Spinner /> Verifying…</> : 'Verify Email'}
                </button>
                {resend(sendEmailOtp)}
              </>
            )}
          </div>
        )}
      </Card>

      {/* ── PHONE VERIFICATION ─────────────────────────────────────────────── */}
      <Card icon="📞" title="Mobile Verification"
        subtitle={user?.phoneVerified ? `${user?.phone} · Verified` : 'Verify your phone number via SMS'}
        badge={user?.phoneVerified ? 'Verified ✓' : undefined}
        action={user?.phoneVerified ? undefined : 'Verify'}>
        {user?.phoneVerified ? (
          <div className="flex items-center gap-3 mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Phone verified</p>
              <p className="text-xs text-green-600">{user?.phone}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {!phoneOtpSent ? (
              <>
                <p className="text-xs text-gray-500">Enter your phone number to receive a verification SMS.</p>
                <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)}
                  placeholder="+254712345678" className={inp} />
                {err(phoneErr)}
                <button onClick={sendPhoneOtp} disabled={loading === 'phone'} className={btn}>
                  {loading === 'phone' ? <><Spinner /> Sending SMS…</> : 'Send SMS Code'}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 text-center">Enter the code sent to <strong>{phoneInput}</strong></p>
                <OtpInput length={6} value={phoneOtp} onChange={setPhoneOtp} />
                {err(phoneErr)}
                <button onClick={verifyPhone} disabled={loading === 'phone-verify'} className={btn}>
                  {loading === 'phone-verify' ? <><Spinner /> Verifying…</> : 'Verify Phone'}
                </button>
                {resend(sendPhoneOtp)}
              </>
            )}
          </div>
        )}
      </Card>

      {/* ── LOGIN ALERTS ───────────────────────────────────────────────────── */}
      <Card icon="🔔" title="Login Alerts"
        subtitle="Get an email whenever your account is accessed"
        badge={alerts ? 'Active' : undefined}
        action="Configure"
        badgeColor="bg-orange-100 text-orange-700">
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Email me on new logins</p>
              <p className="text-xs text-gray-500">Sent to {user?.email}</p>
            </div>
            <button onClick={toggleAlerts} disabled={loading === 'alerts'}
              className={`relative w-12 h-6 rounded-full transition-colors ${alerts ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${alerts ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <button onClick={loadHistory}
            className="w-full text-xs text-indigo-600 hover:underline font-medium text-left">
            View recent login history ↓
          </button>

          {history && (
            history.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">No login history yet.</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-lg">
                      {h.device?.includes('Mobile') ? '📱' : h.device?.includes('Mac') ? '💻' : '🖥️'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{h.device}</p>
                      <p className="text-xs text-gray-500">{new Date(h.at).toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{h.ip}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  )
}
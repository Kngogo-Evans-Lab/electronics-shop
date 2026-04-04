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

import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from './context' // adjust if needed

// ✅ FIXED: moved outside + memoized
const InputField = React.memo(function InputField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
  children,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">&#9888; {error}</p>
      )}
    </div>
  )
})

export default function AuthPage() {
  const { login, user } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  )

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false,
  })

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
    const val =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value

    setLoginForm(f => ({ ...f, [field]: val }))

    if (errors[field])
      setErrors(er => ({ ...er, [field]: '' }))

    if (errors.general)
      setErrors(er => ({ ...er, general: '' }))
  }

  const updateRegister = field => e => {
    const val =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value

    setRegisterForm(f => ({ ...f, [field]: val }))

    if (errors[field])
      setErrors(er => ({ ...er, [field]: '' }))

    if (errors.general)
      setErrors(er => ({ ...er, general: '' }))
  }

  const validateLogin = () => {
    const e = {}
    if (!loginForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(loginForm.email))
      e.email = 'Invalid email address'
    if (!loginForm.password)
      e.password = 'Password is required'
    return e
  }

  const validateRegister = () => {
    const e = {}
    if (!registerForm.firstName.trim())
      e.firstName = 'First name is required'
    if (!registerForm.lastName.trim())
      e.lastName = 'Last name is required'
    if (!registerForm.email)
      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(registerForm.email))
      e.email = 'Invalid email address'
    if (!registerForm.phone)
      e.phone = 'Phone number is required'
    if (!registerForm.password)
      e.password = 'Password is required'
    else if (registerForm.password.length < 6)
      e.password = 'Password must be at least 6 characters'
    if (!registerForm.confirmPassword)
      e.confirmPassword = 'Please confirm your password'
    else if (
      registerForm.password !== registerForm.confirmPassword
    )
      e.confirmPassword = 'Passwords do not match'
    if (!registerForm.agreeTerms)
      e.agreeTerms = 'You must agree to the terms'
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
        body: JSON.stringify(loginForm),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({
          general: data.error || 'Invalid email or password',
        })
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({
        general:
          'Network error. Check your connection and try again.',
      })
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
        setErrors({
          general: data.error || 'Registration failed',
        })
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      login(data.user)
      navigate('/')
    } catch {
      setErrors({
        general:
          'Network error. Check your connection and try again.',
      })
    }

    setLoading(false)
  }

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* your JSX unchanged */}
    </div>
  )
}

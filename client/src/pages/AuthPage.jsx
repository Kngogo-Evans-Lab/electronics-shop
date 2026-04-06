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
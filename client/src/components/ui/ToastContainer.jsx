import { useApp } from '../../context/AppContext'

export default function ToastContainer() {
  const { toasts, dispatch } = useApp()
  if (!toasts.length) return null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white pointer-events-auto animate-bounce-in ${
            t.type === 'success' ? 'bg-green-600' :
            t.type === 'error'   ? 'bg-red-600'   : 'bg-gray-800'
          }`}
        >
          <span className="shrink-0 text-base">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => dispatch({ type: 'TOAST_REMOVE', id: t.id })}
            className="shrink-0 opacity-60 hover:opacity-100 text-base leading-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
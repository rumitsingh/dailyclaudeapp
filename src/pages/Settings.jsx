import { useState } from 'react'
import { scheduleWorkoutReminder, scheduleWeeklyScheduleReminder } from '../utils/notify.js'

export default function Settings({
  settings,
  updateSettings,
  fridge,
  addFridgeItem,
  removeFridgeItem,
  updateFridgeItem,
  notifications,
}) {
  const [keyVisible, setKeyVisible]     = useState(false)
  const [newStaple, setNewStaple]       = useState('')
  const [saved, setSaved]               = useState(false)

  const staples = fridge.filter(i => i.isStaple)

  const handleKeyChange = (e) => {
    updateSettings({ geminiKey: e.target.value })
  }

  const handleWorkoutTimeChange = (e) => {
    const time = e.target.value
    updateSettings({ workoutTime: time })
    scheduleWorkoutReminder(time)
  }

  const handleEnableNotifications = async () => {
    const result = await notifications.requestPermission()
    if (result === 'granted') {
      updateSettings({ notificationsEnabled: true })
      scheduleWorkoutReminder(settings.workoutTime)
      scheduleWeeklyScheduleReminder()
      notifications.addBanner('Notifications enabled!', 'info')
    } else {
      updateSettings({ notificationsEnabled: false })
      notifications.addBanner(
        result === 'unsupported'
          ? 'Notifications not supported on this device.'
          : 'Notification permission denied. You can enable it in device Settings.',
        'error'
      )
    }
  }

  const handleAddStaple = (e) => {
    e.preventDefault()
    if (!newStaple.trim()) return
    const item = addFridgeItem(newStaple.trim())
    updateFridgeItem(item.id, { isStaple: true })
    setNewStaple('')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const notifStatus = {
    granted:     { label: 'Enabled', colour: 'text-mist-sage' },
    denied:      { label: 'Blocked', colour: 'text-red-400' },
    default:     { label: 'Not set', colour: 'text-amber-500' },
    unsupported: { label: 'Not supported', colour: 'text-mist-text-muted' },
  }[notifications.permission] || { label: 'Unknown', colour: 'text-mist-text-muted' }

  return (
    <div className="flex flex-col gap-4 pb-2">
      <h1 className="font-lora text-2xl text-mist-warm pt-1">Settings</h1>

      {/* Gemini API Key */}
      <section className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <h2 className="font-inter text-sm font-semibold text-mist-warm mb-1">Gemini API Key</h2>
        <p className="text-xs font-inter text-mist-text-muted mb-3 leading-relaxed">
          Used for AI-powered quotes and dinner suggestions. Without it, curated offline content is used.
        </p>
        <div className="relative">
          <input
            type={keyVisible ? 'text' : 'password'}
            value={settings.geminiKey}
            onChange={handleKeyChange}
            placeholder="AIza..."
            className="w-full bg-mist-faint rounded-xl px-3 py-2.5 pr-10 text-sm font-inter text-mist-warm
              placeholder:text-mist-text-muted focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
          />
          <button
            onClick={() => setKeyVisible(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-text-muted"
            aria-label={keyVisible ? 'Hide key' : 'Show key'}
          >
            {keyVisible ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" className="w-4 h-4">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" className="w-4 h-4">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {settings.geminiKey && (
          <p className="text-[11px] font-inter text-mist-sage mt-2">AI features active</p>
        )}
      </section>

      {/* Workout time */}
      <section className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <h2 className="font-inter text-sm font-semibold text-mist-warm mb-1">Daily Workout Time</h2>
        <p className="text-xs font-inter text-mist-text-muted mb-3">
          You'll get a reminder at this time each day.
        </p>
        <input
          type="time"
          value={settings.workoutTime || '19:00'}
          onChange={handleWorkoutTimeChange}
          className="bg-mist-faint rounded-xl px-3 py-2.5 text-sm font-inter text-mist-warm
            focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
        />
      </section>

      {/* Notifications */}
      <section className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-inter text-sm font-semibold text-mist-warm">Notifications</h2>
          <span className={`text-xs font-inter font-medium ${notifStatus.colour}`}>
            {notifStatus.label}
          </span>
        </div>
        <p className="text-xs font-inter text-mist-text-muted mb-3 leading-relaxed">
          Workout and schedule reminders. On iOS, install as PWA for best results.
          In-app banners always work as a fallback.
        </p>
        <button
          onClick={handleEnableNotifications}
          disabled={notifications.permission === 'granted'}
          className="bg-mist-faint text-mist-warm rounded-xl px-4 py-2.5 text-sm font-inter font-medium
            disabled:opacity-40 w-full active:scale-95 transition-transform border border-mist-divider"
        >
          {notifications.permission === 'granted'
            ? 'Notifications enabled'
            : 'Enable notifications'
          }
        </button>
      </section>

      {/* Manage Staples */}
      <section className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <h2 className="font-inter text-sm font-semibold text-mist-warm mb-1">Pantry Staples</h2>
        <p className="text-xs font-inter text-mist-text-muted mb-3">
          Items always shown in your fridge list.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {staples.map(item => (
            <div key={item.id} className="flex items-center gap-1 bg-mist-faint rounded-full pl-3 pr-1 py-1.5">
              <span className="text-xs font-inter text-mist-warm">{item.name}</span>
              <button
                onClick={() => removeFridgeItem(item.id)}
                className="text-mist-text-muted hover:text-red-400 w-5 h-5 flex items-center justify-center"
                aria-label={`Remove ${item.name}`}
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" className="w-3 h-3">
                  <line x1="2" y1="2" x2="10" y2="10" />
                  <line x1="10" y1="2" x2="2" y2="10" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddStaple} className="flex gap-2">
          <input
            type="text"
            value={newStaple}
            onChange={e => setNewStaple(e.target.value)}
            placeholder="Add staple..."
            className="flex-1 bg-mist-faint rounded-xl px-3 py-2 text-sm font-inter text-mist-warm
              placeholder:text-mist-text-muted focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
          />
          <button
            type="submit"
            disabled={!newStaple.trim()}
            className="bg-mist-sage text-white rounded-xl px-3 py-2 text-sm font-inter font-medium
              disabled:opacity-40 active:scale-95 transition-transform"
          >
            Add
          </button>
        </form>
      </section>

      {/* About */}
      <section className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <h2 className="font-inter text-sm font-semibold text-mist-warm mb-2">About</h2>
        <p className="text-xs font-inter text-mist-text-muted leading-relaxed">
          Daily Assistant — your personal iPhone PWA for quotes, todos, dinner ideas, and weekly planning.
          Works fully offline with curated content.
        </p>
        <p className="text-[11px] font-inter text-mist-text-muted mt-2 opacity-60">
          Add to Home Screen for the best experience on iOS.
        </p>
      </section>
    </div>
  )
}

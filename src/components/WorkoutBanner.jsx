export default function WorkoutBanner({ workoutTime, onNavigate }) {
  const now = new Date()
  const [h, m] = (workoutTime || '19:00').split(':').map(Number)
  const workoutDate = new Date()
  workoutDate.setHours(h, m, 0, 0)

  const minutesUntil = Math.round((workoutDate - now) / 60000)
  const isPast  = minutesUntil < 0
  const isSoon  = minutesUntil >= 0 && minutesUntil <= 30

  const formatTime = (t) => {
    if (!t) return '7:00 PM'
    const [hh, mm] = t.split(':').map(Number)
    const period = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh % 12 || 12
    return `${h12}:${String(mm).padStart(2,'0')} ${period}`
  }

  return (
    <button
      onClick={() => onNavigate('settings')}
      className={`rounded-xl3 p-4 w-full text-left flex items-center gap-3 transition-colors
        ${isSoon ? 'bg-mist-sage text-white' : 'bg-mist-faint text-mist-warm'}`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
        ${isSoon ? 'bg-white/20' : 'bg-mist-sage/20'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className={`w-5 h-5 ${isSoon ? 'text-white' : 'text-mist-sage'}`}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-inter font-semibold leading-none
          ${isSoon ? 'text-white' : 'text-mist-warm'}`}>
          Workout
        </p>
        <p className={`text-xs font-inter mt-0.5
          ${isSoon ? 'text-white/80' : 'text-mist-text-muted'}`}>
          {isPast
            ? `Scheduled for ${formatTime(workoutTime)} — did you do it?`
            : isSoon
              ? `Starting in ${minutesUntil} minutes`
              : `Today at ${formatTime(workoutTime)}`
          }
        </p>
      </div>
    </button>
  )
}

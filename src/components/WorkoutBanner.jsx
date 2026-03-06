export default function WorkoutBanner({ workoutTime, onNavigate, isDone, onMarkDone }) {
  const now = new Date()
  const [h, m] = (workoutTime || '19:00').split(':').map(Number)
  const workoutDate = new Date()
  workoutDate.setHours(h, m, 0, 0)

  const minutesUntil = Math.round((workoutDate - now) / 60000)
  const isPast = minutesUntil < 0
  const isSoon = minutesUntil >= 0 && minutesUntil <= 30

  const formatTime = (t) => {
    if (!t) return '7:00 PM'
    const [hh, mm] = t.split(':').map(Number)
    const period = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh % 12 || 12
    return `${h12}:${String(mm).padStart(2, '0')} ${period}`
  }

  // Done state — green kudos
  if (isDone) {
    return (
      <div className="rounded-xl3 p-4 w-full flex items-center gap-3 bg-mist-sage">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-inter font-semibold text-white leading-none">Workout done!</p>
          <p className="text-xs font-inter text-white/80 mt-0.5">Great work today. Keep it up.</p>
        </div>
        <span className="text-xl select-none">🎉</span>
      </div>
    )
  }

  return (
    <div className={`rounded-xl3 p-4 w-full flex items-center gap-3
      ${isSoon ? 'bg-mist-sage' : 'bg-mist-faint'}`}>

      {/* Left: clock icon + text — taps to settings */}
      <button
        onClick={() => onNavigate('settings')}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
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
        <div className="min-w-0">
          <p className={`text-sm font-inter font-semibold leading-none
            ${isSoon ? 'text-white' : 'text-mist-warm'}`}>
            Workout
          </p>
          <p className={`text-xs font-inter mt-0.5
            ${isSoon ? 'text-white/80' : 'text-mist-text-muted'}`}>
            {isPast
              ? `Was at ${formatTime(workoutTime)} — did you do it?`
              : isSoon
                ? `Starting in ${minutesUntil} minutes`
                : `Today at ${formatTime(workoutTime)}`
            }
          </p>
        </div>
      </button>

      {/* Right: Done button */}
      <button
        onClick={onMarkDone}
        className={`flex-shrink-0 rounded-xl px-3 py-2 text-xs font-inter font-semibold
          transition-colors active:scale-95
          ${isSoon
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-mist-sage/15 text-mist-sage border border-mist-sage/30'
          }`}
      >
        Done
      </button>
    </div>
  )
}

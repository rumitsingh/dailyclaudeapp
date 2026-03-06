const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeekStrip() {
  const today = new Date()
  // JS getDay: 0=Sun...6=Sat, convert to Mon=0...Sun=6
  const dayOfWeek = (today.getDay() + 6) % 7

  return (
    <div className="bg-mist-card rounded-xl3 px-5 py-4 shadow-card">
      <div className="flex items-center justify-between">
        {DAYS.map((day, i) => {
          const isPast    = i < dayOfWeek
          const isToday   = i === dayOfWeek
          const isFuture  = i > dayOfWeek

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className={`text-[10px] font-inter font-medium uppercase tracking-wide
                ${isToday ? 'text-mist-sage' : 'text-mist-text-muted'}`}>
                {day}
              </span>
              <div className={`w-2.5 h-2.5 rounded-full transition-colors
                ${isToday  ? 'bg-mist-sage ring-2 ring-mist-sage ring-offset-1 ring-offset-white' :
                  isPast   ? 'bg-mist-sage opacity-40' :
                  'bg-mist-divider'
                }`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

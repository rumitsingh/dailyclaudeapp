import { useState, useRef } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Schedule({ schedule, updateSchedule, addScheduleEvent, removeScheduleEvent }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [form, setForm] = useState({ title: '', start: '09:00', end: '10:00' })
  const fileRef = useRef(null)

  const today = new Date()
  const currentDayOfWeek = (today.getDay() + 6) % 7 // Mon=0

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      updateSchedule({ photoUrl: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    addScheduleEvent({
      day: selectedDay,
      start: form.start,
      end: form.end,
      title: form.title.trim(),
    })
    setForm({ title: '', start: '09:00', end: '10:00' })
    setShowAddForm(false)
  }

  const eventsForDay = (dayIdx) =>
    (schedule.events || [])
      .filter(e => e.day === dayIdx)
      .sort((a, b) => a.start.localeCompare(b.start))

  const isSunday = today.getDay() === 0

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex items-center justify-between pt-1">
        <h1 className="font-lora text-2xl text-mist-warm">Schedule</h1>
        {isSunday && (
          <span className="text-xs font-inter font-medium bg-mist-rose/30 text-mist-rose rounded-full px-3 py-1">
            Plan your week!
          </span>
        )}
      </div>

      {/* Photo upload */}
      <div className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-inter text-sm font-semibold text-mist-warm">Schedule Photo</h2>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs font-inter font-medium text-mist-sage bg-mist-faint rounded-xl px-3 py-1.5"
          >
            {schedule.photoUrl ? 'Update photo' : 'Upload photo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {schedule.photoUrl ? (
          <img
            src={schedule.photoUrl}
            alt="Schedule"
            className="w-full rounded-xl2 object-contain max-h-64"
          />
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-mist-divider rounded-xl2 py-8 flex flex-col items-center
              gap-2 text-mist-text-muted cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" className="w-8 h-8 opacity-40">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm font-inter">Tap to add your week photo</p>
          </div>
        )}
      </div>

      {/* Week grid */}
      <div className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-inter text-sm font-semibold text-mist-warm">This Week</h2>
          <button
            onClick={() => setShowAddForm(s => !s)}
            className="text-xs font-inter font-medium text-mist-sage bg-mist-faint rounded-xl px-3 py-1.5"
          >
            {showAddForm ? 'Cancel' : '+ Add event'}
          </button>
        </div>

        {/* Add event form */}
        {showAddForm && (
          <form onSubmit={handleAddEvent} className="bg-mist-faint rounded-xl2 p-3 mb-4 flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {DAYS_SHORT.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(i)}
                  className={`text-xs font-inter font-medium rounded-xl px-2.5 py-1.5 transition-colors
                    ${selectedDay === i
                      ? 'bg-mist-sage text-white'
                      : 'bg-mist-card text-mist-text-muted'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Event title"
              className="bg-mist-card rounded-xl px-3 py-2 text-sm font-inter text-mist-warm
                placeholder:text-mist-text-muted focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={form.start}
                onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                className="flex-1 bg-mist-card rounded-xl px-3 py-2 text-sm font-inter text-mist-warm
                  focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
              />
              <span className="text-mist-text-muted font-inter text-sm self-center">to</span>
              <input
                type="time"
                value={form.end}
                onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                className="flex-1 bg-mist-card rounded-xl px-3 py-2 text-sm font-inter text-mist-warm
                  focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
              />
            </div>
            <button
              type="submit"
              disabled={!form.title.trim()}
              className="bg-mist-sage text-white rounded-xl py-2 text-sm font-inter font-medium
                disabled:opacity-40 active:scale-95 transition-transform"
            >
              Add event
            </button>
          </form>
        )}

        {/* Day rows */}
        <div className="flex flex-col gap-3">
          {DAYS.map((day, i) => {
            const events = eventsForDay(i)
            const isToday = i === currentDayOfWeek

            return (
              <div key={day} className={`${isToday ? 'bg-mist-faint rounded-xl2 p-2 -mx-2' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-xs font-inter font-semibold uppercase tracking-wider
                    ${isToday ? 'text-mist-sage' : 'text-mist-text-muted'}`}>
                    {DAYS_SHORT[i]}
                    {isToday && <span className="ml-1 normal-case tracking-normal">• Today</span>}
                  </p>
                </div>
                {events.length === 0 ? (
                  <p className="text-xs font-inter text-mist-text-muted italic opacity-60 ml-0.5">No events</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {events.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 group">
                        <span className="text-[11px] font-inter text-mist-text-muted w-20 flex-shrink-0">
                          {formatTime(ev.start)}–{formatTime(ev.end)}
                        </span>
                        <span className="text-sm font-inter text-mist-warm flex-1 truncate">{ev.title}</span>
                        <button
                          onClick={() => removeScheduleEvent(ev.id)}
                          className="opacity-0 group-hover:opacity-100 text-mist-text-muted hover:text-red-400 transition-opacity"
                          aria-label="Remove event"
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
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  return `${h % 12 || 12}:${String(m).padStart(2,'0')}${period}`
}

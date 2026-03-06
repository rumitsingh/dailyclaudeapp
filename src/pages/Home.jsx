import QuoteCard from '../components/QuoteCard.jsx'
import WeekStrip from '../components/WeekStrip.jsx'
import ChecklistCard from '../components/ChecklistCard.jsx'
import DinnerCard from '../components/DinnerCard.jsx'
import WorkoutBanner from '../components/WorkoutBanner.jsx'
import { getTimeBasedEncouragement } from '../data/encouragements.js'
import { useMemo } from 'react'

export default function Home({ todos, settings, dinnerHistory, onNavigate }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const encouragement = useMemo(() => getTimeBasedEncouragement(today.getHours()), [])

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Date + greeting */}
      <div className="pt-1">
        <p className="font-inter text-xs text-mist-text-muted font-medium uppercase tracking-widest">
          {dateStr}
        </p>
        <h1 className="font-lora text-2xl text-mist-warm mt-1 leading-tight">
          Good {getGreeting(today.getHours())}
        </h1>
        <p className="font-inter text-sm text-mist-text-muted mt-1 leading-relaxed">
          {encouragement}
        </p>
      </div>

      {/* Quote of the day */}
      <QuoteCard apiKey={settings.geminiKey} />

      {/* Week progress */}
      <WeekStrip />

      {/* Todos preview */}
      <ChecklistCard todos={todos} onNavigate={onNavigate} />

      {/* Dinner card */}
      <DinnerCard dinnerHistory={dinnerHistory} onNavigate={onNavigate} />

      {/* Workout reminder */}
      <WorkoutBanner workoutTime={settings.workoutTime} onNavigate={onNavigate} />
    </div>
  )
}

function getGreeting(hour) {
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

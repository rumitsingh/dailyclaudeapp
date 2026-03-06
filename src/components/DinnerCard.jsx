export default function DinnerCard({ dinnerHistory, onNavigate }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayDinner = dinnerHistory.find(d => d.date === today)

  return (
    <button
      onClick={() => onNavigate('dinner')}
      className="bg-mist-card rounded-xl3 p-5 shadow-card w-full text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-inter text-sm font-semibold text-mist-warm">Tonight's Dinner</h3>
        <span className="text-xs font-inter text-mist-sage font-medium">Explore →</span>
      </div>
      {todayDinner ? (
        <div>
          <p className="font-lora text-base text-mist-warm">{todayDinner.name}</p>
          {todayDinner.description && (
            <p className="text-sm font-inter text-mist-text-muted mt-1 line-clamp-2">
              {todayDinner.description}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm font-inter text-mist-text-muted italic">
          No dinner planned yet — tap to get suggestions.
        </p>
      )}
    </button>
  )
}

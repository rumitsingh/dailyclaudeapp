export default function ChecklistCard({ todos, onNavigate }) {
  const today = new Date().toISOString().slice(0, 10)

  const active = todos
    .filter(t => !t.done)
    .sort((a, b) => {
      // Sort: overdue first, then today, then no deadline, then future
      const aDate = a.deadline || '9999'
      const bDate = b.deadline || '9999'
      return aDate.localeCompare(bDate)
    })
    .slice(0, 3)

  const getDeadlineStyle = (deadline) => {
    if (!deadline) return 'text-mist-text-muted'
    if (deadline < today) return 'text-red-500'
    if (deadline === today) return 'text-amber-500'
    return 'text-mist-sage'
  }

  const formatDeadline = (deadline) => {
    if (!deadline) return null
    if (deadline < today) return 'Overdue'
    if (deadline === today) return 'Today'
    const d = new Date(deadline + 'T00:00:00')
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <button
      onClick={() => onNavigate('todos')}
      className="bg-mist-card rounded-xl3 p-5 shadow-card w-full text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-inter text-sm font-semibold text-mist-warm">Todos</h3>
        <span className="text-xs font-inter text-mist-sage font-medium">See all →</span>
      </div>

      {active.length === 0 ? (
        <p className="text-sm font-inter text-mist-text-muted italic">All caught up!</p>
      ) : (
        <ul className="space-y-2">
          {active.map(todo => (
            <li key={todo.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-mist-divider flex-shrink-0" />
              <span className="text-sm font-inter text-mist-warm flex-1 truncate">
                {todo.text}
              </span>
              {todo.deadline && (
                <span className={`text-[11px] font-inter font-medium flex-shrink-0 ${getDeadlineStyle(todo.deadline)}`}>
                  {formatDeadline(todo.deadline)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {todos.filter(t => !t.done).length > 3 && (
        <p className="text-xs font-inter text-mist-text-muted mt-2 opacity-70">
          +{todos.filter(t => !t.done).length - 3} more
        </p>
      )}
    </button>
  )
}

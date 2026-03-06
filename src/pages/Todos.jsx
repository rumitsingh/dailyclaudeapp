import { useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

function classifyDeadline(deadline) {
  if (!deadline) return 'none'
  if (deadline < today) return 'overdue'
  if (deadline === today) return 'today'
  return 'future'
}

export default function Todos({ todos, addTodo, toggleTodo, deleteTodo }) {
  const [text, setText] = useState('')
  const [deadline, setDeadline] = useState('')
  const [filter, setFilter] = useState('active') // 'active' | 'done' | 'all'

  const handleAdd = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addTodo(text.trim(), deadline || null)
    setText('')
    setDeadline('')
  }

  const sorted = [...todos].sort((a, b) => {
    // done items to bottom
    if (a.done !== b.done) return a.done ? 1 : -1
    const aKey = a.deadline || '9999'
    const bKey = b.deadline || '9999'
    return aKey.localeCompare(bKey)
  })

  const filtered = sorted.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done')   return t.done
    return true
  })

  const activeCount = todos.filter(t => !t.done).length

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex items-center justify-between pt-1">
        <h1 className="font-lora text-2xl text-mist-warm">Todos</h1>
        {activeCount > 0 && (
          <span className="text-xs font-inter font-medium text-mist-text-muted bg-mist-faint rounded-full px-2.5 py-1">
            {activeCount} active
          </span>
        )}
      </div>

      {/* Add todo */}
      <form onSubmit={handleAdd} className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 bg-mist-faint rounded-xl px-3 py-2.5 text-sm font-inter text-mist-warm
              placeholder:text-mist-text-muted focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-mist-sage text-white rounded-xl px-4 py-2.5 text-sm font-inter font-medium
              disabled:opacity-40 active:scale-95 transition-transform"
          >
            Add
          </button>
        </div>
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          min={today}
          className="w-full bg-mist-faint rounded-xl px-3 py-2 text-sm font-inter text-mist-warm
            focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
        />
      </form>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-mist-faint rounded-xl2 p-1">
        {[['active','Active'],['done','Done'],['all','All']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-inter font-medium transition-colors
              ${filter === val
                ? 'bg-mist-card text-mist-warm shadow-sm'
                : 'text-mist-text-muted'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Todo list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-mist-text-muted font-inter text-sm italic">
          {filter === 'done' ? 'Nothing completed yet.' : 'Nothing here — add your first task!'}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete }) {
  const [swiped, setSwiped] = useState(false)
  const cls = classifyDeadline(todo.deadline)

  const formatDeadline = (d) => {
    if (!d) return null
    if (d < today) return 'Overdue'
    if (d === today) return 'Today'
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const deadlineColour = {
    overdue: 'text-red-500',
    today:   'text-amber-500',
    future:  'text-mist-sage',
    none:    '',
  }[cls]

  return (
    <li className="relative overflow-hidden rounded-xl2">
      {/* Delete reveal */}
      <div className="absolute inset-y-0 right-0 flex items-center bg-red-500 rounded-xl2 px-4">
        <button
          onClick={() => onDelete(todo.id)}
          className="text-white text-sm font-inter font-medium"
        >
          Delete
        </button>
      </div>

      {/* Main item */}
      <div
        className={`relative bg-mist-card shadow-card flex items-center gap-3 px-4 py-3.5 rounded-xl2
          transition-transform duration-200 ${swiped ? '-translate-x-20' : 'translate-x-0'}`}
        onTouchStart={() => {}}
      >
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
            ${todo.done
              ? 'bg-mist-sage border-mist-sage'
              : 'border-mist-divider hover:border-mist-sage'
            }`}
        >
          {todo.done && (
            <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <polyline points="2 6 5 9 10 3" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-inter leading-snug ${todo.done ? 'line-through text-mist-text-muted' : 'text-mist-warm'}`}>
            {todo.text}
          </p>
          {todo.deadline && (
            <p className={`text-[11px] font-inter font-medium mt-0.5 ${deadlineColour}`}>
              {formatDeadline(todo.deadline)}
            </p>
          )}
        </div>

        <button
          onClick={() => setSwiped(s => !s)}
          className="text-mist-text-muted opacity-50 flex-shrink-0 ml-1"
          aria-label="Swipe to delete"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" className="w-4 h-4">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </li>
  )
}

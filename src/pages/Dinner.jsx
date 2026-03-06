import { useState } from 'react'
import { useGemini } from '../hooks/useGemini.js'

export default function Dinner({ fridge, toggleFridgeItem, addFridgeItem, removeFridgeItem, saveDinnerItem, settings }) {
  const [newItem, setNewItem] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [hasFetched, setHasFetched] = useState(false)
  const [savedIds, setSavedIds] = useState(new Set())
  const [offlineMode, setOfflineMode] = useState(false)

  const { fetchDinnerSuggestions, loading } = useGemini(settings.geminiKey)

  const fridgeItems = fridge.filter(i => i.inFridge).map(i => i.name)

  const handleGetSuggestions = async () => {
    if (fridgeItems.length === 0) return
    const result = await fetchDinnerSuggestions(fridgeItems)
    setSuggestions(result.data)
    setOfflineMode(result.offline)
    setHasFetched(true)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    addFridgeItem(newItem.trim())
    setNewItem('')
  }

  const handleSave = (suggestion) => {
    saveDinnerItem({
      name: suggestion.name,
      description: suggestion.description,
    })
    setSavedIds(prev => new Set([...prev, suggestion.name]))
  }

  const staples = fridge.filter(i => i.isStaple)
  const custom  = fridge.filter(i => !i.isStaple)

  return (
    <div className="flex flex-col gap-4 pb-2">
      <h1 className="font-lora text-2xl text-mist-warm pt-1">Dinner</h1>

      {/* Fridge section */}
      <div className="bg-mist-card rounded-xl3 p-4 shadow-card">
        <h2 className="font-inter text-sm font-semibold text-mist-warm mb-3">What's in your fridge?</h2>

        {/* Staples */}
        <p className="text-[11px] font-inter font-medium text-mist-text-muted uppercase tracking-wider mb-2">Staples</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {staples.map(item => (
            <FridgeChip
              key={item.id}
              item={item}
              onToggle={toggleFridgeItem}
            />
          ))}
        </div>

        {/* Custom items */}
        {custom.length > 0 && (
          <>
            <p className="text-[11px] font-inter font-medium text-mist-text-muted uppercase tracking-wider mb-2">Other</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {custom.map(item => (
                <FridgeChip
                  key={item.id}
                  item={item}
                  onToggle={toggleFridgeItem}
                  onRemove={removeFridgeItem}
                />
              ))}
            </div>
          </>
        )}

        {/* Add item */}
        <form onSubmit={handleAddItem} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="Add ingredient..."
            className="flex-1 bg-mist-faint rounded-xl px-3 py-2 text-sm font-inter text-mist-warm
              placeholder:text-mist-text-muted focus:outline-none focus:ring-2 focus:ring-mist-sage/40"
          />
          <button
            type="submit"
            disabled={!newItem.trim()}
            className="bg-mist-sage text-white rounded-xl px-3 py-2 text-sm font-inter font-medium
              disabled:opacity-40 active:scale-95 transition-transform"
          >
            Add
          </button>
        </form>
      </div>

      {/* Get suggestions button */}
      <button
        onClick={handleGetSuggestions}
        disabled={loading || fridgeItems.length === 0}
        className="bg-mist-sage text-white rounded-xl3 py-3.5 font-inter font-semibold text-sm
          disabled:opacity-40 active:scale-95 transition-transform shadow-card"
      >
        {loading ? 'Getting suggestions...' : 'Get dinner suggestions'}
      </button>

      {/* Suggestions */}
      {hasFetched && (
        <div className="flex flex-col gap-3">
          {offlineMode && (
            <p className="text-xs font-inter text-mist-text-muted text-center italic">
              Offline — showing best matches from your pantry
            </p>
          )}
          {suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              suggestion={s}
              onSave={handleSave}
              saved={savedIds.has(s.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FridgeChip({ item, onToggle, onRemove }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onToggle(item.id)}
        className={`rounded-full px-3 py-1.5 text-xs font-inter font-medium transition-colors border
          ${item.inFridge
            ? 'bg-mist-sage text-white border-mist-sage'
            : 'bg-mist-card text-mist-text-muted border-mist-divider'
          }`}
      >
        {item.name}
      </button>
      {onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          className="text-mist-text-muted opacity-50 hover:opacity-100 -ml-0.5"
          aria-label={`Remove ${item.name}`}
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" className="w-3 h-3">
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      )}
    </div>
  )
}

function SuggestionCard({ suggestion, onSave, saved }) {
  const matchPct = suggestion.matchScore != null
    ? Math.round(suggestion.matchScore * 100)
    : null

  const matchText = suggestion.matchText || (matchPct != null ? `${matchPct}% match` : null)

  return (
    <div className="bg-mist-card rounded-xl3 p-4 shadow-card">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-lora text-base text-mist-warm font-medium">{suggestion.name}</h3>
        {matchText && (
          <span className="text-[11px] font-inter font-semibold text-mist-sage bg-mist-faint
            rounded-full px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
            {matchText}
          </span>
        )}
      </div>
      <p className="text-sm font-inter text-mist-text-muted leading-relaxed">
        {suggestion.description}
      </p>
      {suggestion.additionalNeeded?.length > 0 && (
        <p className="text-xs font-inter text-mist-text-muted mt-2 opacity-70">
          Also need: {suggestion.additionalNeeded.join(', ')}
        </p>
      )}
      <button
        onClick={() => onSave(suggestion)}
        disabled={saved}
        className={`mt-3 rounded-xl py-2 px-4 text-sm font-inter font-medium w-full transition-colors
          ${saved
            ? 'bg-mist-faint text-mist-sage cursor-default'
            : 'bg-mist-faint text-mist-warm active:bg-mist-divider'
          }`}
      >
        {saved ? 'Saved to tonight' : 'Save as tonight\'s dinner'}
      </button>
    </div>
  )
}

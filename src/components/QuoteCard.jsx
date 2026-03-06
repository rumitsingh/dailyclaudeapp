import { useEffect, useState } from 'react'
import { useGemini } from '../hooks/useGemini.js'
import { getDailyQuote } from '../data/quotes.js'

export default function QuoteCard({ apiKey }) {
  const [quote, setQuote] = useState(null)
  const [offline, setOffline] = useState(false)
  const { fetchQuote, loading } = useGemini(apiKey)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const result = await fetchQuote()
      if (!cancelled) {
        setQuote(result.data)
        setOffline(result.offline)
      }
    }
    load()
    return () => { cancelled = true }
  }, [fetchQuote])

  if (loading && !quote) {
    return (
      <div className="bg-mist-card rounded-xl3 p-5 shadow-card animate-pulse">
        <div className="h-4 bg-mist-faint rounded w-3/4 mb-3" />
        <div className="h-4 bg-mist-faint rounded w-1/2" />
      </div>
    )
  }

  const display = quote || getDailyQuote()

  return (
    <div className="bg-mist-card rounded-xl3 p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="text-mist-rose text-2xl font-lora leading-none mt-0.5 select-none">&ldquo;</span>
        <div className="flex-1 min-w-0">
          <p className="font-lora text-base text-mist-warm leading-relaxed italic">
            {display.text}
          </p>
          <p className="font-inter text-sm text-mist-text-muted mt-2 font-medium">
            — {display.author}
          </p>
        </div>
      </div>
      {offline && (
        <p className="text-[10px] text-mist-text-muted font-inter mt-3 opacity-60">
          Offline — curated quote
        </p>
      )}
    </div>
  )
}

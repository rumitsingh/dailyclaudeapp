// Encouragement messages — segmented by time of day
export const encouragements = {
  morning: [
    "Good morning! Today is full of possibilities waiting to be discovered.",
    "Rise and shine — your best day might just be today.",
    "Morning brings a fresh canvas. Paint it with intention.",
    "Every morning is a chance to begin again. Make it count.",
    "The world is quiet and yours right now. Set a great intention for today.",
    "You woke up today. That alone is worth celebrating.",
    "Take a deep breath. Today holds everything you need to thrive.",
    "Coffee in hand, intention set — let's do this.",
    "Morning light carries quiet promise. Walk into it.",
    "Start small, stay consistent. Today's efforts are tomorrow's wins.",
  ],
  midday: [
    "Half the day still ahead — how will you make the most of it?",
    "A midday check-in: are you being kind to yourself today?",
    "Recharge, refocus, and keep going. You've got this.",
    "The afternoon belongs to those who show up fully.",
    "One task at a time — steady progress beats frantic rushing.",
    "You're doing better than you think. Keep going.",
    "Take a moment to breathe. Then dive back in.",
    "Progress, not perfection. That's the midday mantra.",
    "Afternoon energy check: hydrate, stretch, continue.",
    "Every hour you show up is an hour well spent.",
  ],
  evening: [
    "Evening has arrived. Reflect on what went well today.",
    "You made it through another day. That matters.",
    "Rest is productive. Wind down with intention tonight.",
    "What three things are you grateful for right now?",
    "The evening is yours — use it to restore or create.",
    "Today's small wins add up to a bigger story.",
    "As the day closes, let go of what didn't work. Tomorrow is fresh.",
    "Good evenings are earned by good days. Well done.",
    "Slow down, the rush is over. Be here now.",
    "The best preparation for tomorrow is a good night tonight.",
  ],
}

/**
 * Returns an encouragement based on current hour.
 * morning: 6–11, midday: 12–16, evening: 17–22, else random morning
 */
export function getTimeBasedEncouragement(hour = new Date().getHours()) {
  let bank
  if (hour >= 6 && hour < 12) bank = encouragements.morning
  else if (hour >= 12 && hour < 17) bank = encouragements.midday
  else if (hour >= 17 && hour < 23) bank = encouragements.evening
  else bank = encouragements.morning

  const idx = Math.floor(Math.random() * bank.length)
  return bank[idx]
}

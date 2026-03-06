import { storageGet, storageSet } from './storage.js'

const SCHEDULED_KEY = 'scheduled_notifications'

/**
 * Schedule a notification: stores next fire time in localStorage.
 * On app open, checkMissedNotifications() fires any that were missed.
 */
export function scheduleNotification({ type, message, fireAt }) {
  const existing = storageGet(SCHEDULED_KEY, [])
  const filtered = existing.filter(n => n.type !== type)
  filtered.push({ type, message, fireAt })
  storageSet(SCHEDULED_KEY, filtered)
}

/**
 * Check if any scheduled notifications should have fired since last open.
 * Returns array of missed notification objects.
 */
export function checkMissedNotifications() {
  const now = Date.now()
  const scheduled = storageGet(SCHEDULED_KEY, [])
  const missed = []
  const remaining = []

  for (const notif of scheduled) {
    if (notif.fireAt <= now) {
      missed.push(notif)
      // Don't keep one-time notifications
      if (notif.repeat === 'daily') {
        // Reschedule for next day
        remaining.push({ ...notif, fireAt: notif.fireAt + 24 * 60 * 60 * 1000 })
      }
    } else {
      remaining.push(notif)
    }
  }

  storageSet(SCHEDULED_KEY, remaining)
  return missed
}

/**
 * Schedule daily workout reminder.
 */
export function scheduleWorkoutReminder(timeStr) {
  if (!timeStr) return

  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const fire = new Date()
  fire.setHours(h, m, 0, 0)

  // If that time has already passed today, schedule for tomorrow
  if (fire <= now) {
    fire.setDate(fire.getDate() + 1)
  }

  scheduleNotification({
    type: 'workout',
    message: `Time for your workout! (${timeStr})`,
    fireAt: fire.getTime(),
    repeat: 'daily',
  })
}

/**
 * Schedule the Sunday schedule-review reminder at 7pm.
 */
export function scheduleWeeklyScheduleReminder() {
  const now = new Date()
  const next = new Date()

  // Find next Sunday
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7
  next.setDate(now.getDate() + daysUntilSunday)
  next.setHours(19, 0, 0, 0)

  scheduleNotification({
    type: 'schedule_review',
    message: "Sunday evening — time to plan your week ahead!",
    fireAt: next.getTime(),
    repeat: 'weekly',
  })
}

/**
 * Check todo deadlines and return any due today or overdue.
 */
export function checkTodoDeadlines(todos) {
  const today = new Date().toISOString().slice(0, 10)
  return todos.filter(t => !t.done && t.deadline && t.deadline <= today)
}

/**
 * Fire a Web Notification if permission granted.
 */
export async function fireWebNotification(title, body) {
  if (!('Notification' in window)) return false
  if (Notification.permission !== 'granted') return false

  try {
    new Notification(title, {
      body,
      icon: '/dailyclaudeapp/icons/icon-192.png',
      badge: '/dailyclaudeapp/icons/icon-192.png',
    })
    return true
  } catch {
    return false
  }
}

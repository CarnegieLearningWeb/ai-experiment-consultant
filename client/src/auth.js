const APP_BASE = '/ai-consultant'

export async function ensureAuthenticated() {
  const res = await fetch(`${APP_BASE}/api/session`, {
    headers: { Accept: 'application/json' },
  }).catch(() => null)

  if (res?.ok) return

  window.location.replace(`${APP_BASE}/login`)
  await new Promise(() => {})
}

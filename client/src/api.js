export async function api(path, options = {}) {
  let response
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    })
  } catch {
    throw new Error('The demo backend is not reachable. Start the server on port 5000 and try again.')
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('The server returned an unreadable response. Please try again.')
  }

  if (!response.ok) throw new Error(payload.error || 'The request could not be completed.')
  return payload
}

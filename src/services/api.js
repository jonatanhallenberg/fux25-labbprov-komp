// API-klient för Lånekortet. Appen anropar /api relativt: lokalt skickar Vite anropet
// vidare till mock-API:t, i drift gör servern framför appen samma sak.
const BASE_URL = '/api'
const SESSION_KEY = 'lanekortet-session'

export class AuthError extends Error {
  constructor(message = 'Inloggning krävs') {
    super(message)
    this.name = 'AuthError'
  }
}

// Sessionen (token, namn, lånekortsnummer) sparas i sessionStorage, så att man är kvar
// inloggad efter en omladdning men utloggad när fliken stängs.
export const getSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}
export const setSession = (session) => {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else sessionStorage.removeItem(SESSION_KEY)
}
export const getToken = () => getSession()?.token || null

const request = async (path, options = {}) => {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers
    }
  })
  if (res.status === 401) {
    setSession(null)
    throw new AuthError()
  }
  if (!res.ok) throw new Error('API error ' + res.status)
  return res.status === 204 ? null : res.json()
}

export const login = async (email, password) => {
  const res = await fetch(BASE_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (res.status === 401) throw new AuthError('Fel e-post eller lösenord')
  if (!res.ok) throw new Error('API error ' + res.status)
  const data = await res.json()
  setSession({ token: data.token, name: data.name, memberNo: data.memberNo })
  return data
}

export const logout = () => setSession(null)

export const fetchUser = () => request('/user')
// Lånen för ett lånekort. Numret skickas med så att samma anrop funkar för personalen sen.
export const fetchLoans = (memberNo = getSession()?.memberNo) => request(`/loans?memberNo=${encodeURIComponent(memberNo ?? '')}`)
export const fetchHistory = () => request('/loans/history')
export const fetchMessages = () => request('/messages')
export const reserve = (title) => request('/reserve', { method: 'POST', body: JSON.stringify({ title }) })

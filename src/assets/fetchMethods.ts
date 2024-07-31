let API_URL = ''
let AUTHENTICATION_TOKEN: string | undefined = undefined
export let authenticated = false
export let preferences: any

export const setURL = (url: string) => (API_URL = url)
export const setToken = (token: string | undefined) => {
  AUTHENTICATION_TOKEN = token
  if (token) {
    authenticated = true
  }
}
export const setPreferences = (preferenceStore: any) => (preferences = preferenceStore)

const setHeaders = (accept?: string, responseType?: string) => {
  const headers = new Headers()
  headers.set('Accept', accept ?? 'application/json')
  headers.set('Authorization', AUTHENTICATION_TOKEN ? `Bearer ${AUTHENTICATION_TOKEN}` : 'none')
  headers.set('response-type', responseType ?? 'json')
  return headers
}

export const fetchData = async (
  url?: string,
  method?: string,
  params?: URLSearchParams | string,
  accept?: string,
  responseType?: string
) => await fetch(makeRequest(url, params, method, accept, responseType))

const makeRequest = (
  url?: string,
  params?: URLSearchParams | string,
  method?: string,
  accept?: string,
  responseType?: string
) =>
  new Request(
    `${API_URL}/${url}` + (method?.toLowerCase() === 'get' ? (params ? '?' + params : '') : ''),
    {
      method: method?.toUpperCase() ?? 'GET',
      headers: setHeaders(accept, responseType),
      body: method?.toLowerCase() === 'post' ? params : null
    }
  )

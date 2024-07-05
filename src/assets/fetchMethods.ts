let API_URL : string

const setHeaders = (
  method?: string,
  accept?: string,
  authenticationToken?: string,
  responseType?: string
): Headers => {
  const headers = new Headers()
  headers.set('Method', method?.toUpperCase() ?? 'GET')
  headers.set('Accept', accept ?? 'application/json')
  headers.set('Authorization', authenticationToken ?? '')
  headers.set('response-type', responseType ?? 'json')
  return headers
}

export const setURL = (url: string) => (API_URL = url)

export const fetchData = async (
  url?: string,
  method?: string,
  params?: URLSearchParams|Object,
  accept?: string,
  authenticationToken?: string,
  responseType?: string
): Promise<Response> => await fetch(makeRequest(url, params, method, accept, authenticationToken, responseType))

const makeRequest = (
  url?: string,
  params?: URLSearchParams|Object,
  method?: string,
  accept?: string,
  authenticationToken?: string,
  responseType?: string
): Request =>
  new Request(`${API_URL}/${url}` + (params ? '?' + params : ''), {
    headers: setHeaders(method, accept, authenticationToken, responseType)
  })
<script lang="ts">
import { inject } from 'vue'
let API_URL = inject('apiUrl')

const setHeaders = (method? : string, accept? : string, authenticationToken? : string, responseType? : string) => {
  const headers = new Headers();
  headers.set('Method', method?.toUpperCase() ?? 'GET')
  headers.set('Accept', accept ?? 'application/json')
  headers.set('Authorization', authenticationToken ?? '')
  headers.set('response-type', responseType ?? 'json')
  return headers
}

export const setURL = (url : string) => API_URL = url

export const fetchData = async (
  url? : string, 
  method? : string,
  params? : URLSearchParams,
  accept? : string, 
  authenticationToken? : string, 
  responseType? : string) => await fetch(
    makeRequest(url, params, method, accept, authenticationToken, responseType)
  )

const makeRequest = (url? : string, params? : URLSearchParams, method? : string, accept? : string, authenticationToken? : string, responseType? : string) => new Request(`${API_URL}/${url}` + ((params) ? '?' + params : ''), { headers : setHeaders(method, accept, authenticationToken, responseType) })

</script>
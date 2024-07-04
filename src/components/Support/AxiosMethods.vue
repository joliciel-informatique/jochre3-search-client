<script lang="ts">

const API_URL = inject('apiUrl')

const setDefaultHeaders = (headersObj? : {}) => {
  return !headersObj ? new AxiosHeaders({ 
    accept: 'application/json',
  }) : new AxiosHeaders(headersObj)
}

const setDefaultResponseType = (responseType? : String) => {
  return !responseType ? <AxiosResponseType>'json' : <AxiosResponseType>responseType
}

const getConfig = (args : Object, headersObj? : Object, responseType? : string) => {
  return {
    args: args,
    headers : setDefaultHeaders(headersObj),
    responseType : setDefaultResponseType(responseType)
  }
}

const axiosAction = async (action : string = 'post', url : string, params : Object) => <AxiosResponse> await axios({ method: action, url : `${API_URL}/${url}`, params : params });

export const axiosPost = async (url : string, args : Object, headersObj? : Object, responseType? : string) => {
  try {
    return <AxiosResponse> await axiosAction('post', url, getConfig(args, headersObj, responseType))
  } catch (error) {
    return error;
  }
}

export const axiosGet = async (url : string, params : Object, headersObj? : Object, responseType : string = 'json') => {
  try {
    return await axiosAction('get', url, getConfig(params, headersObj, responseType))
  } catch (error) {
    return error
  }
}
</script>

<script setup lang="ts">
import axios, { AxiosHeaders, type ResponseType as AxiosResponseType, type AxiosResponse } from 'axios'
import { inject } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
const keycloak = useKeycloakStore().keycloak

// Set Authorization in all headers as default if user is authenticated
axios.defaults.headers.common['Authorization'] = `Bearer ${keycloak?.token}`;
</script>
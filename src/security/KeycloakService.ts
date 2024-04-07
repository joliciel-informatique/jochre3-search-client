import Keycloak from 'keycloak-js'
import { store } from '../store.js'

const keycloak = new Keycloak()

interface CallbackOneParam<T1 = void, T2 = void> {
  (param1: T1): T2
}
/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const Login = (onAuthenticatedCallback: CallbackOneParam) => {
  keycloak
    .init({ onLoad: 'login-required' })
    .then(function (authenticated) {
      authenticated ? onAuthenticatedCallback() : alert('non authenticated')
      store.keycloakToken = keycloak.token as string
      store.keycloakRefreshToken = keycloak.refreshToken as string
    })
    .catch((e) => {
      console.dir(e)
      console.log(`keycloak init exception: ${e}`)
    })

  setInterval(() => {
    keycloak
      .updateToken(70)
      .then((refreshed) => {
        if (refreshed) {
          store.keycloakToken = keycloak.token as string
          store.keycloakRefreshToken = keycloak.refreshToken as string
          console.info('Token refreshed' + refreshed)
        } else {
          console.warn(`Token not refreshed`)
        }
      })
      .catch(() => {
        console.error('Failed to refresh token')
      })
  }, 3000)
}

const KeyCloakService = {
  CallLogin: Login
}

export default KeyCloakService

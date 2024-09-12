import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'
import type App from '@/App.vue'

export default {
  install: (app: typeof App, pluginConfig: any) => {
    app.config.globalProperties.$CookieConsent = CookieConsent
    app.config.globalProperties.$CookieConsent.run(pluginConfig)
  }
}

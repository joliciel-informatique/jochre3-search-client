import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

export default {
  install: (app: any, pluginConfig: any) => {
    const cookieConsent = CookieConsent
    app.config.globalProperties.$CookieConsent = cookieConsent
    app.config.globalProperties.$CookieConsent.run(pluginConfig)
  }
}

import { createI18n, type I18n } from 'vue-i18n'

let i18n: I18n | undefined = undefined

const setupI18n = (messages: {}, language: string) => {
  i18n = createI18n({
    legacy: false,
    locale: language,
    fallbackLocale: 'en',
    messages: messages
  })

  return i18n
}

export { i18n, setupI18n }

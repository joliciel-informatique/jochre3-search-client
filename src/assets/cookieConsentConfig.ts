const cookieConsentConfig = {
  page_scripts: true,
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom left',
      equalWeightButtons: true,
      flipButtons: false
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false
    }
  },
  categories: {
    necessary: {
      readOnly: true
    },
    analytics: {}
  },
  language: {
    default: 'en',
    autoDetect: 'document',
    rtl: 'yi',
    translations: {
      en: {
        consentModal: {
          title: 'Cookies',
          description:
            'This website uses cookies to collect some of your data. Please indicate your preference on how you want this website to handle your data.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          footer: '<a href="/privacy.html">Privacy Policy</a>'
        },
        preferencesModal: {
          title: 'Consent Preferences Center',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'Cookie Usage',
              description: 'This is how we use your cookies'
            },
            {
              title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
              description: 'This is how we use absolutely necessary cookies',
              linkedCategory: 'necessary'
            },
            {
              title: 'Analytics Cookies',
              description: 'This is how we use your cookies to track user data',
              linkedCategory: 'analytics'
            },
            {
              title: 'More information',
              description:
                'For any query in relation to our policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact us</a>.'
            }
          ]
        }
      }
    }
  }
}

export default cookieConsentConfig

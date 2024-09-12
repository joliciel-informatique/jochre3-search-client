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
          footer: '<a href="#link">Privacy Policy</a>\n<a href="#link">Terms and conditions</a>'
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
      },
      yi: {
        consentModal: {
          title: 'YI__Cookies',
          description:
            'YI__This website uses cookies to collect some of your data. Please indicate your preference on how you want this website to handle your data.',
          acceptAllBtn: 'YI__Accept all',
          acceptNecessaryBtn: 'YI__Reject all',
          showPreferencesBtn: 'YI__Manage preferences',
          footer:
            '<a href="#link">YI__Privacy Policy</a>\n<a href="#link">YI__Terms and conditions</a>'
        },
        preferencesModal: {
          title: 'YI__Consent Preferences Center',
          acceptAllBtn: 'YI__Accept all',
          acceptNecessaryBtn: 'YI__Reject all',
          savePreferencesBtn: 'YI__Save preferences',
          closeIconLabel: 'YI__Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'YI__Cookie Usage',
              description: 'YI__This is how we use your cookies'
            },
            {
              title: 'YI__Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
              description: 'YI__This is how we use absolutely necessary cookies',
              linkedCategory: 'necessary'
            },
            {
              title: 'YI__Analytics Cookies',
              description: 'YI__This is how we use your cookies to track user data',
              linkedCategory: 'analytics'
            },
            {
              title: 'YI__More information',
              description:
                'YI__For any query in relation to our policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact us</a>.'
            }
          ]
        }
      }
    }
  }
}

export default cookieConsentConfig

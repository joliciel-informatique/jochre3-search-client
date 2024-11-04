/**
 * Layout: Mobile
 */
export default {
  layout: {
    mobileDefault: [
      '\u05E7 \u05E8 \u05D0 \u05D8 \u05D5 \u05Df \u05DD \u05E4',
      '\u05E9 \u05D3 \u05D2 \u05DB \u05E2 \u05D9 \u05D7 \u05DC \u05DA \u05E3',
      '{mobileShift} \u05D6 \u05E1 \u05D1 \u05D4 \u05E0 \u05DE \u05E6 \u05EA \u05E5 {bksp}',
      '{mobileNumbers} {mobileAlt} {space} {enter}'
    ],
    mobileShift: [
      '\u201F \u201E ` \uFB2F \uFB2E \u05F0 \uFB35 \uFB4B \uFB4E \uFB44',
      '\uFB2A \uFB2B \u05D2 \uFB3B \u05F1 \uFB1D \uFF1F \u05F2 \u05DA',
      '{mobileShift} \u2260 \uFB4C \uFB31 \u05BE \u2013 \u2014 \uFB4A {bksp}',
      '{mobileDefault} {mobileAlt} {space} {enter}'
    ],
    mobileAlt: [
      '\u05B0 \u05B1 \u05B2 \u05B3 \u05B4 \u05B5 \u05B6',
      '\u05B7 \u05B8 \u05C2 \u05C1 \u05B9 \u05BC \u05BD',
      '{mobileChars} \u05BF \u05BB \u05F3 \u05F4 \u20AA {bksp}',
      '{mobileNumbers} {mobileAlt} {space} {enter}'
    ],
    mobileNumbers: [
      '1 2 3 4 5 6 7 8 9 0',
      '- / : ; ( ) $ & @ "',
      "{mobileChars} . , ? ! ' {bksp}",
      '{mobileDefault} {mobileAlt} {space} {enter}'
    ],
    mobileChars: [
      '[ ] { } # % ^ * + =',
      '_ \\ | ~ < > € £ ¥ ·',
      "{mobileNumbers} . , ? ! ' {bksp}",
      '{mobileDefault} {mobileAlt} {space} {enter}'
    ]
  },
  display: {
    '{mobileNumbers}': '123',
    '{enter}': '⏎',
    '{bksp}': 'bksp',
    '{mobileShift}': '⇧',
    '{mobileDefault}': 'abc',
    '{space}': ' ',
    '{mobileAlt}': 'alt',
    '{mobileChars}': '#+='
  }
}

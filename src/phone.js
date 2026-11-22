import { findPhoneNumbersInText, getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js/min'

const names = new Intl.DisplayNames(['es-MX'], { type: 'region' })
export const countries = getCountries().map(code => ({
  code, name: names.of(code), prefix: getCountryCallingCode(code),
})).sort((a, b) => a.name.localeCompare(b.name, 'es'))

export function parsePhone(text, country) {
  const raw = text.trim()
  if (!/^(?:\+|00)?[\d\s().-]+$/.test(raw)) return null
  let digits = raw.replace(/\D/g, '')
  if (raw.startsWith('00')) digits = digits.slice(2)
  const international = raw.startsWith('+') || raw.startsWith('00')
  const prefix = getCountryCallingCode(country)
  if (international && /^521\d{10}$/.test(digits)) digits = '52' + digits.slice(3)

  let phone = parsePhoneNumberFromString(international ? '+' + digits : digits, country)
  if (!international && country === 'MX' && /^521\d{10}$/.test(digits)) {
    phone = parsePhoneNumberFromString('+52' + digits.slice(3))
  }
  if (!international && !phone?.isPossible() && digits.startsWith(prefix)) {
    phone = parsePhoneNumberFromString('+' + digits)
  }
  if (!phone?.isValid()) return null
  const selected = international
    ? phone.country ?? (phone.countryCallingCode === prefix ? country : null)
    : country
  if (!selected || getCountryCallingCode(selected) !== phone.countryCallingCode) return null
  return { country: selected, number: phone.nationalNumber, international: phone.number }
}

export function parseClipboardPhone(text, country) {
  const direct = parsePhone(text, country)
  if (direct || /^[+\d\s().#*-]+$/.test(text)) return direct
  const matches = findPhoneNumbersInText(text, country)
  if (matches.length !== 1 || matches[0].number.ext) return null
  const { startsAt, endsAt } = matches[0]
  if (/[*#]/.test(text[startsAt - 1] ?? '') || /[*#]/.test(text[endsAt] ?? '')) return null
  return parsePhone(text.slice(startsAt, endsAt), country)
}

export function whatsappUrl(phone, message, enabled) {
  const url = 'https://wa.me/' + phone.international.slice(1)
  return enabled && message.trim()
    ? url + '?text=' + encodeURIComponent(message.toWellFormed?.() ?? message)
    : url
}

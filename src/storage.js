import { countries } from './phone.js'

export const storageKey = 'whatsapp-dialer-pro'
export const defaults = { country: 'MX', number: '', message: '', enabled: false }

export function loadState(storage) {
  try {
    const value = JSON.parse(storage.getItem(storageKey))
    return {
      country: countries.some(({ code }) => code === value?.country) ? value.country : defaults.country,
      number: typeof value?.number === 'string' ? value.number : defaults.number,
      message: typeof value?.message === 'string' ? value.message : defaults.message,
      enabled: value?.enabled === true,
    }
  } catch {
    return { ...defaults }
  }
}

export function saveState(storage, value) {
  storage.setItem(storageKey, JSON.stringify(value))
  return value
}

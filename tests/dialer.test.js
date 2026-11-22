import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseClipboardPhone, parsePhone, whatsappUrl } from '../src/phone.js'
import { defaults, loadState, saveState, storageKey } from '../src/storage.js'

test('normaliza números nacionales sin cambiar el país', () => {
  assert.deepEqual(parsePhone('(449) 123-4567', 'MX'), {
    country: 'MX', number: '4491234567', international: '+524491234567',
  })
  assert.equal(parsePhone('020 7946 0958', 'GB').international, '+442079460958')
})

test('reconoce el prefijo internacional y evita duplicarlo', () => {
  assert.equal(parsePhone('+34 612 345 678', 'MX').country, 'ES')
  assert.equal(parsePhone('0034 612 345 678', 'MX').international, '+34612345678')
  assert.equal(parsePhone('52 449 123 4567', 'MX').international, '+524491234567')
  assert.equal(parsePhone('+52 1 449 123 4567', 'MX').international, '+524491234567')
  assert.equal(parsePhone('+1 416 555 0123', 'MX').country, 'CA')
})

test('rechaza texto ajeno, símbolos de marcación y longitudes incorrectas', () => {
  for (const text of ['', 'Sin número', '*4491234567', '4491234567#', '44912', '+520000000000', '+9994491234567']) {
    assert.equal(parsePhone(text, 'MX'), null, text)
  }
})

test('extrae un teléfono de texto y rechaza múltiples destinos', () => {
  assert.equal(parseClipboardPhone('Teléfono: +34 612 345 678', 'MX').country, 'ES')
  assert.equal(parseClipboardPhone('Teléfono: (449) 123-4567', 'MX').international, '+524491234567')
  assert.equal(parseClipboardPhone('Llama al 4491234567 o al 4497654321', 'MX'), null)
  assert.equal(parseClipboardPhone('Número: *4491234567#', 'MX'), null)
})

test('codifica el mensaje con acentos, emoji y saltos de línea', () => {
  const phone = parsePhone('4491234567', 'MX')
  const message = '¿Funciona? 🙂\nGracias'
  const url = new URL(whatsappUrl(phone, message, true))
  assert.equal(url.origin + url.pathname, 'https://wa.me/524491234567')
  assert.equal(url.searchParams.get('text'), message)
  assert.equal(whatsappUrl(phone, message, false), 'https://wa.me/524491234567')
  assert.equal(whatsappUrl(phone, ' \n ', true), 'https://wa.me/524491234567')
})

test('recupera cada edición desde almacenamiento y conserva los ajustes al borrar', () => {
  const data = new Map()
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) }
  assert.deepEqual(loadState(storage), defaults)
  const settings = { country: 'ES', enabled: true, message: 'Buenos días\n🙂' }
  for (const number of ['12345', '1234', '']) {
    saveState(storage, { ...settings, number })
    assert.deepEqual(loadState(storage), { ...settings, number })
  }
  data.set(storageKey, '{')
  assert.deepEqual(loadState(storage), defaults)
})

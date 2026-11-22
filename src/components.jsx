import { ChevronDown, RotateCcw, X } from 'lucide-react'
import { countries } from './phone.js'

export function PhoneDisplay({ input, country, number, change, paste, clear }) {
  const { prefix, name } = countries.find(({ code }) => code === country)
  return (
    <section className="number-section" aria-label="Número de destino">
      <div className="number-heading">
        <label htmlFor="phone" className="eyebrow">Número de teléfono</label>
        <span>{name}</span>
      </div>
      <div className="number-bar">
        <div className="country">
          <span aria-hidden="true">+{prefix} <ChevronDown size={14} /></span>
          <select aria-label="País y prefijo internacional" value={country} onChange={e => change(e.target.value)}>
            {countries.map(item => <option key={item.code} value={item.code}>{item.name} (+{item.prefix})</option>)}
          </select>
        </div>
        <input id="phone" ref={input} value={number} type="tel" inputMode="none" autoComplete="off" readOnly
          placeholder="Escribe un número" onPaste={paste} />
        {number && <button type="button" className="icon clear" aria-label="Borrar todo" onClick={clear}><X size={20} /></button>}
      </div>
    </section>
  )
}

const letters = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ']

export function DialPad({ press }) {
  return (
    <div className="dial-pad" role="group" aria-label="Teclado numérico">
      {Array.from('123456789*0#', (key, index) => (
        <button type="button" key={key} aria-label={key === '*' ? 'Asterisco' : key === '#' ? 'Numeral' : key}
          className="dial-key" onClick={() => press(key)}>
          <span>{key}</span>
          {letters[index] && <small aria-hidden="true">{letters[index]}</small>}
        </button>
      ))}
    </div>
  )
}

export function SettingsPanel({ state, update, back }) {
  return (
    <section className="settings">
      <h2>Ajustes</h2>
      <label className="switch-row">
        <span>Usar mensaje personalizado</span>
        <input type="checkbox" role="switch" checked={state.enabled} onChange={e => update({ enabled: e.target.checked })} />
      </label>
      <label htmlFor="message" className="eyebrow">Mensaje personalizado</label>
      <textarea id="message" rows="5" value={state.message} onChange={e => update({ message: e.target.value })}
        placeholder="Escribe el mensaje que quieres preparar en WhatsApp" />
      <div className="preview">
        <h3 className="eyebrow">Vista previa</h3>
        <p>{state.message.trim() ? state.message : 'Todavía no hay un mensaje.'}</p>
      </div>
      <button type="button" className="action back" onClick={back}>Volver al teclado</button>
    </section>
  )
}

export function OrientationGuard({ children }) {
  return <>
    <div className="portrait">{children}</div>
    <div className="rotate">
      <RotateCcw size={34} aria-hidden="true" />
      <p>Gira tu teléfono para utilizar la aplicación</p>
    </div>
  </>
}

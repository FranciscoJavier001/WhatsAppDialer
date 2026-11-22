import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Clipboard, Copy, Delete, MessageCircle, Settings } from 'lucide-react'
import { DialPad, OrientationGuard, PhoneDisplay, SettingsPanel } from './components.jsx'
import { parseClipboardPhone, parsePhone, whatsappUrl } from './phone.js'
import { usePersistentState } from './usePersistentState.js'
import './styles.css'

function App() {
  const { state, update, current, storageError } = usePersistentState()
  const [settings, setSettings] = useState(false)
  const [feedback, setFeedback] = useState('')
  const input = useRef(null)
  const gear = useRef(null)
  const heading = useRef(null)

  function edit(number) {
    update({ number })
    setFeedback('')
  }

  function press(key) {
    edit(current.current.number + key)
    if (key === '*' || key === '#') setFeedback('Usa únicamente dígitos para abrir WhatsApp.')
  }

  function backspace() {
    if (current.current.number) edit(current.current.number.slice(0, -1))
  }

  function paste(text) {
    const phone = parseClipboardPhone(text, current.current.country)
    if (!phone) {
      setFeedback('El texto no contiene un número válido. Incluye + y el prefijo si es internacional.')
      return
    }
    update({ number: phone.number, country: phone.country })
    setFeedback('Número pegado')
  }

  async function clipboardPaste() {
    const before = current.current
    try {
      const text = await navigator.clipboard.readText()
      if (before === current.current) paste(text)
    } catch {
      setFeedback('No se pudo leer el portapapeles. Si el navegador solicita permiso para pegar, concédelo y vuelve a intentarlo.')
    }
  }

  async function copy() {
    const phone = parsePhone(state.number, state.country)
    if (!phone) {
      setFeedback('Escribe un número completo y válido para copiarlo.')
      return
    }
    try {
      await navigator.clipboard.writeText(phone.international)
      setFeedback('Número copiado')
    } catch {
      setFeedback('El navegador no permitió copiar. Selecciona el número y cópialo manualmente.')
    }
  }

  const destination = parsePhone(state.number, state.country)
  const link = destination && whatsappUrl(destination, state.message, state.enabled)

  function openWhatsApp() {
    if (link) window.location.assign(link)
    else setFeedback('Revisa el número y el prefijo. Usa un número completo, sin * ni #.')
  }

  function onKeyDown(event) {
    const phoneFocused = event.target === input.current
    if (settings || matchMedia('(orientation: landscape) and (hover: none) and (pointer: coarse)').matches || event.ctrlKey || event.metaKey || event.altKey ||
        (event.nativeEvent ?? event).isComposing ||
        (!phoneFocused && event.target.closest('input, textarea, select, [contenteditable]'))) return
    if (phoneFocused && event.key === 'Enter') {
      event.preventDefault()
      openWhatsApp()
      return
    }
    if (!/^[0-9*#+]$/.test(event.key) && event.key !== 'Backspace') return
    event.preventDefault()
    if (event.repeat) return
    if (event.key === 'Backspace') backspace()
    else press(event.key)
  }

  useEffect(() => {
    function handleWindowKey(event) {
      if (event.target === document.body) onKeyDown(event)
    }
    window.addEventListener('keydown', handleWindowKey)
    return () => window.removeEventListener('keydown', handleWindowKey)
  }, [settings])

  const lockAttempted = useRef(false)
  function tryPortraitLock() {
    if (!lockAttempted.current && matchMedia('(display-mode: standalone)').matches && screen.orientation?.lock) {
      lockAttempted.current = true
      screen.orientation.lock('portrait').catch(() => {})
    }
  }

  function showSettings() {
    setSettings(true)
    requestAnimationFrame(() => heading.current?.focus())
  }

  return (
    <main className="app" onKeyDown={onKeyDown} onPointerDown={tryPortraitLock}>
      <OrientationGuard>
        <header className="topbar">
          <span className="brand-mark"><MessageCircle size={20} aria-hidden="true" /></span>
          <h1 tabIndex={-1} ref={heading}>WhatsApp <span>Dialer Pro</span></h1>
          {!settings && <button ref={gear} className="icon gear" aria-label="Ajustes" onClick={showSettings}><Settings size={21} /></button>}
        </header>
        {storageError && <p className="storage-error" role="alert">El almacenamiento está bloqueado o lleno. Tus cambios podrían perderse al cerrar.</p>}
        {settings ? (
          <SettingsPanel state={state} update={update} back={() => {
            setSettings(false)
            requestAnimationFrame(() => gear.current?.focus())
          }} />
        ) : (
          <div className="dialer">
            <PhoneDisplay input={input} country={state.country} number={state.number}
              change={country => { update({ country }); setFeedback('') }}
              paste={e => { e.preventDefault(); paste(e.clipboardData.getData('text')) }}
              clear={() => { edit(''); input.current?.focus({ preventScroll: true }) }} />
            <DialPad press={press} />
            <div className="dialer-footer">
              <p className="feedback" role="status">{feedback}</p>
              <div className="actions">
                <button className="action" onClick={copy}><Copy size={17} />Copiar</button>
                <button className="action" onClick={clipboardPaste}><Clipboard size={17} />Pegar</button>
                <button className="action" aria-label="Borrar último dígito" disabled={!state.number} onClick={backspace}><Delete size={20} />Borrar</button>
              </div>
              {link ? (
                <a className="whatsapp" href={link}><MessageCircle size={23} />Abrir WhatsApp</a>
              ) : (
                <button className="whatsapp" onClick={openWhatsApp}><MessageCircle size={23} />Abrir WhatsApp</button>
              )}
            </div>
          </div>
        )}
      </OrientationGuard>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)

import { useRef, useState } from 'react'
import { defaults, loadState, saveState } from './storage.js'

export function usePersistentState() {
  const [state, setState] = useState(() => {
    try { return loadState(window.localStorage) } catch { return { ...defaults } }
  })
  const current = useRef(state)
  const [storageError, setStorageError] = useState(false)

  function update(change) {
    const next = { ...current.current, ...change }
    try {
      saveState(window.localStorage, next)
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
    current.current = next
    setState(next)
  }

  return { state, update, current, storageError }
}

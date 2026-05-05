import { useState, useEffect, useCallback } from 'react'
import { getOllamaStatus } from '../utils/api'

export function useOllamaStatus() {
  const [status, setStatus] = useState({ connected: false, models: [] })
  const [checking, setChecking] = useState(true)

  const check = useCallback(async () => {
    setChecking(true)
    try {
      const data = await getOllamaStatus()
      setStatus(data)
    } catch {
      setStatus({ connected: false, models: [] })
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    check()
  }, [check])

  return { status, checking, recheck: check }
}

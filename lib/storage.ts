// LocalStorage utilities for Sehlea data persistence

export const STORAGE_KEYS = {
  PATIENTS: 'sehlea_patients',
  APPOINTMENTS: 'sehlea_appointments',
  MEDICAL_RECORDS: 'sehlea_medical_records',
} as const

export function saveData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error)
  }
}

export function loadData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading data from ${key}:`, error)
    return defaultValue
  }
}

export function removeData(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing data from ${key}:`, error)
  }
}

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

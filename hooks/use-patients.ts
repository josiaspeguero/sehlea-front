"use client"

import { useState, useEffect, useCallback } from "react"
import { STORAGE_KEYS, saveData, loadData, generateId } from "@/lib/storage"
import { mockPatients } from "@/lib/mock-data"
import type { Patient } from "@/lib/types"

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = loadData<Patient[]>(STORAGE_KEYS.PATIENTS, [])
    if (stored.length === 0) {
      // Initialize with mock data if empty
      setPatients(mockPatients)
      saveData(STORAGE_KEYS.PATIENTS, mockPatients)
    } else {
      setPatients(stored)
    }
    setIsLoading(false)
  }, [])

  const addPatient = useCallback((patientData: Omit<Patient, 'id' | 'expediente' | 'fechaRegistro'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId(),
      expediente: `EXP-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`,
      fechaRegistro: new Date().toISOString().split('T')[0],
    }
    const updated = [...patients, newPatient]
    setPatients(updated)
    saveData(STORAGE_KEYS.PATIENTS, updated)
    return newPatient
  }, [patients])

  const updatePatient = useCallback((id: string, patientData: Partial<Patient>) => {
    const updated = patients.map((p) =>
      p.id === id ? { ...p, ...patientData } : p
    )
    setPatients(updated)
    saveData(STORAGE_KEYS.PATIENTS, updated)
  }, [patients])

  const deletePatient = useCallback((id: string) => {
    const updated = patients.filter((p) => p.id !== id)
    setPatients(updated)
    saveData(STORAGE_KEYS.PATIENTS, updated)
  }, [patients])

  const getPatient = useCallback((id: string) => {
    return patients.find((p) => p.id === id)
  }, [patients])

  return {
    patients,
    isLoading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
  }
}

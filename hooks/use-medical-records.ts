"use client"

import { useState, useEffect, useCallback } from "react"
import { STORAGE_KEYS, saveData, loadData, generateId } from "@/lib/storage"
import { mockMedicalRecords } from "@/lib/mock-data"
import type { MedicalRecord } from "@/lib/types"

export function useMedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = loadData<MedicalRecord[]>(STORAGE_KEYS.MEDICAL_RECORDS, [])
    if (stored.length === 0) {
      setRecords(mockMedicalRecords)
      saveData(STORAGE_KEYS.MEDICAL_RECORDS, mockMedicalRecords)
    } else {
      setRecords(stored)
    }
    setIsLoading(false)
  }, [])

  const addRecord = useCallback((recordData: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: generateId(),
    }
    const updated = [...records, newRecord]
    setRecords(updated)
    saveData(STORAGE_KEYS.MEDICAL_RECORDS, updated)
    return newRecord
  }, [records])

  const updateRecord = useCallback((id: string, recordData: Partial<MedicalRecord>) => {
    const updated = records.map((r) =>
      r.id === id ? { ...r, ...recordData } : r
    )
    setRecords(updated)
    saveData(STORAGE_KEYS.MEDICAL_RECORDS, updated)
  }, [records])

  const deleteRecord = useCallback((id: string) => {
    const updated = records.filter((r) => r.id !== id)
    setRecords(updated)
    saveData(STORAGE_KEYS.MEDICAL_RECORDS, updated)
  }, [records])

  const getPatientRecords = useCallback((patientId: string) => {
    return records
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [records])

  return {
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord,
    getPatientRecords,
  }
}

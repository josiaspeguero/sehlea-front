"use client"

import { useState, useEffect, useCallback } from "react"
import { STORAGE_KEYS, saveData, loadData, generateId } from "@/lib/storage"
import { mockAppointments } from "@/lib/mock-data"
import type { Appointment } from "@/lib/types"

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = loadData<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, [])
    if (stored.length === 0) {
      setAppointments(mockAppointments)
      saveData(STORAGE_KEYS.APPOINTMENTS, mockAppointments)
    } else {
      setAppointments(stored)
    }
    setIsLoading(false)
  }, [])

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId(),
    }
    const updated = [...appointments, newAppointment]
    setAppointments(updated)
    saveData(STORAGE_KEYS.APPOINTMENTS, updated)
    return newAppointment
  }, [appointments])

  const updateAppointment = useCallback((id: string, appointmentData: Partial<Appointment>) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, ...appointmentData } : a
    )
    setAppointments(updated)
    saveData(STORAGE_KEYS.APPOINTMENTS, updated)
  }, [appointments])

  const deleteAppointment = useCallback((id: string) => {
    const updated = appointments.filter((a) => a.id !== id)
    setAppointments(updated)
    saveData(STORAGE_KEYS.APPOINTMENTS, updated)
  }, [appointments])

  const getTodayAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return appointments.filter((a) => a.fecha === today)
  }, [appointments])

  return {
    appointments,
    isLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getTodayAppointments,
  }
}

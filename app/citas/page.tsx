"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { AppointmentModal, type AppointmentFormData } from "@/components/appointments/appointment-modal"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { usePatients } from "@/hooks/use-patients"
import { useAppointments } from "@/hooks/use-appointments"
import type { Appointment, AppointmentStatus } from "@/lib/types"

export default function CitasPage() {
  const { patients, isLoading: patientsLoading } = usePatients()
  const {
    appointments,
    isLoading: appointmentsLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const handleCreate = () => {
    setEditingAppointment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta cita?")) {
      deleteAppointment(id)
    }
  }

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    updateAppointment(id, { estado: status })
  }

  const handleSubmit = (data: AppointmentFormData) => {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, data)
    } else {
      addAppointment(data)
    }
  }

  if (patientsLoading || appointmentsLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Citas</h1>
            <p className="text-sm text-muted-foreground">
              Programa y administra las citas médicas
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        </motion.div>

        {/* Appointment List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AppointmentList
            appointments={appointments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </motion.div>
      </div>

      {/* Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        appointment={editingAppointment}
        patients={patients}
      />
    </DashboardLayout>
  )
}

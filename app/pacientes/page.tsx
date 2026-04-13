"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PatientTable } from "@/components/patients/patient-table"
import { PatientModal, type PatientFormData } from "@/components/patients/patient-modal"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { usePatients } from "@/hooks/use-patients"
import type { Patient } from "@/lib/types"

export default function PatientsPage() {
  const router = useRouter()
  const { patients, isLoading, addPatient, updatePatient, deletePatient } = usePatients()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const handleCreate = () => {
    setEditingPatient(null)
    setIsModalOpen(true)
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este paciente?")) {
      deletePatient(id)
    }
  }

  const handleViewHistory = (patientId: string) => {
    router.push(`/historial?paciente=${patientId}`)
  }

  const handleSubmit = (data: PatientFormData) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, data)
    } else {
      addPatient(data)
    }
  }

  if (isLoading) {
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pacientes</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona la información de los pacientes registrados
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Paciente
          </Button>
        </motion.div>

        {/* Patient Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PatientTable
            patients={patients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewHistory={handleViewHistory}
          />
        </motion.div>
      </div>

      {/* Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        patient={editingPatient}
      />
    </DashboardLayout>
  )
}

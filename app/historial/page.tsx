"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, User } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MedicalTimeline } from "@/components/history/medical-timeline"
import { RecordModal, type RecordFormData } from "@/components/history/record-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { usePatients } from "@/hooks/use-patients"
import { useMedicalRecords } from "@/hooks/use-medical-records"
import type { MedicalRecord } from "@/lib/types"

function HistorialContent() {
  const searchParams = useSearchParams()
  const initialPatientId = searchParams.get("paciente") || ""

  const { patients, isLoading: patientsLoading } = usePatients()
  const { records, isLoading: recordsLoading, addRecord, updateRecord, deleteRecord, getPatientRecords } =
    useMedicalRecords()

  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)

  const patientRecords = useMemo(() => {
    if (!selectedPatientId) return []
    return getPatientRecords(selectedPatientId)
  }, [selectedPatientId, getPatientRecords])

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId)
  }, [patients, selectedPatientId])

  const handleCreate = () => {
    setEditingRecord(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
      deleteRecord(id)
    }
  }

  const handleSubmit = (data: RecordFormData) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data)
    } else {
      addRecord(data)
    }
  }

  if (patientsLoading || recordsLoading) {
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Historial Clínico</h1>
            <p className="text-sm text-muted-foreground">
              Consulta y gestiona el historial médico de los pacientes
            </p>
          </div>
          {selectedPatientId && (
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Registro
            </Button>
          )}
        </motion.div>

        {/* Patient Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Seleccionar Paciente
                  </label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger className="w-full sm:w-[320px]">
                      <SelectValue placeholder="Buscar paciente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.nombre} {patient.apellido} - {patient.expediente}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPatient && (
                  <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedPatient.nombre} {selectedPatient.apellido}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedPatient.expediente} | {selectedPatient.edad} años
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        {selectedPatientId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MedicalTimeline
              records={patientRecords}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Selecciona un paciente
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Para ver el historial clínico, primero selecciona un paciente de la lista.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {selectedPatientId && (
        <RecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          record={editingRecord}
          patientId={selectedPatientId}
        />
      )}
    </DashboardLayout>
  )
}

export default function HistorialPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex h-[60vh] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        </DashboardLayout>
      }
    >
      <HistorialContent />
    </Suspense>
  )
}

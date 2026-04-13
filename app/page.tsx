"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { PatientChart, AppointmentChart } from "@/components/dashboard/dashboard-charts"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { usePatients } from "@/hooks/use-patients"
import { useAppointments } from "@/hooks/use-appointments"
import { monthlyPatientData, appointmentStatusData } from "@/lib/mock-data"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const { patients, isLoading: patientsLoading } = usePatients()
  const { appointments, isLoading: appointmentsLoading, getTodayAppointments } = useAppointments()

  if (patientsLoading || appointmentsLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    )
  }

  const todayAppointments = getTodayAppointments()
  const activePatients = patients.filter((p) => p.estado === 'activo').length
  const currentMonth = new Date().getMonth()
  const newRegistrations = patients.filter((p) => {
    const regMonth = new Date(p.fechaRegistro).getMonth()
    return regMonth === currentMonth
  }).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido al Sistema de Registro Médico Clínico Electrónico
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards
          totalPacientes={patients.length}
          citasHoy={todayAppointments.length}
          pacientesActivos={activePatients}
          nuevosRegistros={newRegistrations}
        />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PatientChart data={monthlyPatientData} />
          <AppointmentChart data={appointmentStatusData} />
        </div>

        {/* Activity and Appointments Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingAppointments appointments={todayAppointments} />
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  )
}

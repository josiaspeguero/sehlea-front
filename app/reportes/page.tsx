"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  Users,
  CalendarCheck,
  FileText,
  TrendingUp,
  Download,
  Printer,
  BarChart3,
  PieChart,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { usePatients } from "@/hooks/use-patients"
import { useAppointments } from "@/hooks/use-appointments"
import { useMedicalRecords } from "@/hooks/use-medical-records"

export default function ReportesPage() {
  const { patients, isLoading: patientsLoading } = usePatients()
  const { appointments, isLoading: appointmentsLoading } = useAppointments()
  const { records, isLoading: recordsLoading } = useMedicalRecords()

  const stats = useMemo(() => {
    const activePatients = patients.filter((p) => p.estado === "activo").length
    const completedAppointments = appointments.filter((a) => a.estado === "completada").length
    const cancelledAppointments = appointments.filter((a) => a.estado === "cancelada").length
    const pendingAppointments = appointments.filter((a) => a.estado === "pendiente").length

    return {
      totalPatients: patients.length,
      activePatients,
      totalAppointments: appointments.length,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
      totalRecords: records.length,
      completionRate:
        appointments.length > 0
          ? Math.round((completedAppointments / appointments.length) * 100)
          : 0,
    }
  }, [patients, appointments, records])

  const patientsByGender = useMemo(() => {
    const genderCounts = patients.reduce(
      (acc, p) => {
        acc[p.genero] = (acc[p.genero] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    return [
      { name: "Masculino", value: genderCounts["masculino"] || 0, fill: "var(--color-chart-1)" },
      { name: "Femenino", value: genderCounts["femenino"] || 0, fill: "var(--color-chart-2)" },
      { name: "Otro", value: genderCounts["otro"] || 0, fill: "var(--color-chart-3)" },
    ].filter((item) => item.value > 0)
  }, [patients])

  const patientsByStatus = useMemo(() => {
    return [
      {
        name: "Activos",
        value: patients.filter((p) => p.estado === "activo").length,
        fill: "var(--color-chart-1)",
      },
      {
        name: "Inactivos",
        value: patients.filter((p) => p.estado === "inactivo").length,
        fill: "var(--color-chart-4)",
      },
      {
        name: "Alta",
        value: patients.filter((p) => p.estado === "alta").length,
        fill: "var(--color-chart-3)",
      },
    ].filter((item) => item.value > 0)
  }, [patients])

  const appointmentsByDoctor = useMemo(() => {
    const doctorCounts = appointments.reduce(
      (acc, a) => {
        const shortName = a.medico.split(" ").slice(0, 2).join(" ")
        acc[shortName] = (acc[shortName] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    return Object.entries(doctorCounts).map(([name, count]) => ({
      name,
      citas: count,
    }))
  }, [appointments])

  const ageDistribution = useMemo(() => {
    const ranges = [
      { label: "0-18", min: 0, max: 18 },
      { label: "19-30", min: 19, max: 30 },
      { label: "31-45", min: 31, max: 45 },
      { label: "46-60", min: 46, max: 60 },
      { label: "60+", min: 61, max: 150 },
    ]
    return ranges.map((range) => ({
      rango: range.label,
      pacientes: patients.filter((p) => p.edad >= range.min && p.edad <= range.max).length,
    }))
  }, [patients])

  const handleExport = (type: string) => {
    alert(`Exportando reporte en formato ${type}... (Función simulada)`)
  }

  if (patientsLoading || appointmentsLoading || recordsLoading) {
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reportes</h1>
            <p className="text-sm text-muted-foreground">
              Análisis y métricas del sistema de gestión médica
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleExport("PDF")} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("Excel")} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Pacientes",
              value: stats.totalPatients,
              icon: Users,
              description: `${stats.activePatients} activos`,
              trend: "+12%",
            },
            {
              title: "Citas Totales",
              value: stats.totalAppointments,
              icon: CalendarCheck,
              description: `${stats.pendingAppointments} pendientes`,
              trend: "+8%",
            },
            {
              title: "Registros Médicos",
              value: stats.totalRecords,
              icon: FileText,
              description: "Historiales clínicos",
              trend: "+15%",
            },
            {
              title: "Tasa de Asistencia",
              value: `${stats.completionRate}%`,
              icon: TrendingUp,
              description: "Citas completadas",
              trend: "+5%",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs font-medium text-primary">{stat.trend}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Citas por Médico</CardTitle>
                </div>
                <CardDescription>Distribución de consultas por profesional</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentsByDoctor} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="citas" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Pacientes por Género</CardTitle>
                </div>
                <CardDescription>Distribución demográfica</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px] flex items-center justify-center">
                  <ResponsiveContainer width={200} height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={patientsByGender}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {patientsByGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="ml-4 space-y-2">
                    {patientsByGender.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground">({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Distribución por Edad</CardTitle>
                <CardDescription>Grupos etarios de pacientes</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="rango"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="pacientes" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Estado de Pacientes</CardTitle>
                <CardDescription>Clasificación actual</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px] flex items-center justify-center">
                  <ResponsiveContainer width={200} height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={patientsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {patientsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="ml-4 space-y-2">
                    {patientsByStatus.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground">({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Summary Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Resumen de Citas</CardTitle>
              <CardDescription>Estado general de las consultas</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">Completadas</p>
                  <p className="text-2xl font-bold text-primary">{stats.completedAppointments}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalAppointments > 0
                      ? `${Math.round((stats.completedAppointments / stats.totalAppointments) * 100)}% del total`
                      : "Sin datos"}
                  </p>
                </div>
                <div className="rounded-lg border border-chart-2/20 bg-chart-2/5 p-4">
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-chart-2">{stats.pendingAppointments}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalAppointments > 0
                      ? `${Math.round((stats.pendingAppointments / stats.totalAppointments) * 100)}% del total`
                      : "Sin datos"}
                  </p>
                </div>
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <p className="text-sm text-muted-foreground">Canceladas</p>
                  <p className="text-2xl font-bold text-destructive">{stats.cancelledAppointments}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalAppointments > 0
                      ? `${Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100)}% del total`
                      : "Sin datos"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

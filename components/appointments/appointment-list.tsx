"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Appointment, AppointmentStatus } from "@/lib/types"

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

const statusColors: Record<AppointmentStatus, string> = {
  pendiente: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  completada: "bg-primary/10 text-primary border-primary/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels: Record<AppointmentStatus, string> = {
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
}

export function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const filteredAppointments = appointments
    .filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
        apt.motivo.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || apt.estado === statusFilter
      const matchesDate = !dateFilter || apt.fecha === dateFilter
      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      // Sort by date and time
      const dateCompare = a.fecha.localeCompare(b.fecha)
      if (dateCompare !== 0) return dateCompare
      return a.hora.localeCompare(b.hora)
    })

  // Group by date
  const groupedAppointments = filteredAppointments.reduce(
    (groups, apt) => {
      const date = apt.fecha
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(apt)
      return groups
    },
    {} as Record<string, Appointment[]>
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateStr === today.toISOString().split("T")[0]) {
      return "Hoy"
    }
    if (dateStr === tomorrow.toISOString().split("T")[0]) {
      return "Mañana"
    }
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por paciente o motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[160px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointment List */}
      {Object.keys(groupedAppointments).length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Sin citas</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              No se encontraron citas con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground capitalize">
                      {formatDate(date)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {dayAppointments.length} cita{dayAppointments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Appointments for this date */}
                <div className="space-y-3 ml-0 sm:ml-[52px]">
                  {dayAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-border/50 hover:border-border transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Time */}
                            <div className="flex flex-col items-center min-w-[60px]">
                              <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                              <span className="text-lg font-semibold text-foreground">
                                {appointment.hora}
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-16 bg-border self-center" />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-foreground">
                                      {appointment.patientName}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {appointment.motivo}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={statusColors[appointment.estado]}
                                    >
                                      {statusLabels[appointment.estado]}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {appointment.medico}
                                    </span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(appointment)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {appointment.estado !== "completada" && (
                                      <DropdownMenuItem
                                        onClick={() => onStatusChange(appointment.id, "completada")}
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                        Marcar completada
                                      </DropdownMenuItem>
                                    )}
                                    {appointment.estado !== "cancelada" && (
                                      <DropdownMenuItem
                                        onClick={() => onStatusChange(appointment.id, "cancelada")}
                                      >
                                        <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                        Cancelar cita
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => onDelete(appointment.id)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

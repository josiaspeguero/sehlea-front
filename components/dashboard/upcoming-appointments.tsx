"use client"

import { motion } from "framer-motion"
import { Clock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Appointment } from "@/lib/types"

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
}

const statusColors = {
  pendiente: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  completada: "bg-primary/10 text-primary border-primary/20",
  cancelada: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels = {
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  const todayAppointments = appointments
    .filter((apt) => apt.estado !== 'cancelada')
    .slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Citas de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No hay citas programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {appointment.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {appointment.motivo}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-foreground">{appointment.hora}</span>
                    <Badge variant="outline" className={statusColors[appointment.estado]}>
                      {statusLabels[appointment.estado]}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

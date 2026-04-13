"use client"

import { motion } from "framer-motion"
import { UserPlus, Calendar, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  type: 'new_patient' | 'appointment' | 'record' | 'update'
  title: string
  description: string
  time: string
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'new_patient',
    title: 'Nuevo paciente registrado',
    description: 'Patricia Mendoza Cruz - EXP-2024-007',
    time: 'Hace 2 horas',
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Cita completada',
    description: 'Laura Ramírez Torres - Control lumbalgia',
    time: 'Hace 3 horas',
  },
  {
    id: '3',
    type: 'record',
    title: 'Historial actualizado',
    description: 'María González - Nuevo diagnóstico agregado',
    time: 'Hace 4 horas',
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Cita programada',
    description: 'Carlos Hernández - Seguimiento diabetes',
    time: 'Hace 5 horas',
  },
  {
    id: '5',
    type: 'update',
    title: 'Información actualizada',
    description: 'Fernando Díaz - Datos de contacto',
    time: 'Hace 6 horas',
  },
]

const iconMap = {
  new_patient: UserPlus,
  appointment: Calendar,
  record: FileText,
  update: Clock,
}

const colorMap = {
  new_patient: 'bg-primary/10 text-primary',
  appointment: 'bg-chart-2/10 text-chart-2',
  record: 'bg-chart-3/10 text-chart-3',
  update: 'bg-muted text-muted-foreground',
}

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = iconMap[activity.type]
              const colorClass = colorMap[activity.type]
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

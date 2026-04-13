"use client"

import { motion } from "framer-motion"
import { Users, CalendarCheck, UserCheck, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface KPICardProps {
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

function KPICard({ title, value, description, icon, trend, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-border/50 bg-card hover:border-border transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
                {trend && (
                  <span
                    className={`text-xs font-medium ${
                      trend.isPositive ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {trend.isPositive ? "+" : ""}{trend.value}%
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface KPICardsProps {
  totalPacientes: number
  citasHoy: number
  pacientesActivos: number
  nuevosRegistros: number
}

export function KPICards({ totalPacientes, citasHoy, pacientesActivos, nuevosRegistros }: KPICardsProps) {
  const cards = [
    {
      title: "Total Pacientes",
      value: totalPacientes,
      description: "Pacientes registrados en el sistema",
      icon: <Users className="h-5 w-5 text-primary" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Citas Hoy",
      value: citasHoy,
      description: "Consultas programadas para hoy",
      icon: <CalendarCheck className="h-5 w-5 text-primary" />,
    },
    {
      title: "Pacientes Activos",
      value: pacientesActivos,
      description: "En tratamiento activo",
      icon: <UserCheck className="h-5 w-5 text-primary" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Nuevos Registros",
      value: nuevosRegistros,
      description: "Este mes",
      icon: <UserPlus className="h-5 w-5 text-primary" />,
      trend: { value: 5, isPositive: true },
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <KPICard
          key={card.title}
          {...card}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}

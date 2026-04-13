"use client"

import { motion } from "framer-motion"
import { Calendar, Stethoscope, Pill, FileText, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MedicalRecord } from "@/lib/types"

interface MedicalTimelineProps {
  records: MedicalRecord[]
  onEdit: (record: MedicalRecord) => void
  onDelete: (id: string) => void
}

export function MedicalTimeline({ records, onEdit, onDelete }: MedicalTimelineProps) {
  if (records.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Sin registros médicos</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Este paciente no tiene historial clínico registrado. Agrega un nuevo registro para comenzar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

      <div className="space-y-6">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background hidden sm:block" />

            {/* Card */}
            <Card className="border-border/50 ml-0 sm:ml-14 hover:border-border transition-colors">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {new Date(record.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">|</span>
                    <span className="text-sm text-muted-foreground">{record.medico}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Diagnosis */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Diagnóstico
                      </p>
                      <p className="text-sm text-foreground">{record.diagnostico}</p>
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                      <Pill className="h-4 w-4 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Tratamiento
                      </p>
                      <p className="text-sm text-foreground">{record.tratamiento}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {record.notas && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-chart-3" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Notas
                        </p>
                        <p className="text-sm text-muted-foreground">{record.notas}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

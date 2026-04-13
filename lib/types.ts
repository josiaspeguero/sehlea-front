// Type definitions for Sehlea

export type PatientStatus = 'activo' | 'inactivo' | 'alta'

export type Gender = 'masculino' | 'femenino' | 'otro'

export type AppointmentStatus = 'pendiente' | 'completada' | 'cancelada'

export interface Patient {
  id: string
  expediente: string
  nombre: string
  apellido: string
  edad: number
  genero: Gender
  fechaNacimiento: string
  telefono: string
  email: string
  direccion: string
  estado: PatientStatus
  fechaRegistro: string
  ultimaVisita: string | null
}

export interface MedicalRecord {
  id: string
  patientId: string
  fecha: string
  diagnostico: string
  tratamiento: string
  notas: string
  medico: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  fecha: string
  hora: string
  motivo: string
  estado: AppointmentStatus
  notas: string
  medico: string
}

export interface DashboardStats {
  totalPacientes: number
  citasHoy: number
  pacientesActivos: number
  nuevosRegistros: number
}

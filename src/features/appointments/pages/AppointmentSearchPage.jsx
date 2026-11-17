import { useState } from 'react'
import AppointmentFilters from '../components/AppointmentFilters'
import AppointmentsTable from '../components/AppointmentsTable'
import { APPOINTMENTS, DOCTORS, SPECIALITIES } from '../services/appointmentMockData'

const PAGE_SIZE = 5

// Same names as the inputs of AppointmentFilters. '' = "no filter".
const EMPTY_FILTERS = { patient: '', specialityId: '', doctorId: '', date: '' }

// true when the appointment passes every filter in use
function matchesFilters(appointment, filters) {
  const patientText = filters.patient.trim().toLowerCase()
  if (patientText) {
    const matchesName = appointment.patient.fullName.toLowerCase().includes(patientText)
    // Accepts the DNI with or without dots (40.123.456 or 40123456)
    const matchesDni = String(appointment.patient.dni).includes(patientText.replaceAll('.', ''))
    if (!matchesName && !matchesDni) return false
  }
  if (filters.specialityId && appointment.doctor.speciality.specialityId !== filters.specialityId) return false
  if (filters.doctorId && appointment.doctor.doctorId !== filters.doctorId) return false
  // The date input and the backend both use "YYYY-MM-DD"
  if (filters.date && appointment.date !== filters.date) return false
  return true
}

function AppointmentSearchPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [page, setPage] = useState(1)

  const filteredAppointments = APPOINTMENTS.filter((appointment) => matchesFilters(appointment, filters))
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE))
  const pageAppointments = filteredAppointments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // TODO: call GET /api/appointments/search with these filters (see appointmentMockData.js)
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
    setLastUpdate(new Date())
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Búsqueda y Filtrado de Citas</h1>
        <p className="mt-1 text-sm text-ink">Gestione y supervise el flujo de pacientes del departamento.</p>
      </header>

      <AppointmentFilters
        specialities={SPECIALITIES}
        doctors={DOCTORS}
        appliedFilters={filters}
        lastUpdate={lastUpdate}
        onApply={handleApplyFilters}
      />

      <AppointmentsTable
        appointments={pageAppointments}
        total={filteredAppointments.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

export default AppointmentSearchPage

import { apiClient } from '../../../services/apiClient'
import { getAllDoctors } from '../../doctors/services/doctorsService'
import { getAllSpecialities } from '../../specialities/services/specialitiesService'

export const DEFAULT_PAGE_SIZE = 5

// Specialities for the filter, as { specialityId, name } (the shape the filters use)
export async function getSpecialities() {
  const specialities = await getAllSpecialities()
  return specialities.map((speciality) => ({
    specialityId: speciality.id,
    name: speciality.name,
  }))
}

// Doctors for the filter, as { doctorId, name, speciality: { specialityId, name } }
export async function getDoctors() {
  const doctors = await getAllDoctors()
  return doctors.map((doctor) => ({
    doctorId: doctor.id,
    name: doctor.name,
    speciality: {
      specialityId: doctor.speciality?.specialityId ?? null,
      name: doctor.speciality?.name ?? '',
    },
  }))
}

// The backend search item, normalized to the shape AppointmentsTable reads.
// Today the backend only sends the ids and the status; date, doctor and
// patient stay null until it returns them (PatientSearchDto / DoctorSearchDto).
function toAppointment(item) {
  const doctor = item.doctor
  const patient = item.patient

  return {
    appointmentId: item.appointmentsId ?? item.appointmentId ?? item.id,
    status: item.appointmentsStatus ?? item.status,
    date: item.date ?? item.slotDate ?? null,
    startTime: item.startTime ?? null,
    doctor: doctor
      ? {
          doctorId: doctor.dcotorId ?? doctor.doctorId,
          name: doctor.name,
          speciality: doctor.speciality ?? null,
        }
      : null,
    patient: patient
      ? {
          dni: patient.dni,
          fullName: patient.fullname ?? patient.fullName,
        }
      : null,
  }
}

// GET /api/appointments/search (admin only)
// filters: { specialityId, doctorId, dni, date } where '' means "no filter".
// pageIndex starts at 1. Returns { appointments, total, pageIndex, pageSize }.
export async function searchAppointments(filters, pageIndex = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const params = { pageSize, pageIndex }
  if (filters.specialityId) params.specialityId = filters.specialityId
  if (filters.doctorId) params.doctorId = filters.doctorId
  if (filters.dni) params.dni = filters.dni
  // "YYYY-MM-DD" from the date input; the backend binds it to DateTime
  if (filters.date) params.date = filters.date

  const response = await apiClient.get('/api/appointments/search', { params })
  const { data = [], total = 0 } = response.data

  return {
    appointments: data.map(toAppointment),
    total,
    pageIndex,
    pageSize,
  }
}

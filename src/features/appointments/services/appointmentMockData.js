// TODO: example data. The backend has GET /api/appointments/search
// (specialityId, doctorId, dni, date, pageSize, pageIndex), but today it only
// returns "Booked" appointments of one date and does not send the doctor of
// each appointment. Replace this file with a real call in appointmentService.js
// once the backend returns the shape below.
//
// The combos can use GET /api/specialties and GET /api/doctors (admin endpoints).

const CARDIOLOGY = { specialityId: 'e8d8b842-ea9d-4cfa-8b7b-ff642e50457c', name: 'Cardiologia' }
const NEUROLOGY = { specialityId: '3b1f6c2a-7d4e-4f8a-9c21-5e6d7a8b9c01', name: 'Neurologia' }
const PEDIATRICS = { specialityId: '9a2e4d6b-1c3f-4e5a-8b7c-0d1e2f3a4b5c', name: 'Pediatria' }
const GYNECOLOGY = { specialityId: '5c7e9a1b-3d5f-4a2c-9e8d-6b4a2c0e1f3d', name: 'Ginecologia' }

export const SPECIALITIES = [CARDIOLOGY, NEUROLOGY, PEDIATRICS, GYNECOLOGY]

const CRISTIAN_MARTINEZ = { doctorId: '1a6ed432-c00b-4d86-9b81-be9c017c9ac2', name: 'Cristian Martinez', speciality: CARDIOLOGY }
const ALEJANDRO_RIVERA = { doctorId: '2b7fe543-d11c-4e97-8c92-cf0d128d0bd3', name: 'Alejandro Rivera', speciality: CARDIOLOGY }
const ELENA_RODRIGUEZ = { doctorId: '3c80f654-e22d-4fa8-9da3-d01e239e1ce4', name: 'Elena Rodríguez', speciality: NEUROLOGY }
const ROBERT_CHEN = { doctorId: '5ea2b876-a44f-41ca-9fc5-f230450b3ea6', name: 'Robert Chen', speciality: PEDIATRICS }
const LUCIA_SORIA = { doctorId: '6fb3c987-b550-42db-80d6-a341561c4fb7', name: 'Lucía Soria', speciality: GYNECOLOGY }

export const DOCTORS = [CRISTIAN_MARTINEZ, ALEJANDRO_RIVERA, ELENA_RODRIGUEZ, ROBERT_CHEN, LUCIA_SORIA]

const JOHNATHAN_DOE = { dni: 40123456, fullName: 'Johnathan Doe' }
const MARIA_GONZALEZ = { dni: 38456789, fullName: 'María González' }
const JUAN_PEREZ = { dni: 35111222, fullName: 'Juan Pérez' }
const SOFIA_RAMIREZ = { dni: 42987654, fullName: 'Sofía Ramírez' }
const CARLOS_GOMEZ = { dni: 30555444, fullName: 'Carlos Gómez' }

// Newest first. status: Booked | Attended | Cancelled | NoShow (backend enum)
export const APPOINTMENTS = [
  { appointmentId: 'a1f0c3d2-0001-4b6e-9a10-000000000001', status: 'Booked', date: '2026-11-05', startTime: '10:30:00', patient: JOHNATHAN_DOE, doctor: CRISTIAN_MARTINEZ },
  { appointmentId: 'a1f0c3d2-0002-4b6e-9a10-000000000002', status: 'Booked', date: '2026-11-04', startTime: '09:00:00', patient: SOFIA_RAMIREZ, doctor: ROBERT_CHEN },
  { appointmentId: 'a1f0c3d2-0003-4b6e-9a10-000000000003', status: 'Booked', date: '2026-11-03', startTime: '15:30:00', patient: MARIA_GONZALEZ, doctor: LUCIA_SORIA },
  { appointmentId: 'a1f0c3d2-0004-4b6e-9a10-000000000004', status: 'Cancelled', date: '2026-10-30', startTime: '08:30:00', patient: JUAN_PEREZ, doctor: ALEJANDRO_RIVERA },
  { appointmentId: 'a1f0c3d2-0005-4b6e-9a10-000000000005', status: 'Booked', date: '2026-10-29', startTime: '14:00:00', patient: CARLOS_GOMEZ, doctor: ELENA_RODRIGUEZ },
  { appointmentId: 'a1f0c3d2-0006-4b6e-9a10-000000000006', status: 'Attended', date: '2026-10-26', startTime: '09:15:00', patient: JOHNATHAN_DOE, doctor: ELENA_RODRIGUEZ },
  { appointmentId: 'a1f0c3d2-0007-4b6e-9a10-000000000007', status: 'NoShow', date: '2026-10-23', startTime: '11:00:00', patient: SOFIA_RAMIREZ, doctor: CRISTIAN_MARTINEZ },
  { appointmentId: 'a1f0c3d2-0008-4b6e-9a10-000000000008', status: 'Attended', date: '2026-10-22', startTime: '10:00:00', patient: MARIA_GONZALEZ, doctor: ROBERT_CHEN },
  { appointmentId: 'a1f0c3d2-0009-4b6e-9a10-000000000009', status: 'Attended', date: '2026-10-20', startTime: '16:00:00', patient: CARLOS_GOMEZ, doctor: LUCIA_SORIA },
  { appointmentId: 'a1f0c3d2-0010-4b6e-9a10-000000000010', status: 'Cancelled', date: '2026-10-15', startTime: '11:00:00', patient: JOHNATHAN_DOE, doctor: ALEJANDRO_RIVERA },
  { appointmentId: 'a1f0c3d2-0011-4b6e-9a10-000000000011', status: 'Attended', date: '2026-10-13', startTime: '08:00:00', patient: JUAN_PEREZ, doctor: CRISTIAN_MARTINEZ },
  { appointmentId: 'a1f0c3d2-0012-4b6e-9a10-000000000012', status: 'Attended', date: '2026-10-09', startTime: '09:30:00', patient: SOFIA_RAMIREZ, doctor: ELENA_RODRIGUEZ },
]

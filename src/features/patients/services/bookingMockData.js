// TODO: example data. The backend endpoints for doctors and availabilities
// (/api/doctors, /api/doctors/{id}/availabilities) are admin-only today, so a
// patient token gets 403. Replace this file with real calls in patientService.js
// once the backend allows patients.

const CARDIOLOGY = { specialityId: 'e8d8b842-ea9d-4cfa-8b7b-ff642e50457c', name: 'Cardiologia' }
const NEUROLOGY = { specialityId: '3b1f6c2a-7d4e-4f8a-9c21-5e6d7a8b9c01', name: 'Neurologia' }
const PEDIATRICS = { specialityId: '9a2e4d6b-1c3f-4e5a-8b7c-0d1e2f3a4b5c', name: 'Pediatria' }
const GYNECOLOGY = { specialityId: '5c7e9a1b-3d5f-4a2c-9e8d-6b4a2c0e1f3d', name: 'Ginecologia' }
const TRAUMATOLOGY = { specialityId: '7f1a3c5e-9b2d-4c6e-8a0f-2d4b6e8a0c1e', name: 'Traumatologia' }

// Same shape as GET /api/doctors
  export const DOCTORS_RESPONSE = {
    pageSize: 100,
    pageIndex: 0,
    total: 7,
    data: [
      { id: '1a6ed432-c00b-4d86-9b81-be9c017c9ac2', name: 'Cristian Martinez', licenseNumber: '42201', isActive: true, speciality: CARDIOLOGY },
      { id: '2b7fe543-d11c-4e97-8c92-cf0d128d0bd3', name: 'Alejandro Rivera', licenseNumber: '38510', isActive: true, speciality: CARDIOLOGY },
      { id: '3c80f654-e22d-4fa8-9da3-d01e239e1ce4', name: 'Elena Rodríguez', licenseNumber: '40112', isActive: true, speciality: NEUROLOGY },
      { id: '4d91a765-f33e-40b9-8eb4-e12f34af2df5', name: 'Marcos Torres', licenseNumber: '35987', isActive: false, speciality: NEUROLOGY },
      { id: '5ea2b876-a44f-41ca-9fc5-f230450b3ea6', name: 'Robert Chen', licenseNumber: '41876', isActive: true, speciality: PEDIATRICS },
      { id: '6fb3c987-b550-42db-80d6-a341561c4fb7', name: 'Lucía Soria', licenseNumber: '39044', isActive: true, speciality: GYNECOLOGY },
      { id: '70c4da98-c661-43ec-91e7-b452672d50c8', name: 'Martín Acosta', licenseNumber: '37720', isActive: true, speciality: TRAUMATOLOGY },
    ],
  }

// Available times per doctor and weekday (1 = Monday ... 5 = Friday)
const AVAILABILITIES = {
  '1a6ed432-c00b-4d86-9b81-be9c017c9ac2': {
    1: ['08:00', '08:30', '09:00', '09:30', '10:00', '11:30'],
    2: ['08:00', '09:00', '10:30', '11:00', '12:30'],
    3: ['08:30', '09:30', '11:00', '11:30'],
    5: ['08:00', '08:30', '09:00', '14:00', '14:30'],
  },
  '2b7fe543-d11c-4e97-8c92-cf0d128d0bd3': {
    2: ['14:00', '14:30', '15:00'],
    4: ['09:00', '09:30', '10:00'],
  },
  '3c80f654-e22d-4fa8-9da3-d01e239e1ce4': {
    1: ['14:00', '14:30', '15:00'],
    3: ['09:00', '09:30', '10:00', '10:30'],
    4: ['16:00', '16:30'],
    5: ['09:00', '11:00'],
  },
  '4d91a765-f33e-40b9-8eb4-e12f34af2df5': {
    2: ['11:00', '11:30'],
    4: ['11:00', '11:30', '12:00'],
  },
  '5ea2b876-a44f-41ca-9fc5-f230450b3ea6': {
    1: ['10:00', '10:30', '11:00'],
    2: ['10:00', '10:30', '11:00', '11:30'],
    4: ['10:00', '10:30'],
    5: ['10:00', '10:30', '11:00', '11:30'],
  },
  '6fb3c987-b550-42db-80d6-a341561c4fb7': {
    1: ['08:00', '08:30'],
    2: ['15:00', '15:30', '16:00'],
    3: ['08:00', '08:30', '09:00'],
    4: ['15:00', '15:30'],
  },
  '70c4da98-c661-43ec-91e7-b452672d50c8': {
    1: ['17:00', '17:30', '18:00'],
    2: ['17:00', '17:30'],
    3: ['17:00', '17:30', '18:00'],
    5: ['17:00'],
  },
}

export function getDoctorSlots(doctorId, date) {
  return AVAILABILITIES[doctorId]?.[date.getDay()] ?? []
}

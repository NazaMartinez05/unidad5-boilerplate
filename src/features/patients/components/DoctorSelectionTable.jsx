import { useState } from 'react'
import Badge from '../../../components/atoms/Badge'
import ProfileImage from '../../../components/atoms/ProfileImage'
import Select from '../../../components/atoms/Select'
import FormField from '../../../components/molecules/FormField'
import Pagination from '../../../components/molecules/Pagination'

const PAGE_SIZE = 4

// Backend field isActive -> what we show in "Estado de Disponibilidad"
function getStatus(isActive) {
  return isActive
    ? { label: 'Active', variant: 'success', dotClass: 'bg-mint' }
    : { label: 'On Leave', variant: 'danger', dotClass: 'bg-danger' }
}

// One option per specialty found in the doctor list
function getSpecialityOptions(doctors) {
  const specialities = new Map(doctors?.map((doctor) => [doctor.speciality.specialityId, doctor.speciality.name]))
  const options = [...specialities].map(([value, label]) => ({ value, label }))
  return [{ value: '', label: 'Todas las especialidades' }, ...options]
}

// Doctors on leave (isActive: false) cannot be selected
function DoctorSelectionTable({ doctors, selectedDoctorId, onSelect }) {
  const [specialityId, setSpecialityId] = useState('')
  const [page, setPage] = useState(1)

  const filteredDoctors = specialityId
    ? doctors?.filter((doctor) => doctor.speciality.specialityId === specialityId)
    : doctors
  const totalPages = Math.max(1, Math.ceil(filteredDoctors?.length / PAGE_SIZE))
  const pageDoctors = filteredDoctors?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSpecialityChange = (event) => {
    setSpecialityId(event.target.value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="sm:max-w-xs">
        <FormField label="Filtrar por especialidad" htmlFor="speciality-filter">
          <Select
            id="speciality-filter"
            value={specialityId}
            onChange={handleSpecialityChange}
            options={getSpecialityOptions(doctors)}
          />
        </FormField>
      </div>

      <div className="overflow-hidden rounded-lg border border-highlight-line">
        <div className="overflow-x-auto">
          <table className="w-full min-w-140 text-left">
            <thead className="bg-highlight text-[11px] font-semibold tracking-wide text-ink-strong uppercase">
              <tr>
                <th className="w-12 px-4 py-3">
                  <span className="sr-only">Seleccionar</span>
                </th>
                <th className="px-4 py-3">Nombre del Doctor</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3 text-center">Estado de Disponibilidad</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {pageDoctors?.map((doctor) => {
                const status = getStatus(doctor.isActive)
                const isSelected = doctor.id === selectedDoctorId

                return (
                  <tr
                    key={doctor.id}
                    onClick={() => doctor.isActive && onSelect(doctor.id)}
                    className={`transition-colors ${
                      doctor.isActive ? 'cursor-pointer hover:bg-canvas' : 'opacity-60'
                    } ${isSelected ? 'bg-highlight' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!doctor.isActive}
                        onChange={() => onSelect(doctor.id)}
                        aria-label={`Seleccionar a ${doctor.name}`}
                        className="size-4 cursor-pointer accent-brand disabled:cursor-not-allowed"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative">
                          <ProfileImage name={doctor.name} className="size-9 rounded-md text-xs" />
                          <span
                            className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-surface ${status.dotClass}`}
                          />
                        </span>
                        <div className="leading-tight">
                          <p className="text-sm font-semibold text-ink-strong">{doctor.name}</p>
                          <p className="text-xs text-ink-soft">Matrícula: {doctor.licenseNumber}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="info">{doctor.speciality.name}</Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={status.variant} withDot>
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-highlight-line bg-highlight px-4 py-3">
          <p className="text-xs text-ink">
            Mostrando {pageDoctors?.length} de {filteredDoctors?.length} doctores registrados
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}

export default DoctorSelectionTable

import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../organisms/Sidebar'
import Topbar from '../organisms/Topbar'

function AdminLayout() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Verificar autenticación y permisos
  if (!token || role?.toUpperCase() !== 'ADMINISTRADOR') {
    return <Navigate to="/admin/login" replace />
  }

  const toggleMenu = () => setIsMenuOpen((open) => !open)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <Topbar onMenuClick={toggleMenu} />

      <Sidebar
        isOpen={isMenuOpen}
        onNavigate={closeMenu}
      />

      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-slate-900/35 desktop:hidden"
        />
      )}

      <main className="min-h-screen p-5 desktop:ml-62 desktop:px-10 desktop:py-8">
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout

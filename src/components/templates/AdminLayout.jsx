import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../organisms/Sidebar'
import Topbar from '../organisms/Topbar'

function AdminLayout() {
  // Only matters on mobile: on desktop the sidebar is always visible
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((open) => !open)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <Topbar onMenuClick={toggleMenu} />
      <Sidebar isOpen={isMenuOpen} onNavigate={closeMenu} />

      {isMenuOpen && (
        <div onClick={closeMenu} className="fixed inset-0 z-30 bg-slate-900/35 desktop:hidden" />
      )}

      <main className="min-h-screen p-5 desktop:ml-62 desktop:px-10 desktop:py-8">
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PanelLayout } from '@/layouts/PanelLayout'
import { CheckinView } from '@/views/CheckinView'
import { DashboardView } from '@/views/DashboardView'
import { LoginView } from '@/views/LoginView'
import { NotFoundView } from '@/views/NotFoundView'
import { SocioDetalleView } from '@/views/SocioDetalleView'
import { SociosView } from '@/views/SociosView'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/panel" replace /> },
  { path: '/login', element: <LoginView /> },
  {
    path: '/panel',
    element: <PanelLayout />,
    children: [
      { index: true, element: <DashboardView /> },
      { path: 'socios', element: <SociosView /> },
      { path: 'socios/:id', element: <SocioDetalleView /> },
      { path: 'checkin', element: <CheckinView /> },
    ],
  },
  { path: '*', element: <NotFoundView /> },
])

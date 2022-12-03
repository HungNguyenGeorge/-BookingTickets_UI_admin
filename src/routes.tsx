import { useContext, useEffect } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import BlogPage from './pages/EventPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import EventPage from './pages/EventPage';
import SimpleLayout from './layouts/simple';
import DashboardLayout from './layouts/dashboard';
import { AuthContext } from './context/AuthContext';

// ----------------------------------------------------------------------

export default function Router() {

  const { user } = useContext(AuthContext)
  console.log("🚀 ~ file: routes.tsx:18 ~ Router ~ user", user)
  const navigate = useNavigate();
  const routes = useRoutes(
    user && user.role === 0 ?
      [{
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="/dashboard/user" />, index: true },
          { path: 'user', element: <UserPage /> },
          { path: 'events', element: <EventPage /> },
          { path: 'blog', element: <BlogPage /> },
        ],
      },
      {
        path: 'login',
        element: <Navigate to="/dashboard/user" />,
      },
      {
        element: <SimpleLayout />,
        children: [
          { element: <Navigate to="/dashboard/blog" />, index: true },
          { path: '404', element: <Page404 /> },
          { path: '*', element: <Navigate to="/404" /> },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      }]
      :
      [{
        path: '*',
        element: <LoginPage />,
      }]

  );

  return routes;
}


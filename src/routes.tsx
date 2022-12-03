import { useEffect } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import BlogPage from './pages/EventPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import UniversityPage from './pages/UniversityPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SimpleLayout from './layouts/simple';
import DashboardLayout from './layouts/dashboard';

// ----------------------------------------------------------------------

export default function Router() {

  const navigate = useNavigate();
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/blog" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'university', element: <UniversityPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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
    },
  ]);

  return routes;
}


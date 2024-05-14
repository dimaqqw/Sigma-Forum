import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/Auth';
import AdminPage from '../pages/AdminPage';
import PostFormPage from '../pages/PostFormPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  { path: '/auth', element: <AuthPage /> },
  { path: '/admin-dashboard', element: <AdminPage /> },
  { path: '/new-post', element: <PostFormPage /> },
]);

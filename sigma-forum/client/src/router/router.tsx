import { createBrowserRouter } from 'react-router-dom';
import Layout from '../pages/Layout';
import ErrorPage from '../pages/ErrorPage';
import Home from '../pages/Home';
import Posts, { postLoader } from '../pages/Posts';
import Topics, { topicLoader } from '../pages/Topics';
import Auth from '../pages/Auth';
import Comments from '../pages/Comments';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/Auth';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { index: true, element: <Home /> },
//       {
//         path: 'posts',
//         loader: postLoader,
//         element: <Posts />,
//       },
//       { path: 'topics', loader: topicLoader, element: <Topics /> },
//       { path: 'auth', element: <Auth /> },
//       { path: 'comments', element: <Comments /> },
//     ],
//   },
// ]);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  { path: '/auth', element: <AuthPage /> },
]);

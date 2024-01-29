import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { AuthPage } from './App.tsx'
import './index.css'
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AuthProvider } from './context/authContext'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes.tsx';

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/login",
      element: <AuthPage />,
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/route3",
          element: <>protected 3</>,
        },
      ],
    },
  ], { basename: "/" },
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
    </AuthProvider>
  </React.StrictMode>,
)

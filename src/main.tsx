import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { AuthPage } from './App.tsx'
import './index.css'
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AuthProvider } from './context/AuthContext'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes.tsx';
type DynamicImportType = () => Promise<{ default: React.ComponentType<any>; }>;
type LazyComponentType = React.LazyExoticComponent<React.ComponentType<any>>;
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
      path: "/create-organization",
      async loader({ request, params }) {
        let { loader }:any = await import("./pages/CreateOrganization");
        return loader({ request, params });
      },
      errorElement: <>ds</>,
      lazy: () => import("./pages/CreateOrganization"),
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/create-organization",
          async loader({ request, params }) {
            let { loader }:any = await import("./pages/CreateOrganization");
            return loader({ request, params });
          },
          errorElement: <>ds</>,
          lazy: () => import("./pages/CreateOrganization"),
        }
      ],
    },
  ], { basename: "/" },
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <Theme appearance="light" accentColor="green" radius="small">
        <RouterProvider router={router} />
      </Theme>
    </AuthProvider>
  </React.StrictMode>,
)

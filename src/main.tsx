import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { AuthPage } from './App.tsx'
import './index.css'
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AuthProvider } from './context/AuthContext'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes.tsx';
import Navbar from './components/Navbar.tsx';
import { Box } from '@radix-ui/themes';
import background from "./assets/background.jpg";
export const router = createBrowserRouter(
  [
    {
      element: <Navbar />,
      children: [
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
          path: "/create-organization",
          async loader() {
            await import("./pages/CreateOrganization");
            return null;
          },
          lazy: () => import("./pages/CreateOrganization"),
        }
      ],
    }]}
  ], { basename: "/" },
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <Theme appearance="light" accentColor="green" radius="small">
    <Box style={{height: "100vh", background:`url("${background}")`}}>
        <RouterProvider router={router} />
        </Box>
      </Theme>
    </AuthProvider>
  </React.StrictMode>,
)

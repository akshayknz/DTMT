import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthPage } from './App.tsx'
import './index.css'
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AuthProvider } from './context/AuthContext'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes.tsx';
import Navbar from './components/Navbar.tsx';
import { Box } from '@radix-ui/themes';
import background from "./assets/background.jpg";
import Loading from './components/Loading.tsx';
export const router = createBrowserRouter(
  [
    {
      element: <Navbar />, //Navbar shows up on all child routes
      children: [
    {
      path: "/",
      element: <AuthPage />, //TODO: replace with a homepage (for unauthenticated users)
    },
    {
      path: "/login",
      element: <AuthPage />, //login page for unauthenticated but redirect to /dashboard if authenticated
    },
    {
      element: <ProtectedRoutes />, 
      /**
       * Protected child routes. This protection component will:
       * - show loading screen while loading
       * - show outlet after loading if authenticated
       * - navigate to /login if unauthenticated
       */
      children: [
        {
          path: "/dashboard",
          async loader() {
            await import("./pages/Dashboard");
            return <Loading/>; //show loading screen while lazy loading
          },
          lazy: () => import("./pages/Dashboard"), //Main authenticated screen
        },
        {
          path: "/create-organization",
          async loader() {
            await import("./pages/CreateOrganization");
            return <Loading/>; //show loading screen while lazy loading
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

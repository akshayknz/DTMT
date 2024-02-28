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
import Dashboard from './pages/Dashboard.tsx';
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
        //TODO: Change dashboard to normal load (dashboard will load on each back button)
          path: "/dashboard",
          element: <Dashboard />
        },
        {
          path: "/create-organization",
          async loader() {
            await import("./pages/CreateOrganization");
            return <Loading/>; //show loading screen while lazy loading
          },
          lazy: () => import("./pages/CreateOrganization"),
        },
        {
          path: "/page/new-page",
          async loader() {
            await import("./pages/Page");
            return <Loading/>; //show loading screen while lazy loading
          },
          lazy: () => import("./pages/Page"),
        },{
          path: "/org/:id",
          async loader() {
            await import("./pages/Organization");
            return <Loading/>; //show loading screen while lazy loading
          },
          lazy: () => import("./pages/Organization"),
        },
        {
          path: "/page/:id",
          async loader() {
            await import("./pages/Page");
            return <Loading/>; //show loading screen while lazy loading
          },
          lazy: () => import("./pages/Page"),
        },
      ],
    }]}
  ], { basename: "/" },
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <Theme appearance="light" accentColor="green" radius="small">
    <Box style={{minHeight: "100vh"}}>
        <RouterProvider router={router} />
        </Box>
      </Theme>
    </AuthProvider>
  </React.StrictMode>,
)

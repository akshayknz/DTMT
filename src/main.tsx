import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { AuthPage } from "./App.tsx";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes.tsx";
import Navbar from "./components/Navbar.tsx";
import { Box } from "@radix-ui/themes";
import background from "./assets/background.jpg";
import Loading from "./components/Loading.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./context/store";
import { saveUserId } from "./context/appSlice.ts";

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
              element: <Dashboard />,
              children: [
                {
                  path: "/dashboard/org/:id/settings",
                  async loader() {
                    await import("./pages/OrganizationSettings");
                    return <Loading />; //show loading screen while lazy loading
                  },
                  lazy: () => import("./pages/OrganizationSettings"),
                },
                {
                  path: "/dashboard/org/:id",
                  async loader() {
                    await import("./pages/Organization");
                    return <Loading />; //show loading screen while lazy loading
                  },
                  lazy: () => import("./pages/Organization"),
                  children: [
                    {
                      path: "/dashboard/org/:id/page/:pageid",
                      async loader() {
                        await import("./pages/Page");
                        return <Loading />; //show loading screen while lazy loading
                      },
                      lazy: () => import("./pages/Page"),
                    },
                  ],
                },
              ],
            },
            {
              path: "/create-organization",
              async loader() {
                await import("./pages/CreateOrganization");
                return <Loading />; //show loading screen while lazy loading
              },
              lazy: () => import("./pages/CreateOrganization"),
            },
            {
              path: "/order",
              async loader() {
                await import("./pages/OrderPage");
                return <Loading />; //show loading screen while lazy loading
              },
              lazy: () => import("./pages/OrderPage"),
            },
          ],
        },
      ],
    },
  ],
  { basename: "/" }
);

const App = () => {
  const { status, userId } = useContext(AuthContext);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(saveUserId(userId));
  }, [userId]);
  return (
    <React.StrictMode>
      <Theme appearance="light" accentColor="green" radius="small">
        <Box
          style={{
            minHeight: "100vh",
            background: "linear-gradient(white 80%, #00d26a2e 96%)",
          }}
        >
          <RouterProvider router={router} />
        </Box>
      </Theme>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

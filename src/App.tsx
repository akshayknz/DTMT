import './App.css'
import { Flex, Text, Button } from '@radix-ui/themes';
import { useContext } from "react"
import { Login, Register } from "./components"
import { AuthContext, AuthProvider } from './context/AuthContext';
import type { LoaderFunctionArgs } from "react-router-dom";
import {
  Form,
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useActionData,
  useFetcher,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";

export const AuthPage = () => {
  return (
    <section>
      <Login />
    </section>
  )
}

const App = () => {

  const { status, userId } = useContext(AuthContext)

  if (status === 'checking') return <p className="loading"><span>Checking credentials, wait a moment...</span></p>

  return (
    <main>
      {
        (status === 'authenticated' && userId)
          ? <HomePage />
          : <AuthPage />
      }
    </main>
  )
}
export default App;

export const HomePage = () => {
  const { userId, handleLogOut } = useContext(AuthContext)

  return (
    <section>
      <h5>Your ID is: <span>{userId}</span></h5>
      <ul>
        <li>
          <Link to="/login">Public Page</Link>
        </li>
        <li>
          <Link to="/route3">Protected Page</Link>
        </li>
      </ul>
      <button className="btn-logout" onClick={handleLogOut}>Log out</button>
    </section>
  )
}


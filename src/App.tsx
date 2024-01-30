import './App.css'
import { useContext } from "react"
import Login from './components/Login';
import { AuthContext } from './context/AuthContext';
import { Link } from "react-router-dom";
import { Spinner } from './assets/Spinner';
import Dashboard from './pages/Dashboard';
import Loading from './components/Loading';


export const AuthPage = () => {
  return (
    <section>
      <Login />
    </section>
  )
}

const App = () => {

  const { status, userId } = useContext(AuthContext)

  if (status === 'checking') return <Loading/>

  return (
    <main>
      
        {
        (status === 'authenticated' && userId)
          ? <Dashboard />
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


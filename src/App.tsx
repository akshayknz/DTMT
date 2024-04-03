import './App.css'
import { useContext } from "react"
import Login from './components/Login';
import { AuthContext } from './context/AuthContext';
import Loading from './components/Loading';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './context/store';
import { saveUserId } from './context/appSlice';

export const AuthPage = () => {
  return <Login />
}

 
const App = () => {
  const { status, userId } = useContext(AuthContext)

  if (status === 'checking') return <Loading/>

  return (
    <>
    {
        (status === 'authenticated' && userId)
          ? <Loading />
          : <AuthPage />
      }
    </>
  )
}

export default App;

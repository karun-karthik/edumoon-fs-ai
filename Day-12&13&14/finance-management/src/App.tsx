import './components/style.css'
import Login from "./components/Login"
import SideBar from "./components/SideBar"
import Signup from './components/Signup'
import { Route, Routes } from 'react-router'
import Dashboard from './components/Dashboard'
import Accounts from './components/Accounts'
import Transactions from './components/Transactions'
import Insights from './components/Insights'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div className="app-layout">
      <SideBar />
      <div className="main-content">
        <Routes>
          <Route path='home' element={<ProtectedRoute/>}>
            <Route index element={<Dashboard />} />
            <Route path='accounts' element={<Accounts />} />
            <Route path='transactions' element={<Transactions />} />
            <Route path='insights' element={<Insights />} />
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Signup />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

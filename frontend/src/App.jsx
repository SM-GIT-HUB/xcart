import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/Navbar"
import useUser from "./store/useUser.js"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import AdminPage from "./pages/AdminPage.jsx"
import CategoryPage from "./pages/CategoryPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import PurchaseSuccess from "./pages/PurchaseSuccess.jsx"
import PurchaseCancel from "./pages/PurchaseCancel.jsx"

function App() {
  const { user, checkAuth, checkingAuth } = useUser();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if (checkingAuth) {
    return (
      <LoadingSpinner/>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
          bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

      <div className="relative z-50 pt-20">
        <Navbar/>

        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={!user? <SignupPage/> : <Navigate to={'/'} />} />
          <Route path="/login" element={!user? <LoginPage/> : <Navigate to={'/'} />} />
          <Route path="/secret-dashboard" element={user?.role == "admin"? <AdminPage/> : <Navigate to={'/'} />} />
          <Route path="/category/:category" element={<CategoryPage/>} />
          <Route path="/cart" element={user? <CartPage/> : <Navigate to={'/login'} />} />
          <Route path="/purchase-success" element={user? <PurchaseSuccess/> : <Navigate to={'/login'} />} />
          <Route path="/purchase-cancel" element={user? <PurchaseCancel/> : <Navigate to={'/login'} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
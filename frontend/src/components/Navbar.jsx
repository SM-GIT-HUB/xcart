import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import useUser from "../store/useUser"

function Navbar() {
  const { user, logout } = useUser();
  const isAdmin = (user?.role == "admin");
  const cart = [1, 2, 3, 4];

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md
    shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link to={'/'} className="2xl font-bold text-emerald-400 items-center space-x-2 flex">
            XCart
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link to={'/'} className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
              Home
            </Link>

            {
              user && (
                <Link to={'cart'} className="relative group flex items-center text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out">
                  <ShoppingCart className="inline-block mr-1 " size={20} />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2
                  py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.length}
                  </span>
                </Link>
              )
            }

            {
              user && isAdmin && (
                <Link to={'/secret-dashboard'} className='bg-emerald-700 hover:bg-emerald-600 text-white
                px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'>
                  <Lock className="inline-block mr-1" size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )
            }

            {
              user?
              <button className='bg-gray-700 hover:bg-gray-600 text-white py-2
              px-3 rounded-md flex items-center transition duration-300 ease-in-out' onClick={logout}>
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </button> :
              <>
                <Link to={'/signup'} className='bg-emerald-600 hover:bg-emerald-700 text-white
                py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' >
                  <UserPlus className="mr-2" size={18} />
                  Signup
                </Link>
                
                <Link to={'/login'} className='bg-teal-600 hover:bg-teal-700 text-white
                py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            }
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
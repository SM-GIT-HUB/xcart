import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowRight, Loader, Lock, Mail, UserPlus } from "lucide-react";

function LoginPage() {
  const loading = 0;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e)
  {
    e.preventDefault();
    console.log(email, password);
  }

  const inputClasses = 'block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm';

  return (
    <div className="flex flex-col justify-center py-24 sm:py-12 sm:px-6 lg:px-8">
      <motion.div className='sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }} >
        <h2 className="mt-2 mb-2 text-center text-3xl font-extrabold text-emerald-400">Login with your account</h2>
      </motion.div>

      <motion.div className='mt-4 sm:mx-auto sm:w-full sm:max-w-md'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }} >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-4" >
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
                Email address
              </label>

              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>

                <input className={inputClasses}
                id='email' type='email' required placeholder='abc@gmail.com'
                value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                Password
              </label>

              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>

                <input className={inputClasses}
                id='password' type='password' required placeholder='••••••••'
                value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <button type='submit' disabled={loading} className='w-full flex justify-center py-2 px-4 border
            border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
            hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50' >
							{
                loading ? (
                  <>
                    <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                    Loading...
                  </>
                ) : (
                  <>
                    <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                    Login
                  </>
                )
              }
						</button>
          </form>

          <p className='mt-8 text-center text-sm text-gray-400'>
						{"Don't"} have an account?{" "}
						<Link to='/signup' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Signup here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
import { motion } from "framer-motion"
import apios from "../lib/axios"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { toastObj } from "../lib/toast"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

function AnalyticsTab() {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0
  })

  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    async function fetchAnalyticsData()
    {
      try {
        const response = await apios.get('/analytics');
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      }
      catch(err) {
        toast.error(err.response?.data?.message || err.message, toastObj);
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-[100px]">
        <div className="w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full left-0 top-0" />
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.totalUsers.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.totalProducts.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={analyticsData.totalRevenue.toLocaleString()}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
			</div>
			<motion.div className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }} >
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' stroke='#D1D5DB' />
						<YAxis yAxisId='left' stroke='#D1D5DB' />
						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#10B981'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
  )
}

export default AnalyticsTab

function AnalyticsCard({ title, value, icon: Icon, color })
{
  return (
    <motion.div className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }} >
      <div className='flex justify-between items-center'>
        <div className='z-10'>
          <p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
          <h3 className='text-white text-3xl font-bold'>{value}</h3>
        </div>
      </div>

      <div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />

      <div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
        <Icon className='h-32 w-32' />
      </div>
    </motion.div>
  )
}
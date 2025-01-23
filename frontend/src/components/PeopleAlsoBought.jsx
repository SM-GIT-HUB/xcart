import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { toastObj } from "../lib/toast"
import apios from "../lib/axios"
import LoadingSpinner from "./LoadingSpinner"
import ProductCard from "./ProductCard"

function PeopleAlsoBought() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchRecommendations()
  {
    try {
      const response = await apios.get('/products/recommendations');
      setRecommendations(response.data.products);
    }
    catch(err) {
      toast.error(err.response?.data?.message || err.message, toastObj);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, [])

  if (isLoading) {
    return <LoadingSpinner/>
  }

  return (
    <div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{
          recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        }
			</div>
		</div>
  )
}

export default PeopleAlsoBought
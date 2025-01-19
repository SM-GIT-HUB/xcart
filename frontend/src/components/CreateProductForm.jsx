import { useState } from "react"
import { motion } from "framer-motion"
import { Loader, PlusCircle, Upload, CircleX } from "lucide-react"
import toast from "react-hot-toast"
import useProduct from "../store/useProduct"

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

function CreateProductForm() {
  const state = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
  }

  const [newProduct, setNewProduct] = useState(state);

  const { loading, createProduct, products } = useProduct();
  console.log(products);

  async function handleSubmit(e)
  {
    e.preventDefault();

    await createProduct(newProduct);
    setNewProduct(state);
    document.getElementById('image').value = "";
  }

  function handleImageChange(e)
  {
    const file = e.target.files[0];

		if (file)
    {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("File size must be under 5MB");
      }

			setNewProduct({ ...newProduct, image: file });
		}
  }

  function removeImage()
  {
    setNewProduct({ ...newProduct, image: "" });
    document.getElementById('image').value = "";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
    className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto' >
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>

					<input type='text' id='name' name='name' required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
					className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
					px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' />
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>

					<textarea id='description' name='description' required value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
					rows='3' className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' />
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>

					<input type='number' id='price' name='price' required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
					step='0.01' className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' />
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>

					<select id='category' name='category' required value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' >
						<option value=''>Select a category</option>
						{
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            }
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />

					<label htmlFor='image' className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm
          leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500' >
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>

					{
            newProduct.image &&
            <div className="flex gap-2">
              <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>
              <CircleX onClick={removeImage} cursor={"pointer"}/>
            </div>
          }
				</div>

				<button type='submit' disabled={loading} className='w-full flex justify-center py-2 px-4 border border-transparent
        rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
				focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50' >
					{
             loading? (
              <>
                <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                Loading...
              </>
            ) : (
              <>
                <PlusCircle className='mr-2 h-5 w-5' />
                Create Product
              </>
            )
          }
				</button>
			</form>

      {
        newProduct.image &&
        <img src={URL.createObjectURL(newProduct.image)} alt="product image" className="rounded-lg mt-2 w-full" />
      }
		</motion.div>
  )
}

export default CreateProductForm
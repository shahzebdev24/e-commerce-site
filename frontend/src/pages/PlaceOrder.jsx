import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, getShippingFee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!token) {
        toast.error("Please login to place an order");
        navigate('/login');
        return;
      }

      let orderItems = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = products.find(p => p._id === itemId);
            if (itemInfo) {
              orderItems.push({
                ...itemInfo,
                size,
                quantity: cartItems[itemId][size],
              });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + getShippingFee(),
      };

      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        setCartItems({});
        localStorage.removeItem('cartItems');
        toast.success("Order placed successfully!");
        navigate('/orders');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName}
            className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='First Name' required />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName}
            className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Last Name' required />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email}
          className='w-full px-4 py-2 border border-gray-300 rounded' type="email" placeholder='Email Address' required />
        <input onChange={onChangeHandler} name='street' value={formData.street}
          className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Street' required />
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city}
            className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='City' required />
          <input onChange={onChangeHandler} name='state' value={formData.state}
            className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='State' required />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode}
            className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Zip Code' required />
          <input onChange={onChangeHandler} name='country' value={formData.country}
            className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Country' required />
        </div>
        <input onChange={onChangeHandler} name='phone' value={formData.phone}
          className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Mobile' required />
      </div>
      {/* Right Side Content */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        {/* Payment Method - COD Only */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className='min-w-3.5 h-3.5 border rounded-full bg-green-600'></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full mt-8 text-end'>
            <button type='submit' className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

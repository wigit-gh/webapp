// order details page
"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderDetails = ({ params }: { params: {order_id: string } }) => {
     const router = useRouter();
    const [ order, setOrder ] = useState<any>(null);
    const url = 'https://backend.wigit.com.ng/api/v1/admin/orders/' + params.order_id;

    let jwt: string | null = 'not authorized';
    if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('jwt')) {
            jwt = sessionStorage.getItem('jwt');
        }
    }
    const headers = {'Authorization': 'Bearer ' + jwt};

    useEffect(() => {
    async function getAllOrders() {
        try {
            const { data, status } = await axios.get(url, {headers: headers}) 
            if (status == 200) {
                setOrder(data.data);
            }
        } catch(error) {
            console.log(error);
        }
    };
        getAllOrders();
    }, []);
    
    function copy(text:string){
      navigator.clipboard.writeText(text);
      toast.info('Reference number copied!', {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    
    return (
        
        <div>
            <div onClick={() => {router.back()}} className='mb-6 hover:bg-accent/80 text-right ml-[10vw] duration-300 rounded-full p-3 max-w-max'>
               <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M480-160 160-480l320-320 42 42-248 248h526v60H274l248 248-42 42Z"/></svg> 
            </div>
            <h3>Copy ref. number <span
                className='inline cursor-pointer p-2 rounded text-accent text-sm underline font-bold hover:bg-dark_bg/60'
                onClick={() => copy(params.order_id.split('-')[0])}>{ params.order_id.split('-')[0]}
            </span></h3>
            <p className='font-bold text-lg my-2'>Items</p>
            <div>
            {order && order.items.map((item:any) => (
                <div key={ item.id }
                    className='p-4 flex justify-center gap-12 items-center mb-4 shadow-md hover:border-l-4 hover:border-l-accent mx-auto max-w-[80vw]'
                >
                    <div className='bg-red-300'>
                        <Image src={item.product.image_url} alt={item.product.name} width={40} height={50} />
                    </div>
                    <div className=''>
                        <h3>{ item.product.name }</h3>
                        <p>quantity: { item.quantity }</p>
                        <p>amount: GHS { item.amount }</p>
                    </div>
                </div>
            ))}
            <ul className='max-w-[80vw] flexbox gap-2 list-disc mx-auto'>
                { order && order.delivery_method === 'delivery' ?
                    <p className='font-bold'>Delivery address: {order.shipping_address}</p> :
                    <p className='font-bold'>Delivery method: Pickup</p>
                }
                {order &&<div className='pt-1'>Order placed at {order.created_at.split('T')[1].split('Z')[0]} on {order.created_at.split('T')[0]}</div>}
                {order &&<div className='pt-1'>Order updated at {order.updated_at.split('T')[1].split('Z')[0]} on {order.updated_at.split('T')[0]}</div>}
                { order && order.paid_updated_by !== '' ?
                    <li className='bg-green-200 p-1 text-green-800 border border-green-900'>Payment confirmed by: {order.paid_updated_by}</li> :
                    <li className='bg-red-200 p-1 text-red-800 border border-red-900'>Payment not yet confirmed</li>
                }
                { order && order.shipped_updated_by !== '' ?
                    <li className='bg-green-200 p-1 text-green-800 border-2 border-green-900'>Shipped by: {order.shipped_updated_by}</li> :
                    <li className='bg-red-200 p-1 text-red-800 border border-red-900'>Not yet shipped</li>
                }
                { order && order.delivered_updated_by !== '' ?
                    <li className='bg-green-200 p-1 text-green-800 border border-green-900'>Delivered by: {order.delivered_updated_by}</li> :
                    <li className='bg-red-200 p-1 text-red-800 border border-red-900'>Delivery pending</li>
                }
                { order && order.cancelled_updated_by !== '' ?
                    <li className='bg-red-800 p-1 text-white border border-red-900'>Order cancelled by: {order.cancelled_updated_by}</li> :
                    <p></p>
                }
            </ul>
            </div>
            <p className='font-bold text-accent text-md'>Order Total: GHS <span className='font-bold text-xl'>{ order && order.total_amount}</span></p>
            <ToastContainer />
            </div>
    )
};

export default OrderDetails;
// export default function Page({ params }: { params: { order_id: string } }) {
//   return <div>My Post: {params.order_id}</div>
// }
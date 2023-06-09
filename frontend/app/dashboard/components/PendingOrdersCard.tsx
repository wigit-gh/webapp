// Dashboard pending orders page
"use client";

import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { NextPage } from 'next';

const PendingOrdersCard: NextPage<any> = (order) => {
    const baseUrl = 'https://backend.wigit.com.ng/api/v1/admin';
    const router = useRouter();

    let jwt: string | null = 'not authorized';
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem('jwt')) {
                jwt = sessionStorage.getItem('jwt');
            }
    }

    const [showMark, setShowMark] = useState(false);
    const [ paid, setPaid ] = useState(false);
    const headers = { "Authorization": "Bearer " + jwt};

    function copy(text:string){
      navigator.clipboard.writeText(text);
      toast.info('Reference number copied!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    
    const handleShowMarkAsPaid = () => {
      setShowMark(currValue => !currValue);  
    };
    const handleMarkAsPaid = async(order: any) => {
        let available = true;
        order.items.map((item: any) => {
            if (item.product.stock == 0) {
                available = false;
                toast.error('An item in this order is out of stock', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
        });
            return;
            }
        })
        if (available) {
            try {
          const { status } = await axios.put(baseUrl + '/orders/' + order.id + '/paid', {status: "paid"}, {headers:headers});
          setPaid(true);
          if (status === 200) {
          toast.success('Order marked as paid!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
        router.push('/dashboard/paid_orders');
        setPaid(false);
      } catch (error) {
            toast.error('Unable to update order status', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
        });   
   }
        }
      
    };
    
    return (
        <div className={!paid ? 'border border-accent w-full py-3 px-6' : 'hidden'}>
            <Link href={'/dashboard/' + order.id} className=' px-3 py-1 rounded mb-4 text-light_bg underline bg-dark_bg/80'><span>view order</span></Link>
            <h3 className='pt-3'>Reference: 
            <span
            className=' px-2 text-accent text-sm underline font-bold'
            onClick={() => copy(order.id.split('-')[0])}>{ order.id.split('-')[0]}</span>
            {!showMark ?
                <span onClick={handleShowMarkAsPaid} className={order.status === 'pending' ? 'bg-red-500 cursor-pointer px-3 py-1 rounded text-light_bg' : 'bg-green-500 px-3 py-1 rounded text-light_bg'}>{ order.status }</span> :
                
                <span>
                    <button onClick={() => {handleMarkAsPaid(order)}} className='bg-green-200 mt-4 duration-300 hover:scale-105 py-2 px-4 rounded shadow-md border font-bold text-green-900 border-green-700'>Mark as paid</button>
                    <span onClick={handleShowMarkAsPaid}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m448-326 112-112 112 112 43-43-113-111 111-111-43-43-110 112-112-112-43 43 113 111-113 111 43 43ZM120-480l169-239q13-18 31-29.5t40-11.5h420q25 0 42.5 17.5T840-700v440q0 25-17.5 42.5T780-200H360q-22 0-40-11.5T289-241L120-480Z"/></svg>
                    </span>
                </span>
            }
            </h3>
            <div>
                <p>Items: <span className='font-bold text-sm'>{ order.items.length }</span></p>
                <p>Total: <span className='font-bold text-sm'>GHS { order.total_amount }</span></p>
                <p>Delivery method: <span className='font-bold text-sm'>{ order.delivery_method }</span></p>
            </div>
        </div>
    )
};

export default PendingOrdersCard;
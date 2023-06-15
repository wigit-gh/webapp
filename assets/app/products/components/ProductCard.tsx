// Product card component 
"use client";

import Button from '@components/Button';
import { Product } from '../interfaces/product';
import { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useSignInContext } from '@app/SignInContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard: NextPage<Product> = (props) => {
    const { jwt } = useSignInContext();
    const [ signInAlert, setSignInAlert ] = useState(false);
    const [ somethingWrong, setSomethingWrong ] = useState(false);
    const [ viewCart, setViewCart ] = useState(false);
    
    const addToCart = async (product_id: string, quantity: number) => {
    // send the product id and quantity
    const url = "https://cheezaram.tech/api/v1/cart";
    const payload = {
        product_id,
        quantity
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
    }
    if (jwt === 'not authorized') {
        toast.error('Please sign in to shop with us.', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        return;
    }
    if (props.stock <= 0) {
        alert('out of stock');
        return;
    }
    try {
        const { status } = await axios.post(url, payload, {headers: headers});
    if (status != 201) {
            toast.error(' Something went wrong!', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    } else {
        setViewCart(true);
        toast.info('Item added to cart', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    }
    catch (error) {
            toast.error('Item already added to cart!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            //fix this for other problems
            return;
    }
    
};

return (
    <section className='h-full'>
        { !signInAlert ?
        <div className='bg-white shrink-0 shadow-lg h-full overflow-hidden rounded w-[150px] md:w-[200px] flexbox_row hover:scale-105 duration 400'>
        <div className=' overflow-hidden h-[120px] w-full'>
            <Image src={ props.image_url } alt={ props.name } width={200} height={120}
             className='object-cover'
            />
        </div>
        <div className=' p-4 w-full'>
            <h2 className='capitalize text-sm font-bold text-neutral-700 '>{ props.name }</h2>
            <p className='my-1 text-neutral-500 '>{ props.description }</p>
            <span className={props.category === 'straight' ? 'bg-sky-700 tag' : props.category === 'wavy' ? 'bg-pink-700 tag' : 'bg-teal-600 tag'}>{ props.category}</span><span className='text-xs text-gray-400 ml-4 '>{props.stock} left</span>
            <p className=' text-accent font-bold'>GHS { props.price }</p>
            <Button text='add to cart' onClick={() => {addToCart(props.id, 1)}} />
            { viewCart && <Link href='/cart'>view cart</Link>}
        </div>
    </div> :
    <div className='w-screen h-screen bg-slate-700 text-white absolute top-50 left-0'>please sign in first.. add link to sign in page...<br/> to be sorted out later ;) handle multiple entries too </div>
    }
    </section>
)};

export default ProductCard;

// shopping cart component
"use client";

import { useState } from 'react';
import { useSignInContext } from '@app/SignInContextProvider';
import axios from 'axios';
import Item from '@app/cart/interfaces/ShoppingCartProps';
// import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ShoppingCart: any = (props: Item) => {
    const [ newQty, setNewQty ] = useState(props.quantity);
    const [ newAmount, setNewAmount ] = useState(Number(props.amount));
    const [ hideItem, setHideItem ] = useState(false);

    let jwt: string | null = '';
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem('jwt')) {
                jwt = sessionStorage.getItem('jwt');
            }
    }
    const headers = {'Authorization': 'Bearer ' + jwt};
    const router = useRouter();

    const handleQtyMinus = async() => {
        if (newQty > 1) {
            setNewQty(newQty - 1);
            setNewAmount( newAmount - (Number(props.amount)/props.quantity));
            //get the price from data
            try {
                const qtyUrl = 'https://backend.wigit.com.ng/api/v1/cart/' + props.id + '/' + (newQty - 1);
                console.log(qtyUrl);
                const { data, status } = await axios.put(qtyUrl, newQty - 1, {headers: headers});
                console.log(newQty - 1);
            } catch (error) {
                console.log(error);
                //take this out!
            }
        }
    };
    const handleQtyPlus = async() => {
        // check stock
        setNewQty(newQty + 1);
        setNewAmount( newAmount + (Number(props.amount)/props.quantity));
        const qtyUrl = 'https://backend.wigit.com.ng/api/v1/cart/' + props.id + '/' + (newQty + 1);
        console.log(qtyUrl);
        const { data, status } = await axios.put(qtyUrl, newQty + 1, {headers: headers});
        console.log(newQty + 1);
    };
    const handleRemoveItem = async() => {
        await axios.delete('https://backend.wigit.com.ng/api/v1/cart/' + props.id, {headers: headers});
        setHideItem(true);
    };

    return (
        <section className={hideItem ? 'hidden' : 'flex p-2 justify-between min-h-[130px] border-b border-dark_bg/80'}>
            <div className=' w-[80px] overflow-ellipsis'>
                <div className='mx-auto w-[70px] h-[70px] overflow-hidden'>
                    <Image src={ props.product.image_url } alt={ props.product.name } width={70} height={50}
                    />
                </div>
                <span className='text-sm font-bold capitalize text-dark_bg/70'>{props.product.name}</span>
            </div>
            <div className='gap-2 flex flex-col justify-center'>
                <div className='flex gap-2 items-center'>
                    <button onClick={ handleQtyMinus } className=''>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M280-453h400v-60H280v60ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>
                    </button>
                    <span>{ newQty }</span>
                    <button onClick={ handleQtyPlus } className=''>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M453-280h60v-166h167v-60H513v-174h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Z"/></svg>
                    </button>
                    <button onClick={ handleRemoveItem } className=''>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>
                    </button>
                </div>
                <span className='font-extrabold text-accent'>{ newAmount }</span>
            </div>
        </section>
    )
};

export default ShoppingCart;

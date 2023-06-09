// setings page

"use client";

import { useRouter } from 'next/navigation';
import { useSignInContext } from '@app/SignInContextProvider';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Settings = () => {
    const router = useRouter();
    const [showDelete, setShowDelete] = useState(false);
    const { jwt, setJwt, setIsSignedIn, setRole } = useSignInContext();

    const [ user, setUser ] = useState<any>('');

    useEffect(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('jwt')) {
            setJwt(sessionStorage.getItem('jwt'));
        };
        let userObj: string = '';
        if (typeof window !== 'undefined' && sessionStorage.getItem('user')) {
            userObj = sessionStorage.getItem('user')!;
        }
        setUser(JSON.parse(userObj, undefined));
    }, []);
    

    let email = '';
    // let user: any = {};
    let headers = {};
    let url = '';

    email = user.email;
    headers = {'Authorization': 'Bearer ' + jwt};
    url = 'https://backend.wigit.com.ng/api/v1/users/' + email;

    const handleShowDelete = () => {
        setShowDelete(currValue => !currValue);
    };
    const handleDelete = async () => {
        try {
            const { status } = await axios.delete(url, {headers: headers});
            if (status == 200) {
                toast.info('Account deleted!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                window.sessionStorage.clear();
                setIsSignedIn(false);
                setRole('guest');
                setJwt('not authorized');
                router.push('/');
            }
        } catch (error) {
            toast.error('Something went wrong, please try again.', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };
    const authorizeUser = () => {
        if (jwt === 'not authorized') {
            router.push('/signin');
        }
    };
    useEffect(authorizeUser, []);

    return (
        <section>
            {jwt !== 'not authorized' ? 
                <div>
                    <div onClick={() => {router.back()}} className='hover:bg-accent/80 text-right ml-[10vw] duration-300 rounded-full p-3 max-w-max'>
                       <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M480-160 160-480l320-320 42 42-248 248h526v60H274l248 248-42 42Z"/></svg> 
                    </div>
                    <h3 className='p-4 text-2xl font-bold mb-4 text-dark_bg/70'>Settings</h3>
                    <div>
                        { showDelete &&
                            <div className='m-4'>
                                <h4>Are you sure you want to permanently delete your account?</h4>
                                <button onClick={handleDelete} className='bg-red-200 mt-4 duration-300 hover:scale-105 mr-2 py-2 px-4 rounded shadow-md border font-bold text-red-900 border-red-700'>Yes, Delete it</button>
                                <button onClick={handleShowDelete} className='bg-green-200 mt-4 duration-300 hover:scale-105 py-2 px-4 rounded shadow-md border font-bold text-green-900 border-green-700'>No, Keep it</button>
                            </div>
                        }
                        <div onClick={handleShowDelete} className='bg-red-500 cursor-pointer flexbox max-w-max p-6 mx-auto shadow-md rounded'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="m361-299 119-121 120 121 47-48-119-121 119-121-47-48-120 121-119-121-48 48 120 121-120 121 48 48ZM261-120q-24 0-42-18t-18-42v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570Zm-438 0v570-570Z"/></svg>
                            <p className='font-extrabold text-lg text-dark_bg/90'>Delete account</p>
                        </div>
                    </div>
                    <ToastContainer />
                </div> :
                <div>Please sign in</div>
            }
        </section>
    );
};

export default Settings;

// form component
// remove console logs for handlers

"use client";
import { useState } from 'react';
import Button from '@components/Button';
import Input from '@components/Input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSignInContext } from '../../SignInContextProvider';

export const metadata = { title: 'sign in wigit' };

const signInForm = () => {
    
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const { jwt, setJwt, setRole, isSignedIn, setIsSignedIn, user, setUser } = useSignInContext();
    const router = useRouter();
    const url = "https://cheezaram.tech/api/v1/signin";


    const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setEmail(event.target.value);
    };
    const handleSetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setPassword(event.target.value);
    };
    const handleSignIn = () => {
        console.log('signed in successfully!' + email, password)
    };
    async function handleAxios (event: any){
        event.preventDefault();
        const credentials = { email, password };
        
        const { data, status } = await axios.post(url, credentials);
        if (status == 200) {
            setJwt(data.jwt);
            setRole(data.user.role);
            setIsSignedIn(true);
            // setUser(data.user);
            window.sessionStorage.setItem('jwt', data.jwt);
            window.sessionStorage.setItem('role', data.user.role);
            window.sessionStorage.setItem('isSignedIn', true);
            window.sessionStorage.setItem('user', JSON.stringify(data.user))
            console.log(data);
            console.log(isSignedIn);
            setUser(JSON.parse(window.sessionStorage.getItem('user')));
            console.log(user);
            console.log(window.sessionStorage.getItem('user'));
            router.push('/');
        }
    };
    const handleResetPassword = async () => {
        //event.preventDefault();
        await axios.post("https://cheezaram.tech/api/v1/reset_password", { email });
        router.push('/');
        alert("A password reset link has been sent to your email");
    };

    return (
        <form onSubmit={ handleAxios } className='flex flex-col gap-2 p-4 center max-w-max sm:max-w-l'>
            <h1>Sign In</h1>
            <label htmlFor='email'></label>
            <Input onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSetEmail(event)}
                type='text'
                name='email'
                placeholder='Enter email'
                id='email'
                required={ true }
            />
            <label htmlFor='password'></label>
            <Input onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSetPassword(event)}
                type='password'
                name='password'
                placeholder='Enter password'
                id='password'
                required={ true }
            />
            <Button type='submit' text='sign in' />
            <p>Forgot password? <span className='underline pointer text-accent font-extrabold' onClick={handleResetPassword}>reset it here</span></p>

        </form>
    )
};

export default signInForm;
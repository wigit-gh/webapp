// sign in page

import SignInForm from '@app/signin/components/SignInForm';

export const metadata = {
  title: 'Wigit Sign in'
}

const signin = () => {
    // check if user is signed in
    // const user: any = window.sessionStorage.getItem('user') ?
    //     JSON.parse(window.sessionStorage.getItem('user')) :
    //     {};
    // const { data, error } = useQuery({ queryKey: ['signInSubmit'], queryFn: handleAxios})
    // console.log(data);
    // async function handleAxios () {
    //     const { data } = await axios.post("https://jel1cg-8000.csb.app/signin", { headers: {"Authorization": "newBossVee", "Content-Type": "Application/json"}, token: 'something sent from the client side'});
    //     console.log(data ? data : error);
    //     setIsSignedIn(true);
    // }
      
    

    return (
        <main className='signin_main flex flex-col justify-around items-center'>
            {/* take this to rootlayout to conditionally render sign in link  */}
            <div className='mb-6 capitalize font-extrabold text-dark_bg'>
                <h2>Welcome, please sign in</h2>
            </div>
            <SignInForm />
        </main>
    )
    
};

export default signin;
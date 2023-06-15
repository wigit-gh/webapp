// App logo

import Image from "next/image";
import Link from 'next/link';
import logo from '/public/assets/images/logo.svg';

const Logo = () => (
    <div className='logo_wrap bg-white h-8'>
        <Image
          src={logo}
          alt='Wigit Company Logo'
          width={70}
          height={60}
        />
    </div>
);

export default Logo;
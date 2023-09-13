import React from 'react';
// import Header from './Header'

import {Helmet} from "react-helmet";
// import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';

import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';

// for SEO We used HELMET and for dynamic we are pass ass parameter as prop.
const Layout = ({children,title,description,keywords,authors}) =>{
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name='description' content={description}/>
                <meta name ='keywords' content={keywords}/>
                <meta name ='authors' content={authors}/>
                <title>{title}</title>
               
            </Helmet>
            <Header/>
            <main style={{minHeight:"100vh" , }}>
            <Toaster />
            {children}
            </main>
         
        </div>
    )
}

Layout.defaultProps={
    title:'google-doc ',
    description:" google-doc project",
    keywords:"E-commerce, Online shopping, Shopping cart, Product listings, Product categories, Payment gateway, Order management, Customer reviews, Wishlist, Discounts and promotions, Shipping and delivery, User registration and login, Search functionality, Mobile shopping app, Responsive design, Customer support, Shopping recommendations, Social media integration, Secure transactions, Order tracking",
    author:"swapnil",

    
}

export default Layout;
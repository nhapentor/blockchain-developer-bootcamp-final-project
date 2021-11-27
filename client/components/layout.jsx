import React from 'react'
import Navbar from './navbar'
// import Footer from './footer'

const Layout = ({ children, ...rest }) => {

    return (
        <>
            <Navbar />
            <main>{children}</main>
            {/* <Footer /> */}
        </>
    )
}

export default Layout;
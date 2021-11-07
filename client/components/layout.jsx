import React from 'react'
import Navbar from './navbar'
import Footer from './footer'

const Layout = ({ children, ...rest }) => {

    return (
        <>
            <Navbar employee={rest.employee} />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default Layout;
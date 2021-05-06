import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function Layout({children}) {
    return (
        <div style={{ width: "100%" }}>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default Layout;
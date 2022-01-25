import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import TopNav from '../topnav/TopNav';
import './layout.css';

const Layout = () => {
    return (
        <div className='layout'>
            <Sidebar />
            <div className='main'>
                <div className='main__content'>
                    <TopNav />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;

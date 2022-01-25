import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import TopNav from '../topNav/TopNav';
import './layout.css';

const Layout = () => {
    return (
        <div className='layout'>
            <Sidebar />
            <div className='main'>
                <TopNav />
                <div className='main__content'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;

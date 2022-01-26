import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import Sidebar from '../sidebar/Sidebar';
import TopNav from '../topNav/TopNav';
import './layout.css';

const Layout = () => {
    const {
        themeState: { color, theme }
    } = useContext(ThemeContext);

    return (
        <div className={`layout ${theme?.class} ${color?.class}`}>
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

import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import sidebarItems from '../../configs/sidebar';
import logo from '../../assets/images/logo.png';
import './sidebar.css';

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const activeItem = sidebarItems.findIndex(
      (item) => item.link === location.pathname
    );

    setActiveIndex(activeItem);
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="logo" />
      </div>
      {sidebarItems.map((item, index) => (
        <Link to={item.link} key={index}>
          <div className="sidebar__item">
            <div
              className={`sidebar__item-inner ${
                activeIndex === index && 'active'
              }`}
            >
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;

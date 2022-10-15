import { Link } from 'react-router-dom';
import './topNav.css';
import Dropdown from '../dropdown/Dropdown';
import ThemeMenu from '../themeMenu/ThemeMenu';
import userAvatar from '../../assets/images/avatar.jpg';
import userMenu from '../../configs/userMenu';
import notifications from '../../configs/notifications';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user.image} alt="avatar" />
    </div>
    <div className="topnav__right-user__name">{user.name}</div>
  </div>
);

const renderUserMenu = (item, index) => (
  <Link to={item.link} key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const TopNav = () => {
  const {
    authState: {
      user: { displayName }
    }
  } = useContext(AuthContext);

  const userInfo = {
    name: displayName,
    image: userAvatar
  };

  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Khum tìm được đâu" />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          <Dropdown
            customToggle={() => renderUserToggle(userInfo)}
            contentData={userMenu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;

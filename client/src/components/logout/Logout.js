import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LogOut = () => {
    const { logout } = useContext(AuthContext);
    logout();
    return <div></div>;
};

export default LogOut;

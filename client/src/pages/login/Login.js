import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/loginForm/LoginForm';
import { AuthContext } from '../../contexts/AuthContext';
import './login.css';

const Login = () => {
    const {
        authState: { isAuthenticated }
    } = useContext(AuthContext);

    if (isAuthenticated) return <Navigate to='/' />;

    return (
        <div className='login-form__container'>
            <div className='dark-overlay'>
                <div className='login-form__inner'>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default Login;

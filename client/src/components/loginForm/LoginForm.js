import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './loginForm.css';

const LoginForm = () => {
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: ''
    });
    const [formError, setFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const { login } = useContext(AuthContext);

    const { username, password } = userInfo;

    const onChangeLoginForm = (event) => {
        setIsSubmit(false);
        setFormError({});
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError(validate(userInfo));
        setIsSubmit(true);
    };

    useEffect(async () => {
        if (Object.keys(formError).length === 0 && isSubmit) {
            try {
                const response = await login(userInfo);
                if (!response.success) {
                    setFormError({
                        password: response.message
                    });
                }
            } catch (error) {
                console.log(error);
                setFormError({
                    password: 'Tài khoản hoặc mật khẩu không đúng!'
                });
            }
        }
    }, [formError]);

    const validate = (values) => {
        const errors = {};
        if (!values.username) {
            errors.username = 'Thiếu tên đăng nhập!';
        }
        if (!values.password) {
            errors.password = 'Thiếu mật khẩu!';
        }
        return errors;
    };

    return (
        <>
            <form className='login-form' onSubmit={handleSubmit}>
                <h1 className='login-form__title'>Đăng nhập</h1>
                <div className='login-form__div'>
                    <input
                        type='text'
                        className='login-form__input'
                        placeholder=' '
                        name='username'
                        value={username}
                        onChange={onChangeLoginForm}
                    />
                    <label className='login-form__label'>Tên đăng nhập</label>
                </div>
                {formError.username ? (
                    <p className='error'>{formError.username}</p>
                ) : null}
                <div className='login-form__div'>
                    <input
                        type='password'
                        className='login-form__input'
                        placeholder=' '
                        name='password'
                        value={password}
                        onChange={onChangeLoginForm}
                    />
                    <label className='login-form__label'>Mật khẩu</label>
                </div>
                {formError.password ? (
                    <p className='error'>{formError.password}</p>
                ) : null}
                <input
                    type='submit'
                    className='login-form__button'
                    value='Đăng nhập'
                />
            </form>
        </>
    );
};

export default LoginForm;

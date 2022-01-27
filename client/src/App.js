import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/css/main.css';
import './assets/css/theme.css';
import ThemeProvider from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Activities from './pages/activities/Activities';
import Clubs from './pages/clubs/Clubs';
import Dashboard from './pages/dashboard/Dashboard';
import Departments from './pages/departments/Departments';
import Events from './pages/events/Events';
import Groups from './pages/groups/Groups';
import Members from './pages/members/Members';
import Login from './pages/login/Login';
import NotFound from './pages/notFound/NotFound';
import AuthProvider from './contexts/AuthContext';
import RequireAuth from './components/auth/RequireAuth';
import Logout from './components/logout/Logout';
import Profile from './pages/profile/Profile';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<RequireAuth />}>
                            <Route path='/' element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route
                                    path='departments'
                                    element={<Departments />}
                                />
                                <Route path='clubs' element={<Clubs />} />
                                <Route path='groups' element={<Groups />} />
                                <Route
                                    path='activities'
                                    element={<Activities />}
                                />
                                <Route path='events' element={<Events />} />
                                <Route path='members' element={<Members />} />
                                <Route path='profile' element={<Profile />} />
                            </Route>
                            <Route path='/logout' element={<Logout />} />
                        </Route>
                        <Route path='/login' element={<Login />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;

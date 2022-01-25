import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/css/main.css';
import Layout from './components/layout/Layout';
import Activities from './pages/Activities';
import Clubs from './pages/Clubs';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Events from './pages/Events';
import Groups from './pages/Groups';
import Members from './pages/Members';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='/departments' element={<Departments />} />
                    <Route path='/clubs' element={<Clubs />} />
                    <Route path='/groups' element={<Groups />} />
                    <Route path='/activities' element={<Activities />} />
                    <Route path='/events' element={<Events />} />
                    <Route path='/members' element={<Members />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

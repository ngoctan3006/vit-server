import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/css/main.css';
import './assets/css/theme.css';
import Layout from './components/layout/Layout';
import Activities from './pages/activities/Activities';
import Clubs from './pages/clubs/Clubs';
import Dashboard from './pages/dashboard/Dashboard';
import Departments from './pages/departments/Departments';
import Events from './pages/events/Events';
import Groups from './pages/groups/Groups';
import Members from './pages/members/Members';

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

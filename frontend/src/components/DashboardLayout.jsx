import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1D1D2C] flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

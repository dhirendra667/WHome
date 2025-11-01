import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Event, AddHomeWork, ListAlt } from '@mui/icons-material';

const HostDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const userId = user?._id;
    const firstName = user?.firstName || 'Host';

    // Get live stats from the Redux user state
    const totalProperties = user?.propertyList?.length || 0;
    const totalReservations = user?.reservationList?.length || 0; 

    const dashboardActions = [
        {
            title: "Manage Reservations",
            description: "View, confirm, or manage all bookings made on your properties.",
            icon: <Event sx={{ color: '#2563EB', fontSize: 30 }} />,
            link: `/${userId}/reservations`,
            count: totalReservations,
        },
        {
            title: "View/Edit My Listings",
            description: "Go directly to the full list of your created properties.",
            icon: <ListAlt sx={{ color: '#059669', fontSize: 30 }} />,
            link: `/${userId}/properties`,
            count: totalProperties,
        },
        {
            title: "List a New Property",
            description: "Quickly create and publish a new listing.",
            icon: <AddHomeWork sx={{ color: '#F59E0B', fontSize: 30 }} />,
            link: '/create-listing',
            count: null,
        },
    ];

    return (
        <>
            <Navbar />
            
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
                
                {/* --- HEADER & GREETING --- */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome to your **Host Dashboard**, **{firstName}**! 🏡
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Manage your rentals and check your activity at a glance.
                    </p>
                </header>

                {/* --- QUICK ACTION GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {dashboardActions.map((action) => (
                        <div 
                            key={action.title}
                            onClick={() => navigate(action.link)}
                            className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gray-100 rounded-full">
                                    {action.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {action.title}
                                </h2>
                            </div>
                            
                            <p className="mt-4 text-gray-600">
                                {action.description}
                            </p>
                            
                            {action.count !== null && (
                                <p className="mt-4 text-3xl font-extrabold text-gray-900">
                                    {action.count} <span className="text-lg font-medium text-gray-500">Listings/Bookings</span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default HostDashboard;
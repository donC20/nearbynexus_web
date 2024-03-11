import React, { useState } from 'react';
import style from '../css/sidebar.module.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebase';
import MainLoading from './mainLoading';

const Sidebar = (props) => {
    const navigate = useNavigate(); // Get the navigate function
    const [signoutLoading, setSignoutLoading] = useState(false);
    const handleLogout = async () => {
        try {
            setSignoutLoading(true);
            await auth.signOut().then(setSignoutLoading(false));
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };
    // Display loading screen while checking authentication status
    if (signoutLoading) {
        return (
            <MainLoading />
        );
    }

    return (
        <div>
            <div className={`${props.resposiveData} ${style.sidebar}`}>
                <div className="p-3 d-flex flex-column">
                    <Link to="/dashboard">
                        <div className={style.sideBarButton}>
                            <i className="bi bi-speedometer2 me-3"></i>
                            <span>Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/users">
                        <div className={style.sideBarButton}>
                            <i className="bi bi-person me-3"></i>
                            <span>Users</span>
                        </div>
                    </Link>
                    <Link to="/jobs_posts">
                        <div className={style.sideBarButton}>
                            <i className="bi bi-person me-3"></i>
                            <span>Job posts</span>
                        </div>
                    </Link>
                    <Link to="/services">
                        <div className={style.sideBarButton}>
                            <i className="bi bi-person me-3"></i>
                            <span>Services</span>
                        </div>
                    </Link>
                    <Link to="/payments">
                        <div className={style.sideBarButton}>
                            <i className="bi bi-person me-3"></i>
                            <span>Payments</span>
                        </div>
                    </Link>
                    <div className={style.sideBarButton} onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-3 text-danger"></i>
                        <span className='text-danger'>Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

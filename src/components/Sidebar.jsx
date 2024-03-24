import React, { useState,useEffect } from 'react';
import style from '../css/sidebar.module.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebase';
import MainLoading from './mainLoading';

const Sidebar = (props) => {
    const navigate = useNavigate(); // Get the navigate function
    const [signoutLoading, setSignoutLoading] = useState(false);
    const [tabIOn, settabIOn] = useState('dashboard');

    useEffect(() => {
        // Scroll the sidebar into view if it's not fully visible
        const sidebar = document.querySelector(`.${style.sidebar}`);
        if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth' });
    }, []);

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
            <div className={`${props.resposiveData} ${style.sidebar} `}>
                <div className="p-3 d-flex flex-column gap-2">
                    <Link to="/dashboard">
                        <div className={`${style.sideBarButton} ${style[tabIOn == "dashboard" ? 'active' : '']}`} onClick={() => settabIOn('dashboard')} data-bs-dismiss={props.isSmallScreen ? 'offcanvas' : ''} aria-label="Close">
                            <i className="bi bi-speedometer2 me-3"></i>
                            <span>Dashboard</span>
                        </div>
                    </Link>
                    <hr />
                    <small className={style.subHeadings}>OTHERS</small>
                    <Link to="/users">
                        <div className={`${style.sideBarButton} ${style[tabIOn == "users" ? 'active' : '']}`} id='user_tab' onClick={() => settabIOn('users')} data-bs-dismiss={props.isSmallScreen ? 'offcanvas' : ''} aria-label="Close">
                            <i className="bi bi-people me-3"></i>
                            <span>Users</span>
                        </div>
                    </Link>
                    <Link to="/jobs_posts">
                        <div className={`${style.sideBarButton} ${style[tabIOn == "jobs_posts" ? 'active' : '']}`} onClick={() => settabIOn('jobs_posts')} data-bs-dismiss={props.isSmallScreen ? 'offcanvas' : ''} aria-label="Close">
                            <i className="bi bi-person-workspace me-3"></i>
                            <span>Job posts</span>
                        </div>
                    </Link>
                    <Link to="/services">
                        <div className={`${style.sideBarButton} ${style[tabIOn == "services" ? 'active' : '']}`} onClick={() => settabIOn('services')} data-bs-dismiss={props.isSmallScreen ? 'offcanvas' : ''} aria-label="Close">
                            <i className="bi bi-wrench-adjustable-circle me-3"></i>
                            <span>Services</span>
                        </div>
                    </Link>
                    <Link to="/payments">
                        <div className={`${style.sideBarButton} ${style[tabIOn == "payments" ? 'active' : '']}`} onClick={() => settabIOn('payments')} data-bs-dismiss={props.isSmallScreen ? 'offcanvas' : ''} aria-label="Close">
                            <i className="bi bi-credit-card-fill me-3"></i>
                            <span>Payments</span>
                        </div>
                    </Link>
                    <hr />
                    <small className={style.subHeadings}>ACCOUNT</small>
                    <Link to="/settings">
                        <div className={`${style.sideBarButton} ${style[tabIOn == "settings" ? 'active' : '']}`} onClick={() => settabIOn('settings')} data-bs-dismiss={props.isSmallScreen ? 'offcanvas' : ''} aria-label="Close">
                            <i className="bi bi-gear-fill me-3"></i>
                            <span>Settings</span>
                        </div>
                    </Link>
                    <div className={`${style.sideBarButton}`} onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-3 text-danger"></i>
                        <span className='text-danger'>Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

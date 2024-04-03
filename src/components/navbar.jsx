import React, { useCallback, useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { fetchDocData, fetchDocDataRealtime, getAllDataOnCondition, updateDocsData } from './Apifunction';
import CommonLoader from './commonLoader';

const Navbar = () => {
    const navigate = useNavigate();
    const db = getFirestore();
    const [userId, setUid] = useState('');
    const [userData, setUserData] = useState(null);

    const [userCount, setUserCount] = useState(0);
    const [userOnlineCount, setUserOnlineCount] = useState(0);
    const [generalUserCount, setGeneralUserCount] = useState(0);
    const [hoverIOn, setHoverIOn] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [notificationLoader, setNotificationLoader] = useState(true);
    const [showNotificationBadge, setShowNotificationBadge] = useState(false);

    // Function to fetch new users and jobs
    const fetchNewUsersAndJobs = useCallback(() => {
        fetchDocDataRealtime('app_config', 'notifications', (appConfigData) => {
            if (appConfigData) {
                const new_user_list = appConfigData.new_users;
                const new_jobs_list = appConfigData.new_jobs;

                new_user_list.forEach(uid => {
                    fetchDocDataRealtime('users', uid, (userData) => {
                        if (userData) {
                            setNotifications(prevNotifications => [...prevNotifications, { type: 'user', data: userData }]);
                        }
                    });
                });

                new_jobs_list.forEach(jobId => {
                    fetchDocDataRealtime('job_posts', jobId, async (jobData) => {
                        if (jobData) {
                            const postedBy = await fetchDocData('users', jobData.jobPostedBy.id);
                            setNotifications(prevNotifications => [...prevNotifications, { type: 'job', data: jobData, postBy: postedBy }]);
                        }
                    });
                });

                setNotificationLoader(false);
            }
        });
    }, [notifications]);

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const uid = currentUser.uid;
                setUid(uid);

                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userSnapshot = docSnap.data();
                    setUserData(userSnapshot);
                } else {
                    console.log('No such document!');
                }
            }
        };

        getAllDataOnCondition('users', [
            { field: 'userType', operator: '!=', value: 'admin' },
            { field: 'status', operator: '==', value: 'active' }
        ], (data) => {
            setUserCount(data.length);
        });

        getAllDataOnCondition('users', [
            { field: 'userType', operator: '!=', value: 'admin' },
            { field: 'status', operator: '==', value: 'active' },
            { field: 'online', operator: '==', value: true }
        ], (data) => {
            setUserOnlineCount(data.length);
        });

        getAllDataOnCondition('users', [
            { field: 'userType', operator: '==', value: 'general_user' },
        ], (data) => {
            setGeneralUserCount(data.length);
        });

        fetchData();
        fetchNewUsersAndJobs();
    }, [db, fetchNewUsersAndJobs]);

    useEffect(() => {
        const oldNotifications = localStorage.getItem('oldNotifications');

        if (oldNotifications !== null && !isNaN(parseInt(oldNotifications))) {
            if (notifications.length !== parseInt(oldNotifications)) {
                setShowNotificationBadge(true);
            } else {
                setShowNotificationBadge(false);
            }
        } else {
            console.log("Invalid or missing oldNotifications value in local storage");
        }
    }, [notifications]);

    const userName = userData ? userData.name : "user";
    const userImage = userData ? (userData.image || "raster/avatar-1.png") : "raster/avatar-1.png";

    const setSeenNotifications = async () => {
        localStorage.setItem('oldNotifications', notifications.length);
        setHoverIOn('');
        if (notifications.length >= 10) {
            setNotifications([]);
            updateDocsData('notifications', 'app_config', { new_jobs: [] });
            updateDocsData('notifications', 'app_config', { new_users: [] });
        }
    };


    return (
        <div>
            {/* Offcanvas */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-body p-0">
                    <div className="userNameData">
                        <div className={`d-flex flex-row gap-1 justify-content-between p-2 align-items-center brandName`}>
                            <div>
                                <img src='/images/logo.png' alt="logo" />
                                <span>NearbyNexus</span>
                            </div>
                            <div>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                        </div>
                        <div className='userAvatatContainerRes mt-1 d-flex flex-column align-items-center gap-2'>
                            <img src={userImage} className='rounded-circle' alt="" />
                            <span className='text-light'>Welcome, {userName}</span>
                        </div>
                        <div className={`hoverContainerWrapped position-relative  mt-2`} onMouseEnter={() => setHoverIOn('people')} onMouseLeave={() => setHoverIOn('')}>
                            <div className="d-flex gap-3 w-100 justify-content-center">
                                <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('people')} onMouseLeave={() => setHoverIOn('')}>
                                    <div className="d-flex gap-2">
                                        <i className="bi bi-people-fill text-light"></i>
                                        <span className='text-light'>{userCount}</span>
                                    </div>
                                    <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "people" ? 'hovered' : ''}`}>
                                        <small><b>Total users</b></small>
                                        <hr className='mt-1 mb-1' />
                                        <small className='text-secondary'>
                                            <i className="bi bi-info-circle me-1 text-secondary"></i>
                                            Displays the total user count.
                                        </small>
                                    </div>
                                </div>
                                {/*  */}
                                <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('broadcast')} onMouseLeave={() => setHoverIOn('')}>
                                    <div className="d-flex gap-2">
                                        <i className="bi bi-broadcast-pin text-light"></i>
                                        <span className='text-light'>{userOnlineCount}</span>
                                    </div>
                                    <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "broadcast" ? 'hovered' : ''}`}>
                                        <small><b>Online Users</b></small>
                                        <hr className='mt-1 mb-1' />
                                        <small className='text-secondary'>
                                            <i className="bi bi-info-circle me-1 text-secondary"></i>
                                            Displays the total online user count.
                                        </small>
                                    </div>
                                </div>

                                {/*  */}
                                <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('backpack')} onMouseLeave={() => setHoverIOn('')}>
                                    <div className="d-flex gap-2">
                                        <i className="bi bi-backpack2-fill text-light"></i>
                                        <span className='text-light'>{generalUserCount}</span>
                                    </div>
                                    <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "backpack" ? 'hovered' : ''}`}>
                                        <small><b>General Users</b></small>
                                        <hr className='mt-1 mb-1' />
                                        <small className='text-secondary'>
                                            <i className="bi bi-info-circle me-1 text-secondary"></i>
                                            Displays the total count of users who are general to the application.
                                        </small>
                                    </div>
                                </div>

                                {/*  */}
                                <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('headset')} onMouseLeave={() => setHoverIOn('')}>
                                    <div className="d-flex gap-2">
                                        <i className="bi bi-headset text-light"></i>
                                        <span className='text-light'>{userCount - generalUserCount}</span>
                                    </div>
                                    <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "headset" ? 'hovered' : ''}`}>
                                        <small><b>Service providers</b></small>
                                        <hr className='mt-1 mb-1' />
                                        <small className='text-secondary'>
                                            <i className="bi bi-info-circle me-1 text-secondary"></i>
                                            Displays the total count of users who are provides services to the users.
                                        </small>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <Sidebar resposiveData='d-lg-block' isSmallScreen={true} />
                </div>
            </div>
            {/* Nav */}
            <nav className="navContainer position-relative navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler border-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list text-light"></i>
                    </button>
                    <div className={`d-flex flex-row gap-1 justify-content-start align-items-center brandName`}>
                        <div className="d-flex gap-3 d-lg-none">
                            {/* Icon containers */}
                            {/*  */}
                            <div className={`notificationsWrapper position-relative `} onMouseEnter={() =>
                                setHoverIOn('notifications')} onMouseLeave={setSeenNotifications}>
                                <div className="d-flex gap-2">
                                    <i className="bi bi-bell-fill text-light"></i>
                                </div>
                                <div className={`container p-2 bg-white position-absolute rounded shadow notificationsWrapperContainer ${hoverIOn == "notifications" ? 'hovered' : ''}`}>
                                    <small><b>Notifications</b></small>
                                    <hr className='mt-1 mb-1' />
                                    {notificationLoader ?
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <CommonLoader />
                                        </div> :
                                        <div className="d-flex flex-column">
                                            <div>

                                                {notifications.length > 0 ? notifications.map((item, index) => {
                                                    if (item.type === 'user') {
                                                        return (
                                                            <div className="d-flex p-2 gap-2" key={index}>
                                                                <img src={item.data.image} className='rounded-circle' alt="" />
                                                                <small><b>{item.data.name} </b> joined the platform</small>
                                                            </div>

                                                        );
                                                    } else if (item.type === 'job') {
                                                        return (

                                                            <div className="d-flex p-2 gap-2" key={index}>
                                                                <small><b>{item.postBy.name}</b> posted new <b>{item.data.jobTitle}</b> job</small>

                                                            </div>

                                                        );
                                                    }
                                                    return null; // This should not happen, but it's a good practice to return null for unrecognized types
                                                }) : <div><small className='d-flex justify-content-center align-items-center'>No new notifications!</small></div>}
                                            </div>
                                        </div>}
                                </div>
                            </div>
                            {/* Repeat for other icons */}
                        </div>
                        <img src='/images/logo.png' alt="logo" />
                        <span>NearbyNexus</span>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        </ul>
                        <div className="rigthNavSide d-flex flex-lg-row gap-4">
                            <div className="navRightIcons d-flex flex-lg-row gap-4 align-items-center">
                                {/* Icon containers */}
                                <div className="d-flex gap-3">
                                    <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('people')} onMouseLeave={() => setHoverIOn('')}>
                                        <div className="d-flex gap-2">
                                            <i className="bi bi-people-fill text-light"></i>
                                            <span className='text-light'>{userCount}</span>
                                        </div>
                                        <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "people" ? 'hovered' : ''}`}>
                                            <small><b>Total users</b></small>
                                            <hr className='mt-1 mb-1' />
                                            <small className='text-secondary'>
                                                <i className="bi bi-info-circle me-1 text-secondary"></i>
                                                Displays the total user count.
                                            </small>
                                        </div>
                                    </div>
                                    {/*  */}
                                    <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('broadcast')} onMouseLeave={() => setHoverIOn('')}>
                                        <div className="d-flex gap-2">
                                            <i className="bi bi-broadcast-pin text-light"></i>
                                            <span className='text-light'>{userOnlineCount}</span>
                                        </div>
                                        <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "broadcast" ? 'hovered' : ''}`}>
                                            <small><b>Online Users</b></small>
                                            <hr className='mt-1 mb-1' />
                                            <small className='text-secondary'>
                                                <i className="bi bi-info-circle me-1 text-secondary"></i>
                                                Displays the total online user count.
                                            </small>
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('backpack')} onMouseLeave={() => setHoverIOn('')}>
                                        <div className="d-flex gap-2">
                                            <i className="bi bi-backpack2-fill text-light"></i>
                                            <span className='text-light'>{generalUserCount}</span>
                                        </div>
                                        <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "backpack" ? 'hovered' : ''}`}>
                                            <small><b>General Users</b></small>
                                            <hr className='mt-1 mb-1' />
                                            <small className='text-secondary'>
                                                <i className="bi bi-info-circle me-1 text-secondary"></i>
                                                Displays the total count of users who are general to the application.
                                            </small>
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div className={`hoverContainerWrapped position-relative `} onMouseEnter={() => setHoverIOn('headset')} onMouseLeave={() => setHoverIOn('')}>
                                        <div className="d-flex gap-2">
                                            <i className="bi bi-headset text-light"></i>
                                            <span className='text-light'>{userCount - generalUserCount}</span>
                                        </div>
                                        <div className={`container p-2 bg-white position-absolute rounded shadow hoverActiveContainer ${hoverIOn == "headset" ? 'hovered' : ''}`}>
                                            <small><b>Service providers</b></small>
                                            <hr className='mt-1 mb-1' />
                                            <small className='text-secondary'>
                                                <i className="bi bi-info-circle me-1 text-secondary"></i>
                                                Displays the total count of users who are provides services to the users.
                                            </small>
                                        </div>
                                    </div>
                                    {/*  */}
                                    <div className={`notificationsWrapper position-relative `} onMouseEnter={() =>
                                        setHoverIOn('notifications')} onMouseLeave={setSeenNotifications}>
                                        <div className="d-flex gap-2">
                                            {/* badge notification */}
                                            <i className="bi bi-bell-fill text-light">
                                                {showNotificationBadge ?
                                                    <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle">
                                                        <span class="visually-hidden">New alerts</span>
                                                    </span> : <></>
                                                }
                                            </i>
                                        </div>
                                        <div className={`container p-2 bg-white position-absolute rounded shadow notificationsWrapperContainer ${hoverIOn == "notifications" ? 'hovered' : ''}`}>
                                            <small><b>Notifications</b></small>
                                            <hr className='mt-1 mb-1' />
                                            {notificationLoader ?
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <CommonLoader />
                                                </div> :
                                                <div className="d-flex flex-column">
                                                    <div>

                                                        {notifications.length > 0 ? notifications.map((item, index) => {
                                                            if (item.type === 'user') {
                                                                return (
                                                                    <div className="d-flex p-2 gap-2" key={index}>
                                                                        <img src={item.data.image} className='rounded-circle' alt="" />
                                                                        <small><b>{item.data.name} </b> joined the platform</small>
                                                                    </div>

                                                                );
                                                            } else if (item.type === 'job') {
                                                                return (

                                                                    <div className="d-flex p-2 gap-2" key={index}>
                                                                        <small><b>{item.postBy.name}</b> posted new <b>{item.data.jobTitle}</b> job</small>

                                                                    </div>

                                                                );
                                                            }
                                                            return null; // This should not happen, but it's a good practice to return null for unrecognized types
                                                        }) : <div><small className='d-flex justify-content-center align-items-center'>No new notifications!</small></div>}
                                                    </div>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                                {/* Repeat for other icons */}
                            </div>
                            <div className='userAvatatContainer d-flex align-items-center gap-2'>
                                <span className='text-light'>Welcome, {userName}</span>
                                <img src={userImage} className='rounded-circle' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav >
        </div >
    );
};

export default Navbar;

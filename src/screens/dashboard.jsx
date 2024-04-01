import React, { useEffect, useState } from 'react';
import style from '../css/dashboard.module.css';
import { getAllDataOnCondition } from '../components/Apifunction';
import ServicesUsage from '../components/dasboardComponents/servicesUsage';
import RevenueMatrix from '../components/dasboardComponents/revenueMetrix';
const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [userOnlineCount, setUserOnlineCount] = useState(0);
    const [generalUserCount, setgeneralUserCount] = useState(0);
    useEffect(() => {
        document.title = 'NearbyNexus | Admin';
        return () => {
            // Reset the document title when the component unmounts
            document.title = 'NearbyNexus';
        };
    }, []);
    useEffect(() => {
        // get user count
        getAllDataOnCondition('users', [
            { field: 'userType', operator: '!=', value: 'admin' },
            { field: 'status', operator: '==', value: 'active' }
        ], (data) => {
            setUserCount(data.length);
        });

        // get online count
        getAllDataOnCondition('users', [
            { field: 'userType', operator: '!=', value: 'admin' },
            { field: 'status', operator: '==', value: 'active' },
            { field: 'online', operator: '==', value: true }
        ], (data) => {
            setUserOnlineCount(data.length);
        });

        // get general user  count
        getAllDataOnCondition('users', [
            { field: 'userType', operator: '==', value: 'general_user' },
        ], (data) => {
            setgeneralUserCount(data.length);
        });
    }, []);

    return (
        <div className={style.dashboard}>
            <div className="container p-4">
                <div className="d-flex flex-column justify-content-start">
                    <h2 className={style.topHeading}>Dashboard</h2>
                </div>
                <br />
                {/* cards */}
                <div className={`row gap-4 ${style.staticsContainer}`}>
                    {/* card 1 */}
                    <div className={`col-lg-3 col-md-6 col-sm-12 col-12 shadow ${style.cookieCard} ${style.cardOne}`}>
                        <div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-people-fill text-light fs-3 me-2"></i>
                                <span className='fw-bold fs-4 text-light'>{userCount}</span>
                            </div>
                            <p className={style.cookieHeading}>Users</p>
                        </div>
                        <p className={style.cookieDescription}>
                            <i className="bi bi-info-circle me-1 text-light"></i>
                            Displays the total user count.
                        </p>
                    </div>
                    {/* card 2 */}
                    <div className={`col-lg-3 col-md-6 col-sm-12 shadow ${style.cookieCard} ${style.cardTwo}`}>
                        <div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-broadcast-pin text-light fs-3 me-2"></i>
                                <span className='fw-bold fs-4 text-light'>{userOnlineCount}</span>
                            </div>
                            <p className={style.cookieHeading}>Online Users</p>
                        </div>
                        <p className={style.cookieDescription}>
                            <i className="bi bi-info-circle me-1 text-light"></i>
                            Displays the total online user count.
                        </p>
                    </div>
                    {/* card 3 */}
                    <div className={`col-lg-3 col-md-6 col-sm-12 shadow ${style.cookieCard} ${style.cardThree}`}>
                        <div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-backpack2-fill text-light fs-3 me-2"></i>
                                <span className='fw-bold fs-4 text-light'>{generalUserCount}</span>
                            </div>
                            <p className={style.cookieHeading}>General Users</p>
                        </div>
                        <p className={style.cookieDescription}>
                            <i className="bi bi-info-circle me-1 text-light"></i>
                            Displays the total count of users who are general to the application.
                        </p>
                    </div>
                    {/* card 4 */}
                    <div className={`col-lg-3 col-md-6 col-sm-12 shadow ${style.cookieCard} ${style.card}`}>
                        <div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-headset text-light fs-3 me-2"></i>
                                <span className='fw-bold fs-4 text-light'>{userCount - generalUserCount}</span>
                            </div>
                            <p className={style.cookieHeading}>Service providers</p>
                        </div>
                        <p className={style.cookieDescription}>
                            <i className="bi bi-info-circle me-1 text-light"></i>
                            Displays the total count of users who are provides services to the users.
                        </p>
                    </div>
                </div>
                {/* cards ends */}
                <div className="row gap-3 mt-4">
                    {/* services cards */}
                    <RevenueMatrix />
                    <ServicesUsage />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

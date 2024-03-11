import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase';

const Navbar = () => {
    const db = getFirestore();
    const [userId, setUid] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Get the current user's ID
            const currentUser = auth.currentUser;
            if (currentUser) {
                const uid = currentUser.uid;
                setUid(uid);

                // Fetch data based on the user's ID
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userSnapshot = docSnap.data();
                    setUserData(userSnapshot);
                    // console.log('User data:', userSnapshot); // Log the updated userSnapshot
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchData();
    }, [db]);

    // Render user's name if userData exists, otherwise render "user"
    const userName = userData ? userData.name : "user";

    // Render user's image if userData exists, otherwise render default image
    const userImage = userData ? (userData.image || "raster/avatar-1.png") : "raster/avatar-1.png";

    return (
        <div>


            <nav className="navContainer position-relative navbar navbar-expand-lg fixed-top bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`d-flex flex-row gap-1 justify-content-start align-items-center brandName`}>
                        <img src='/images/logo.png' alt="logo" />
                        <span>NearbyNexus</span>
                    </div>

                    {/* <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    </form> */}

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        </ul>
                        {/* right sided options */}
                        <div className="rigthNavSide d-flex flex-lg-row gap-4">
                            <div className="navRightIcons d-flex flex-lg-row gap-4 align-items-center">
                                <img src="svg/messages-1-svgrepo-com.svg" alt="messages" />
                                <img src="svg/notofication-2-svgrepo-com.svg" alt="notifications" />
                            </div>
                            <div className='userAvatatContainer d-flex align-items-center gap-2'>
                                <span className='text-light'>Welcome, {userName}</span>
                                <img src={userImage} className='rounded-circle' alt="" />
                            </div>
                        </div>
                        {/* right ends */}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

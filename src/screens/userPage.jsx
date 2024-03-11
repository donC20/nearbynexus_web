import React, { useEffect, useState } from 'react';
import style from '../css/userpage.module.css';
import { banUser, convertToSentenceCase, convertUnixTime, getAllDataOnCondition } from '../components/Apifunction';
import { doc, setDoc } from 'firebase/firestore';
import CommonLoader from '../components/commonLoader';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // State to hold filtered users
    const [selectedUser, setSelectedUser] = useState(null); // State to hold the currently selected user
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
    const [loading, setLoading] = useState(true); // State to hold the search query

    useEffect(() => {
        // Fetch data when component mounts
        setLoading(true)
        getAllDataOnCondition('users', [{ field: 'userType', operator: '!=', value: 'admin' }], (data) => {
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false)

        });
    }, []); // Empty dependency array ensures this effect runs only once

    // Function to handle click on the info button and set the selected user
    const handleInfoClick = (user) => {
        setSelectedUser(user);
    };

    // Function to handle search input change
    const handleSearchInputChange = (event) => {
        setLoading(true)
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        // Filter users based on search query
        const filtered = users.filter(user => user.name.toLowerCase().includes(query));
        setFilteredUsers(filtered);
        setLoading(false)
    };
    return (
        <div className="container p-4">
            <div className="d-flex flex-column justify-content-start">
                <h2 className={style.topHeading}>Manage Users</h2>
                <p className='text-secondary'>Manage all users from a single place.</p>
            </div>
            {/* Search input field */}
            <div className="mb-3 d-flex">
                <input type="text" className="form-control" placeholder="Search by name" value={searchQuery} onChange={handleSearchInputChange} />
                {/* <button>filter</button> */}
            </div>
            {/* all users container */}
            {loading ? <div className='d-flex justify-content-center'>
                <CommonLoader />
            </div> :
                <div className="p-4 bg-white rounded">
                    <div className="d-flex flex-column gap-2">
                        <b className=''><i className="bi bi-people-fill me-2"></i>All Users</b>
                        <small className='text-secondary'><b>{filteredUsers.length}</b> Registered users.</small>
                    </div>

                    <div className="table-responsive">
                        <table className={`table mt-2 ${style.allUserTable}`}>
                            <thead>
                                <tr>
                                    <th scope="col"><i className="bi bi-people"></i></th>
                                    <th scope="col">User</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Info</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className={style.userAvatar}>
                                                <img className='rounded-circle' src={user.image} alt="userImg" />
                                                <div className={`${style.badge} bg-${user.online ? 'success' : 'danger'}`}></div>
                                            </div>
                                        </td>
                                        <td>{convertToSentenceCase(user.name)}</td>
                                        <td>{user.userType == "general_user" ? "General User" : "Vendor"}</td>
                                        <td className={user.status == 'active' ? 'text-success' : 'text-danger'}><i className={`bi bi-${user.status == 'active' ? 'check-circle-fill' : 'x-circle-fill'} me-2`}></i>{convertToSentenceCase(user.status)}</td>
                                        <td><button className='btn btn-transparent border-0' data-bs-toggle="modal" data-bs-target="#infoModal" onClick={() => handleInfoClick(user)}><i className="bi bi-info-circle"></i></button></td>
                                        <td>
                                            {user.status == "active" ?
                                                <button className={style.banUserBtn} onClick={() => banUser(user.id, 'disabled')}>Ban user</button>
                                                :
                                                <button className={style.unBanUserBtn} onClick={() => banUser(user.id, 'active')}>Unban user</button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal code */}
                    <div className="modal fade" id="infoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">User Information</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    {/* Display user information here */}
                                    {selectedUser && (
                                        <div>
                                            <div className="d-flex w-100 flex-column justify-content-center align-items-center gap-2">
                                                <img className={style.selectedUserImage} src={selectedUser.image} alt="useriameg" />
                                                <small><b>{selectedUser.name}</b></small>
                                            </div>
                                            <table class="table">
                                                {selectedUser.userType == 'general_user' ? <tbody>
                                                    <tr>
                                                        <th scope="row"><small>Email</small></th>
                                                        <td className='text-end'><small>{selectedUser.emailId['id']} <i className={`bi bi-${selectedUser.emailId['verified'] ? 'patch-check-fill' : 'x-circle-fill'} me-2 ${selectedUser.emailId['verified'] ? 'text-primary' : 'text-danger'}`}></i></small></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row"><small>Location</small></th>
                                                        <td className='text-end'><small>{selectedUser.geoLocation}</small></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row"><small>Activity</small></th>
                                                        <td className={`text-end ${selectedUser.online ? 'text-success' : 'text-danger'}`}><small>{selectedUser.online ? 'Online' : 'Offline'}</small></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row"><small>Phone</small></th>
                                                        <td className='text-end'><small>{selectedUser.phone['number']} <i className={`bi bi-${selectedUser.phone['verified'] ? 'patch-check-fill' : 'x-circle-fill'} me-2 ${selectedUser.phone['verified'] ? 'text-primary' : 'text-danger'}`}></i></small></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row"><small>Last seen</small></th>
                                                        <td className='text-end'><small>{convertUnixTime(selectedUser.last_seen)}</small></td>
                                                    </tr>
                                                </tbody> :
                                                    // if other user
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row"><small>Email</small></th>
                                                            <td className='text-end'><small>{selectedUser.emailId['id']} <i className={`bi bi-${selectedUser.emailId['verified'] ? 'patch-check-fill' : 'x-circle-fill'} me-2 ${selectedUser.emailId['verified'] ? 'text-primary' : 'text-danger'}`}></i></small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>Location</small></th>
                                                            <td className='text-end'><small>{selectedUser.geoLocation}</small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>Rating</small></th>
                                                            <td className='text-end'><small>{selectedUser.totalRating} / 5</small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>Activity</small></th>
                                                            <td className={`text-end ${selectedUser.online ? 'text-success' : 'text-danger'}`}><small>{selectedUser.online ? 'Online' : 'Offline'}</small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>Phone</small></th>
                                                            <td className='text-end'><small>{selectedUser.phone['number']} <i className={`bi bi-${selectedUser.phone['verified'] ? 'patch-check-fill' : 'x-circle-fill'} me-2 ${selectedUser.phone['verified'] ? 'text-primary' : 'text-danger'}`}></i></small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>About</small></th>
                                                            <td className={selectedUser.about == '' ? 'text-end' : 'text-justify'}><small>{selectedUser.about == '' ? 'About unavilable' : selectedUser.about}</small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>KYC</small></th>
                                                            <td className='text-end'><small>{selectedUser.kyc['verified'] ? 'Verified' : 'Verification pending'} <i className={`bi bi-${selectedUser.kyc['verified'] ? 'patch-check-fill' : 'x-circle-fill'} me-2 ${selectedUser.kyc['verified'] ? 'text-primary' : 'text-danger'}`}></i></small></td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>Services</small></th>
                                                            <td>
                                                                {selectedUser.services.map((value, index) => (
                                                                    <span key={index} className="badge text-bg-secondary me-2">{convertToSentenceCase(value)}</span>
                                                                ))}
                                                            </td>

                                                        </tr>
                                                        <tr>
                                                            <th scope="row"><small>Last seen</small></th>
                                                            <td className='text-end'><small>{convertUnixTime(selectedUser.last_seen)}</small></td>
                                                        </tr>
                                                    </tbody>}


                                            </table>

                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}

export default UserPage;

import React, { useEffect, useState } from 'react';
import style from '../../css/services.module.css';
import { deleteService, editService, fetchDocData } from '../Apifunction';
import { Link } from 'react-router-dom';
import CommonLoader from '../commonLoader';

const AllServices = () => {
    const [loading, setLoading] = useState(true);
    const [serviceList, setServiceList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for the search term
    const [updateTerm, setUpdateTerm] = useState(''); // State for the search term
    const [errText, setErrText] = useState(''); // State for the search term
    const [inputValue, setInputValue] = useState(''); // State for the input value

    // Refactor fetchData outside of useEffect
    const fetchData = async () => {
        try {
            const data = await fetchDocData('services', 'service_list');
            setServiceList(data['service']);
            setLoading(false);
        } catch (error) {
            console.error('Can\'t fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Call fetchData on component mount
    }, []);

    // Function to handle search input changes
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter the service list based on the search term
    const filteredServiceList = serviceList.filter(service =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (serviceName) => {
        if (window.confirm('Are you sure you want to remove this service?')) {
            setLoading(true);
            const result = await deleteService(serviceName);
            if (result.success) {
                fetchData();
            } else {
                console.error('Failed to delete service:', result.error);
            }
        }
    };
    const handleUpdate = async (oldServiceName, newServiceName) => {
        if (newServiceName === '') {
            setErrText('This feild cant be empty!')
        } else {
            try {
                setLoading(true);

                await editService(oldServiceName, newServiceName)
                fetchData();
            } catch (error) {
                console.error('cant update');
                setLoading(false);

            }
        }

    };
    // Function to handle input changes
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };


    return (
        <div>


            <div className={style.allServiceContainer}>
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control mb-3"
                />
                {loading ? <div className="d-flex justify-content-center align-items-center w-100">
                    <CommonLoader />
                </div> :

                    <table className="table caption-top">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Service name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredServiceList.length > 0 ? (
                                filteredServiceList.map((value, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{value}</td>
                                        <td>
                                            <div className="btn-group dropstart">
                                                <button className='btn btn-transparent border-0' data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-three-dots-vertical"></i></button>
                                                <ul className="dropdown-menu">
                                                    <li onClick={() => handleDelete(value)}><Link><small className="dropdown-item text-danger"><i className="bi bi-trash me-2"></i>Delete</small></Link></li>
                                                    <li onClick={() => setUpdateTerm(value)}><Link><small className="dropdown-item text-success" data-bs-toggle="modal" data-bs-target="#editBox"><i className="bi bi-pencil me-2"></i>Edit</small></Link></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
            </div>
            <div class="modal fade" id="editBox" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog  modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit service</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    name=""
                                    id="updateTerm"
                                    aria-describedby="helpId"
                                    placeholder=""
                                    value={inputValue} // Bind the input's value to the state
                                    onChange={handleInputChange} // Update the state when the input changes
                                />
                                <small id="helpId" class="form-text text-danger">{errText}</small>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" disabled={inputValue === ''}  data-bs-dismiss="modal" class="btn btn-primary" onClick={() => handleUpdate(updateTerm, inputValue)}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AllServices;

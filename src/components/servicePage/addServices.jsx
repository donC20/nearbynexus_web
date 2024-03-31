import React, { useEffect, useState } from 'react';
import style from '../../css/services.module.css';
import { updateDocsData } from '../Apifunction';
import { arrayUnion } from 'firebase/firestore';
import CommonLoader from '../commonLoader';

const AddServices = () => {
    const [serviceName, setServiceName] = useState('');
    const [stagedServices, setStagedServices] = useState([]);
    const [isServiceNameValid, setIsServiceNameValid] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);

    const validateServiceName = () => {
        if (serviceName.length < 5) {
            setIsServiceNameValid(false);
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(serviceName)) {
            setIsServiceNameValid(false);
            return;
        }

        setIsServiceNameValid(true);
    };

    const addService = () => {
        if (isServiceNameValid) {
            setStagedServices([...stagedServices, serviceName]);
            setServiceName('');
            setIsServiceNameValid(false);
        }
    };

    const removeService = (index) => {
        if (window.confirm('Are you sure you want to remove this service?')) {
            setStagedServices(stagedServices.filter((_, i) => i !== index));
        }
    };


    const handleUpdateService = async () => {
        console.log('update presed');
        setSubmitLoader(true);
        try {
            await updateDocsData('service_list', 'services', { service: arrayUnion(...stagedServices) });
            setSubmitLoader(false);
            setStagedServices([])
        } catch (error) {
            console.error('Error updating service:', error);
            setSubmitLoader(false); // Ensure loading state is updated in case of error
        }
    };


    return (
        <div>
            <small className='text-secondary'>You can add new services from here,</small>
            <div className='d-flex justify-content-start flex-column w-100'>
                <div className="mb-3 mt-3">
                    <label htmlFor="serviceNameInput" className="form-label"><small>Service name</small></label>
                    <div className={style.inputArea}>
                        <input
                            type="text"
                            className="form-control shadow-none w-100"
                            name="serviceName"
                            id="serviceNameInput"
                            aria-describedby="helpId"
                            placeholder=""
                            value={serviceName}
                            onChange={(e) => {
                                setServiceName(e.target.value);
                                validateServiceName();
                            }}
                        />
                        {isServiceNameValid && (
                            <button id='add_service_btn' className='btn btn-transparent me-2' onClick={addService}><i className="bi bi-plus-circle-fill"></i></button>
                        )}
                    </div>
                    {!isServiceNameValid ?
                        <small id="helpId" className="form-text text-danger">Please enter a valid service name!</small>
                        : <></>}
                </div>
                <div className={style.stagedServices}>
                    <div className="d-flex flex-wrap gap-2">
                        {stagedServices.map((service, index) => (
                            <div key={index} className={style.seviceItem}>
                                <i className="bi bi-x-circle-fill me-1" onClick={() => removeService(index)}></i>
                                {service}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ul className="list-group">
                        <li className="list-group-item d-flex align-items-center">
                            <small><i className="bi bi-check-circle-fill me-2"></i>Must be at least 5 characters long.</small>
                        </li>
                        <li className="list-group-item d-flex align-items-center">
                            <small><i className="bi bi-check-circle-fill me-2"></i>Must only contain letters and spaces.</small>
                        </li>
                    </ul>
                </div>
                <div className="d-flex justify-content-end">
                    {submitLoader ? <button className='btn btn-primary'>Please wait..</button> :
                        <button id='publish_btn' disabled={stagedServices.length <= 0} className='btn btn-primary' onClick={handleUpdateService}>
                            <i className="bi bi-check-circle-fill me-2"></i>Publish
                        </button>
                    }

                </div>
            </div>
        </div >
    );
};

export default AddServices;

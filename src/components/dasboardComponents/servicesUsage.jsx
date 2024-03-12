import React, { useEffect, useState } from 'react';
import style from '../../css/dashboard.module.css';
import {convertToSentenceCase, getAllDataOnCondition } from '../Apifunction';

const ServicesUsage = () => {
    const [serviceCounts, setServiceCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getAllDataOnCondition('users', [
            { field: 'userType', operator: '==', value: 'vendor' },
            { field: 'status', operator: '==', value: 'active' }
        ], (data) => {
            // Flatten the array of services into a single array
            const allServices = data.reduce((acc, user) => [...acc, ...user.services], []);

            // Count occurrences of each service
            const counts = allServices.reduce((counts, service) => {
                counts[service] = (counts[service] || 0) + 1;
                return counts;
            }, {});

            setServiceCounts(counts);
        });
    }, []);

    const filteredServices = Object.entries(serviceCounts).filter(([service]) =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`col p-4 rounded bg-white shadow`}>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className=''>Service usage</h5>
                <input
                    type="text"
                    className="form-control w-50 shadow-none"
                    placeholder="Search by service"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <small className='text-secondary'>Details on the popularity of services.</small>
            <br />
            <div className={style.serviceUsageCard}>

                <table className={`table ${style.serviceMetricTable}`}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Service</th>
                            <th scope="col">Service providers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map(([service, count], index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{convertToSentenceCase(service)}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <small>{count}</small>
                                        <progress className={style.progressBar} value={count} max={10}></progress>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServicesUsage;

import React, { useEffect, useState } from 'react';
import { fetchDocData, formatDate, getAllDataOnCondition } from '../Apifunction';
import style from '../../css/proposals.module.css';
import CommonLoader from '../commonLoader';

const AllProposals = (props) => {
    const [jobData, setJobData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                getAllDataOnCondition('applications', [{ field: 'jobId', operator: '==', value: props.jobId }], async (applications) => {
                    const promises = applications.map(app => fetchDocData('users', app.applicant_id));
                    const users = await Promise.all(promises);
                    // Combine application data with user data
                    const combinedData = applications.map((app, index) => ({
                        ...app,
                        user: users[index]
                    }));
                    setJobData(combinedData);
                    setLoading(false); // Move setLoading inside the callback to ensure it's called after data processing
                });
            } catch (error) {
                console.error('Error fetching job data:', error);
                setLoading(false); // Ensure loading state is updated in case of error
            }
        };

        fetchData();
    }, [props.jobId]);


    return (
        <div className={`bg-white mt-4 p-3 rounded row ${style.proposalListContainer}`}>
            {loading ? (
                <div className='d-flex justify-content-center'>
                    <CommonLoader />
                </div>
            ) : (
                <div>
                    <h5>Applications</h5>
                    <br />
                    <div className="accordion accordion-flush row" id="accordionFlushExample">
                        {jobData.length > 0 ? (
                            jobData.map((value, index) => (
                                <div key={index} className="col-lg-4 rounded pt-1">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls="flush-collapseOne">
                                                <div className="d-flex">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img className='rounded-circle border' src={value.user && value.user.image} alt="err" />
                                                        <div className="d-flex flex-column">
                                                            <small><b>{value.user && value.user.name}</b></small>
                                                            <small className='text-secondary'>{formatDate(value.applicationPostedTime)}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </h2>
                                        <div id={`flush-collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">{value.proposal_description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No data</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProposals;

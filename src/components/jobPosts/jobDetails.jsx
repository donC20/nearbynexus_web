import React, { useEffect, useState } from 'react';
import style from '../../css/proposals.module.css';
import { fetchDocData, formatDate, getAllDataOnCondition } from '../Apifunction';
import CommonLoader from '../commonLoader';

const JobDetails = (props) => {
    const [jobData, setJobData] = useState({});
    const [appliedUsers, setAppliedUsers] = useState([]); // Initialize as an array
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDocData('job_posts', props.jobId);
                setJobData(data);

                // Fetch all applications for the given jobId
                getAllDataOnCondition('applications', [{ field: 'jobId', operator: '==', value: props.jobId }], async (applications) => {
                    // Get unique applicant IDs
                    const uniqueApplicantIds = [...new Set(applications.map(app => app.applicant_id))];

                    // For each unique applicant ID, fetch the user data
                    const usersPromises = uniqueApplicantIds.map(applicantId => fetchDocData('users', applicantId));
                    const users = await Promise.all(usersPromises);

                    setAppliedUsers(users); // Store the fetched user data
                    setLoading(false);
                });

            } catch (error) {
                console.error('Error fetching job data:', error);
                setLoading(false); // Ensure loading state is updated in case of error
            }
        };

        fetchData();
    }, [props.jobId]);

    return (
        <div className={style.jobDetailsTable}>
            <div className="row gap-3">
                <div className="col-lg-6 bg-white p-4 rounded">
                    <h6>Job details</h6>
                    <table className="table">
                        <tbody>
                            {loading ? (
                                <div className='d-flex justify-content-center'>
                                    <CommonLoader />
                                </div>
                            ) : (
                                <>
                                    <tr>
                                        <th><small><i className="bi bi-cone me-2"></i>Job title</small></th>
                                        <td className='text-end'><small className='text-secondary'>{jobData.jobTitle}</small></td>
                                    </tr>
                                    <tr>
                                        <th><small><i className="bi bi-bank2 me-2"></i>Proposed Budget</small></th>
                                        <td className='text-end'><small className='text-secondary'><i className="bi bi-currency-rupee"></i>{jobData.budget}</small></td>
                                    </tr>
                                    <tr>
                                        <th><small><i className="bi bi-calendar-week-fill me-2"></i>Posted on</small></th>
                                        <td className='text-end'><small className='text-secondary'>{formatDate(jobData.jobPostDate)}</small></td>
                                    </tr>
                                    <tr>
                                        <th><small><i className="bi bi-hourglass-split me-2"></i>Valid till</small></th>
                                        <td className='text-end'><small className='text-secondary'>{formatDate(jobData.expiryDate)}</small></td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="col-lg-5 bg-white p-4 rounded">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6>Applied Users</h6>
                        <span className='fw-bold'>{appliedUsers.length}</span>
                    </div>
                    {loading ? (
                        <div className='d-flex justify-content-center'>
                            <CommonLoader />
                        </div>
                    ) : (
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#usersList" aria-expanded="false" aria-controls="flush-collapseOne">
                                        <div className={`d-flex align-items-center ${style.accordiaUserContainer}`}>
                                            {appliedUsers.length > 0 ? (
                                                appliedUsers.slice(0, 3).map((value, index) => (
                                                    <div key={index} className={style.accordiaUserTiles} style={{ marginLeft: index * -20 }}>
                                                        <img className='rounded-circle' src={value && value.image} alt="userImg" />
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No applications yet😒</div>
                                            )}
                                            {appliedUsers.length > 3 && (
                                                <small className={`text-dark ${style.overlappingContainer}`}>&nbsp;
                                                    + {appliedUsers.length - 3} more
                                                </small>
                                            )}
                                        </div>


                                    </button>
                                </h2>
                                <div id="usersList" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">
                                        <table className={`table ${style.appliedUserTable}`}>
                                            <tbody>
                                                {appliedUsers.length > 0 ? appliedUsers.map((value, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <img className='rounded-circle' src={value && value.image} alt="userImg" />
                                                                <small><b>
                                                                    {value && value.name}
                                                                </b></small>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : <tr><td>No data found</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default JobDetails;

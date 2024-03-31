import React, { useState, useEffect } from 'react';
import style from '../../css/jobTable.module.css';
import { deleteDocument, fetchDocData, formatDate, getAllDataOnCondition, isExpired, updateDocsData } from '../Apifunction';
import CommonLoader from '../commonLoader';
import { Link } from 'react-router-dom';

const JobTable = () => {
    const [job, setJob] = useState([]); // Initialize job as an array
    const [loading, setLoading] = useState(true);
    const [collapseStates, setCollapseStates] = useState({}); // State to track collapse states
    const [jobId, setJobId] = useState(''); // State to track collapse states
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    useEffect(() => {
        setLoading(true);
        getAllDataOnCondition('job_posts', [], async (data) => {
            const newData = await Promise.all(data.map(async (item) => {
                const postedBy = await fetchDocData('users', item.jobPostedBy.id);
                return {
                    postedBy,
                    jobData: item
                };
            }));

            setJob(newData);
            setLoading(false);
        });
    }, []);

    // toggler
    const toggleCollapse = (index) => {
        setCollapseStates(prevStates => ({
            ...prevStates,
            [index]: !prevStates[index]
        }));
    };

    const openConfirmModelModal = (id, action) => {
        setActionType(action);
        setJobId(id);
        setShowModal(true);
    };




    return (
        <div className={style.postTable}>

            <div className='table-responsive'>
                {loading ? <div className='d-flex justify-content-center'>
                    <CommonLoader />
                </div> :
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Post by</th>
                                <th scope="col">Posted on</th>
                                <th scope="col">Status</th>
                                <th scope="col">Description</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>


                        <tbody className={style.accordion}>
                            {job.length > 0 ? job.map((data, index) => (
                                <>
                                    <tr key={index} className={style['accordion-item']}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{data.jobData.jobTitle}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img className='rounded-circle' src={data.postedBy.image} alt="userImg" />
                                                <small><b>
                                                    {data.postedBy.name}
                                                </b></small>
                                            </div>
                                        </td>
                                        <td>{formatDate(data.jobData.jobPostDate)}</td>
                                        <td>
                                            <i className={`bi bi-${!data.jobData.status.isActive ? 'ban' :  isExpired(data.jobData.expiryDate) ? 'hourglass' : data.jobData.isWithdrawn ? 'x-octagon' : 'check-lg'} me-2`}></i>

                                            {!data.jobData.status.isActive ? 'Disabled' : isExpired(data.jobData.expiryDate) ? 'Expired' : data.jobData.isWithdrawn ? 'Withdrawn' : 'Active'}</td>
                                        <td>
                                            <button className={`btn btn-transparent border-0 ${style['accordion-button']}`} data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`} onClick={() => toggleCollapse(index)}>
                                                <i className={`bi ${collapseStates[index] ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                            </button>
                                        </td>
                                        <td>
                                            <div className="btn-group dropstart">
                                                <button className='btn btn-transparent border-0' data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-three-dots"></i></button>
                                                <ul className="dropdown-menu">
                                                    <li data-bs-toggle="modal" data-bs-target="#confirmationbox" onClick={() => openConfirmModelModal(data.jobData.id, 'delete')}><Link><small className="dropdown-item text-danger"><i className="bi bi-eraser me-2"></i>Remove</small></Link></li>
                                                    <li><Link to={`/proposals/${data.jobData.id}`}><small className="dropdown-item text-success" ><i className="bi bi-activity me-2"></i>Proposals</small></Link></li>

                                                    {data.jobData.status.isActive ?
                                                        <li data-bs-toggle="modal" data-bs-target="#confirmationbox" onClick={() => openConfirmModelModal(data.jobData.id, 'disable')}><Link><small className="dropdown-item"><i className="bi bi-hand-thumbs-down me-2"></i>Disable</small></Link></li>
                                                        :
                                                        <li data-bs-toggle="modal" data-bs-target="#confirmationbox" onClick={() => openConfirmModelModal(data.jobData.id, 'active')}><Link><small className="dropdown-item"><i className="bi bi-hand-thumbs-up me-2"></i>Enable</small></Link></li>
                                                    }
                                                    {/* {!data.jobData.warning.isWarned ?
                                                        <li data-bs-toggle="modal" data-bs-target="#confirmationbox" onClick={() => openConfirmModelModal(data.jobData.id, 'warn')}><Link><small className="dropdown-item"><i className="bi bi-exclamation-triangle me-2"></i>Send warning</small></Link></li>
                                                        :
                                                        <li data-bs-toggle="modal" data-bs-target="#confirmationbox" onClick={() => openConfirmModelModal(data.jobData.id, 'unwarn')}><Link><small className="dropdown-item"><i className="bi bi-arrow-repeat me-2"></i>Unwarn</small></Link></li>
                                                    } */}
                                                </ul>

                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="hiddenRow">
                                            <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${index}`} data-bs-parent=".accordion">
                                                <div className="accordion-body" dangerouslySetInnerHTML={{ __html: data.jobData.jobDescription }}>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            )) : <tr><td colSpan="6">No jobs found.</td></tr>}

                        </tbody>

                    </table>
                }
            </div>
            {/* modal for actions confiramtion */}
            <div class="modal fade" id="confirmationbox" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Warning</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <span className='text-danger fw-bold'>Do you wish to proceed?</span>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                            {actionType == "disable" || actionType == "warn" ? <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#reasonModel" data-bs-dismiss="modal">Yes, procced!</button> :

                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => {

                                    switch (actionType) {
                                        case 'delete':
                                            deleteDocument(jobId, 'job_posts');
                                            break;
                                        case 'disable':
                                            updateDocsData(jobId, 'job_posts', {
                                                status: {
                                                    isActive: false,
                                                    reason: "some reason"
                                                }
                                            });
                                            break; // Added break statement
                                        case 'active':
                                            updateDocsData(jobId, 'job_posts', {
                                                status: {
                                                    isActive: true,
                                                    reason: ""
                                                }
                                            });
                                            break; // Added break statement
                                        // case 'warn':
                                        //     updateDocsData(jobId, 'job_posts', {
                                        //         warning: {
                                        //             isWarned: true,
                                        //             reason: ""
                                        //         }
                                        //     });
                                        //     break; // Added break statement
                                        // case 'unwarn':
                                        //     updateDocsData(jobId, 'job_posts', {
                                        //         warning: {
                                        //             isWarned: false,
                                        //             reason: ""
                                        //         }
                                        //     });
                                        //     break; // Added break statement
                                        default:
                                            console.log('something went wrong');
                                            break;
                                    }


                                    setShowModal(false); // Close the modal after action
                                }}>Yes, proceed</button>}
                        </div>
                    </div>
                </div>
            </div>
            {/* reason modal */}
            <div class="modal fade" id="reasonModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Reason for your action?</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <textarea class="form-control" id="reasonText" required></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" data-bs-dismiss="modal" class="btn btn-primary" onClick={() => {

                                switch (actionType) {
                                    case 'disable':
                                        updateDocsData(jobId, 'job_posts', {
                                            status: {
                                                isActive: false,
                                                reason: document.getElementById('reasonText').value
                                            }
                                        });
                                        break; // Added break statement
                                    // case 'warn':
                                    //     updateDocsData(jobId, 'job_posts', {
                                    //         warning: {
                                    //             isWarned: true,
                                    //             reason: document.getElementById('reasonText').value
                                    //         }
                                    //     });
                                    //     break; // Added break statement
                                    default:
                                        console.log('something went wrong');
                                        break;
                                }
                            }}>{actionType == 'disable' ? 'Ban user' : 'Warn user'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default JobTable;

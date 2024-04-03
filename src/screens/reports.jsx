import React, { useEffect, useState } from 'react';
import styles from '../css/report.module.css';
import { fetchDocData, formatDate, getAllDataOnCondition, updateDocsData } from '../components/Apifunction';
import CommonLoader from '../components/commonLoader';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showType, setShowType] = useState('received');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                getAllDataOnCondition('reports', [{ field: 'status', operator: '==', value: showType }], async (data) => {
                    const combinedData = await Promise.all(data.map(async (user) => {
                        const reporter = await fetchDocData('users', user.reportedBy);
                        const reportedAboutUserData = await fetchDocData('users', user.reportedAbout);
                        return {
                            id: user.id,
                            report: user,
                            reporter: reporter,
                            reportedAboutUserData: reportedAboutUserData
                        };
                    }));
                    setReports(combinedData);
                    setLoadingData(false);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoadingData(false);
            }
        };
        fetchAllData();
    }, [showType]);
    const updateField = async (id) => {
        try {
            await updateDocsData(id, 'reports', { status: 'viewed' });
            // Update state to reflect the change in status
            setReports(reports.map(report => report.id === id ? { ...report, report: { ...report.report, status: 'viewed' } } : report));
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="container p-lg-4 p-1">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Reports</h2>
                {showType === 'viewed' ?
                    <button className='btn btn-success' onClick={() => { setShowType('received') }}><i class="bi bi-table me-2"></i>New reports</button>
                    :
                    <button className='btn btn-secondary' onClick={() => { setShowType('viewed') }}><i class="bi bi-table me-2"></i>Report log</button>
                }
            </div>
            <div className="bg-white p-4 shadow rounded row mt-4">
                {loadingData ? (
                    <div className="d-flex justify-content-center">
                        <CommonLoader />
                    </div>
                ) : (
                    reports.length > 0 ? reports.map((singleReport, index) => (
                        <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                            <div className="card text-start h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="card-title d-flex">
                                            <img className={`rounded-circle me-3 ${styles.avatar}`} src="raster/avatar-4.png" alt="Title" />
                                            <div>
                                                <b className={styles.firstName}>{singleReport.reporter.name}</b> reported about <b className={styles.secondName}>{singleReport.reportedAboutUserData.name}</b>
                                            </div>
                                        </span>
                                        <button className="btn btn-transparent border-0" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-three-dots-vertical"></i></button>
                                        <ul className="dropdown-menu">
                                            <li className="dropdown-item" onClick={() => updateField(singleReport.id)}><small><i className="bi bi-check2-all me-2 text-success"></i>Mark as reviewed</small></li>
                                            <li className="dropdown-item"><small><i className="bi bi-binoculars-fill me-2 text-danger"></i>Inspect Romeo</small></li>
                                        </ul>
                                    </div>
                                    <small>{formatDate(singleReport.report.reportedOn)}</small>
                                    <div className="accordion mt-2" id={`accordion${index}`}>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className="accordion-button shadow-none" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                                    <small>View report explanation</small>
                                                </button>
                                            </h2>
                                            <div id={`collapse${index}`} className="accordion-collapse collapse show" aria-labelledby={`heading${index}`} data-bs-parent={`#accordion${index}`}>
                                                <div className="accordion-body">
                                                    <p className="card-text">{singleReport.report.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                        : <div>No Reports yet.</div>)}
            </div>
        </div>
    );
};

export default Reports;

import React, { useEffect, useState } from 'react';
import styles from '../css/report.module.css';
import { fetchDocData, formatDate, getAllData } from '../components/Apifunction';
import CommonLoader from '../components/commonLoader';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await getAllData('reports');
                const combinedData = await Promise.all(response.map(async (user) => {
                    const reporter = await fetchDocData('users', user.reportedBy);
                    const reportedAboutUserData = await fetchDocData('users', user.reportedAbout);
                    return {
                        report: user,
                        reporter: reporter,
                        reportedAboutUserData: reportedAboutUserData
                    };
                }));

                setReports(combinedData);
                setLoadingData(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoadingData(false);
            }
        };
        fetchAllData();
    }, []);


    return (
        <div className="container p-lg-4 p-1">
            <h2>Reports</h2>
            <div className="bg-white p-4 shadow rounded row mt-4">
                {loadingData ? (
                    <div className="d-flex justify-content-center">
                        <CommonLoader />
                    </div>
                ) : (
                    reports.map((singleReport, index) => (
                        <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                            <div className="card text-start h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="card-title d-flex">
                                            <img className={`rounded-circle me-3 ${styles.avatar}`} src="raster/avatar-4.png" alt="Title" />
                                            <div>
                                                <b className={styles.firstName}>{singleReport.reporter['name']}</b> Reported about <b className={styles.secondName}>{singleReport.reportedAboutUserData['name']}</b>
                                            </div>
                                        </span>
                                        <button className="btn btn-transparent border-0" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-three-dots-vertical"></i></button>
                                        <ul className="dropdown-menu">
                                            <li className="dropdown-item"><small><i className="bi bi-check2-all me-2 text-success"></i>Mark as reviewed</small></li>
                                            <li className="dropdown-item"><small><i className="bi bi-binoculars-fill me-2 text-danger"></i>Inspect Romeo</small></li>
                                        </ul>
                                    </div>
                                    <small>{formatDate(singleReport.report['reportedOn'])}</small>
                                    <div class="accordion mt-2" id="accordionExample">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header">
                                                <button class="accordion-button shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    View report explanation
                                                </button>
                                            </h2>
                                            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                <div class="accordion-body">
                                                    <p className="card-text">{singleReport.report['description']}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reports;

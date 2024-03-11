import React from 'react'
import { Link, useParams } from 'react-router-dom';
import style from '../css/proposals.module.css'
import JobDetails from '../components/jobPosts/jobDetails';
import AllProposals from '../components/jobPosts/allProposals';
const Proposals = () => {
    const { id } = useParams();

    return (
        <div className='container p-4'>
            <div className="d-flex flex-column justify-content-start">
                <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                    <Link to={'/jobs_posts'} className={style.backbutton}><i class="bi bi-arrow-left-circle-fill"></i></Link>
                    <h2 className={style.topHeading}>Proposals</h2>
                </div>
                <p className='text-secondary'>Manage proposals for a post.</p>
            </div>
            <JobDetails jobId={id} />
            <AllProposals jobId={id} />

        </div>
    )
}

export default Proposals
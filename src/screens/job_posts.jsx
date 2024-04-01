import React, { useEffect } from 'react'
import style from '../css/jobPosts.module.css'
import JobTile from '../components/jobPosts/JobTile'
import JobTable from '../components/jobPosts/jobTable'
const JobPosts = () => {
    useEffect(() => {
        document.title = 'NearbyNexus | Admin';
        return () => {
          // Reset the document title when the component unmounts
          document.title = 'NearbyNexus';
        };
      }, []);
    return (
        <div><div className="container p-4 rounded">
            <div className="d-flex flex-column justify-content-start">
                <h2 className={style.topHeading}>Manage Job Posts</h2>
                <p className='text-secondary'>Manage & view all job posts</p>
                <div className="container bg-white p-4">
                    <JobTable />
                </div>
            </div>
            <br /></div>
        </div>
    )
}

export default JobPosts
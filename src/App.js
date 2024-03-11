import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar.jsx';
import Dashboard from './screens/dashboard.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/login.jsx';
import { auth } from './firebase.js';
import MainLoading from './components/mainLoading.jsx';
import UserPage from './screens/userPage.jsx';
import JobPosts from './screens/job_posts.jsx';
import Proposals from './screens/proposals.jsx';
import Services from './screens/services.jsx';
import { fetchDocData } from './components/Apifunction.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const notify = () => {
    console.log("About to show toast");
    toast.error("Sorry this login is forebidden!");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const validateUser = async () => {
        if (user) {
          // User is signed in.
          const userData = await fetchDocData('users', user.uid)
          if (userData.userType == 'admin') {
            setLoginStatus(true);
          } else {
            notify()
            setLoginStatus(false);
          }
        } else {
          // No user is signed in.
          setLoginStatus(false);
        }
      }
      validateUser();
      // Set loading to false once the authentication check is completed
      setLoading(false);
    });

    // Cleanup subscription to avoid memory leaks
    return () => unsubscribe();
  }, []); // Empty dependency array ensures effect runs only once on component mount

  // Display loading screen while checking authentication status
  if (isLoading) {
    return (
      <MainLoading />
    );
  }

  return (

    <Router>
      <div>
        <Routes>
          {/* Only render the login route if the user is not logged in */}
          {!isLoggedIn && <Route path="/" element={<Login />} />}
        </Routes>
        {isLoggedIn && (
          <div>
            <Navbar />
            <div className='d-flex flex-lg-row'>
              <div className='left-side'>
                <Sidebar resposiveData='d-none d-lg-block' />
              </div>
              <div className='right-side w-100'>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UserPage />} />
                  <Route path="/jobs_posts" element={<JobPosts />} />
                  <Route path="/proposals/:id" element={<Proposals />} />
                  <Route path="/services" element={<Services />} />
                </Routes>
              </div>
            </div>
          </div>

        )}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;

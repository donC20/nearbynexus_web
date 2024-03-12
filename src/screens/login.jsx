import React, { useState } from 'react';
import style from '../css/login.module.css';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [signInError, setSignInError] = useState(null);
    const [loading, setloading] = useState(false);

    const validateInputs = () => {
        let isValid = true;

        // Email validation
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email address');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Password validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setloading(true)
        if (!isSigningIn && validateInputs()) {
            setIsSigningIn(true);
            try {
                await signInWithEmailAndPassword(auth, email, password);
                setloading(false)
                setIsSigningIn(true);
            } catch (error) {
                setloading(false)
                setIsSigningIn(false);
                
                // Handle sign-in error
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    setSignInError('Invalid email or password');
                } else {
                    setSignInError('An error occurred. Please try again later.');
                }
            }
        }
    };


    const googleSignIn = async () => {
        setloading(true)

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider); // Add await here
            // Handle successful sign-in here
            setloading(false)
            setIsSigningIn(true);


        } catch (error) {
            console.error(error);
            setloading(false)

            setIsSigningIn(false);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setSignInError('Invalid email or password');
            } else {
                setSignInError('An error occurred. Please try again later.');
            }

            // Handle sign-in error here
        }
    };


    return (
        <div className={style.container}>
            <div className={style['forms-container']}>
                <div className={style['signin-signup']}>
                    <form action="#" className={style['sign-in-form']} onSubmit={onSubmit}>
                        <h2 className={style.title}><i className="bi bi-shield-lock-fill me-1"></i>Authorization</h2>
                        <div className={`d-flex flex-column justify-content-start ${style['input-field']}`}>
                            <div>
                                <i className="bi bi-person-fill"></i>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {emailError && <p className={style.error}>{emailError}</p>}
                        </div>
                        <div className={`d-flex flex-column justify-content-start ${style['input-field']}`}>
                            <div>
                                <i className="bi bi-lock-fill"></i>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {passwordError && <p className={style.error}>{passwordError}</p>}
                        </div>
                        {loading ? <div className={`d-flex align-items-center justify-content-center ${style.loader}`}>
                            <div class="spinner-border text-light" role="status">
                            </div>
                        </div> : <input
                            type="submit"
                            value="Login"
                            className={`${style.btn} ${style.solid}`}
                            disabled={isSigningIn}
                        />}

                        {signInError && <p className={style.error}>{signInError}</p>}
                        <p className={style['social-text']}>Or Sign in with Google</p>
                        <div className={style['social-media']} onClick={googleSignIn}>
                            <Link to="#" className={style['social-icon']}>
                                <img src="images/google.png" alt="" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className={style['panels-container']}>
                <div className={style.panel + ' ' + style['left-panel']}>
                    <div className={style.content}>
                        <div className="d-flex align-items-center justify-content-center">
                            <img src="images/logo.png" alt="" />
                            <h1><b>NearbyNexus</b> | Admin</h1>
                        </div>
                        <p className='text-end'>
                            "Efficiency is doing things right; effectiveness is doing the right things." - Peter Drucker
                        </p>
                    </div>
                    <div>
                        <img src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" className={style.image} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

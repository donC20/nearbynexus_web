import React from 'react'
import '../css/style.css'
import AppScreenshotSlider from '../components/appScreenSlider'

const Home = () => {
    return (
        <div>
            {/* Start Header*/}
            <header id="mu-header" className="" role="banner">
                <div className="mu-header-overlay">
                    <div className="container">
                        <div className="mu-header-area">

                            {/* Start Logo*/}
                            <div className="mu-logo-area">
                                {/* text based logo*/}
                                <a className="mu-logo" href="#"><img src="images/logo.png" alt="" />NearbyNexus</a>
                                {/* image based logo*/}
                                {/* <a className="mu-logo" href="#"><img src="assets/images/logo.png" alt="logo img"></a>*/}
                            </div>
                            {/* End Logo*/}

                            {/* Start header featured area*/}
                            <div className="mu-header-featured-area">
                                <div className="mu-header-featured-img">
                                    <img src="assets/images/user dashboard.png" alt="iphone image" />
                                </div>

                                <div className="mu-header-featured-content">
                                    <h1>Welcome To <span>NearbyNexus</span></h1>
                                    <p>Discover NearbyNexus: Your gateway to seamless service access in new locales. Connect effortlessly with trusted providers, from independents to corporations. Say hello to convenience, reliability, and satisfaction. Join the revolution now!</p>

                                    <div className="mu-app-download-area">
                                        <h4>Download The App</h4>
                                        <a className="mu-google-btn" href="#"><i className="fa fa-android"></i><span>Download Now</span></a>
                                        {/* <a className="mu-windows-btn" href="#"><i className="fa fa-windows"></i><span>windows store</span></a>*/}
                                    </div>

                                </div>
                            </div>
                            {/* End header featured area*/}

                        </div>
                    </div>
                </div>
            </header>
            {/* End Header*/}





            {/* Start main content*/}

            <main role="main">

                {/* Start Feature*/}
                <section id="mu-feature">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mu-feature-area">

                                    <div className="mu-title-area">
                                        <h2 className="mu-title">OUR APP FEATURES</h2>
                                        <span className="mu-title-dot"></span>
                                        <p>Explore NearbyNexus' dynamic features designed to effortlessly connect users with nearby service providers, streamlining your service access experience.</p>
                                    </div>

                                    {/* Start Feature Content*/}
                                    <div className="mu-feature-content">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mu-feature-content-left">
                                                    <img className="mu-profile-img" src="assets/images/Group 1splitted.png" alt="iphone Image" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mu-feature-content-right">

                                                    {/* Start single feature item*/}
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <button className="btn mu-feature-btn" type="button">
                                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                        <div className="media-body">
                                                            <h3 className="media-heading"><i className="bi bi-geo-alt me-2"></i>Location-Based Services</h3>
                                                            <p>Effortlessly connect with nearby service providers tailored to your specific geographical location. Find the right assistance exactly where you need it most.</p>
                                                        </div>
                                                    </div>
                                                    {/* End single feature item*/}

                                                    {/* Start single feature item*/}
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <button className="btn mu-feature-btn" type="button">
                                                                <i className="fa fa-comments" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                        <div className="media-body">
                                                            <h3 className="media-heading"><i className="bi bi-chat-text me-2"></i>Direct Communication</h3>
                                                            <p>Engage in direct communication with service providers to discuss your needs or clarify details. Ensure your requirements are understood and met with personalized interaction.</p>
                                                        </div>
                                                    </div>
                                                    {/* End single feature item*/}

                                                    {/* Start single feature item*/}
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <button className="btn mu-feature-btn" type="button">
                                                                <i className="fa fa-search" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                        <div className="media-body">
                                                            <h3 className="media-heading"><i className="bi bi-search me-2"></i>Efficient Search Functionality</h3>
                                                            <p>Easily locate the services you need with our dynamic search feature, tailored to your preferences. Save time and effort by quickly finding the right service providers for your requirements.</p>
                                                        </div>
                                                    </div>
                                                    {/* End single feature item*/}

                                                    {/* Start single feature item*/}
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <button className="btn mu-feature-btn" type="button">
                                                                <i className="fa fa-handshake-o" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                        <div className="media-body">
                                                            <h3 className="media-heading"><i className="bi bi-fingerprint me-2"></i>Secure Connections</h3>
                                                            <p>Rest assured with secure connections between users and service providers, prioritizing your privacy. Conduct transactions and communications with confidence, knowing your information is protected.</p>
                                                        </div>
                                                    </div>
                                                    {/* End single feature item*/}
                                                    {/* Single feature item*/}
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <button className="btn mu-feature-btn" type="button">
                                                                <i className="fa fa-sun-o" aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                        <div className="media-body">
                                                            <h3 className="media-heading"><i className="bi bi-lightbulb me-2"></i>Light & Dark Themes</h3>
                                                            <p>Switch effortlessly between light and dark themes to suit your preference and environment, providing optimal visibility and comfort.</p>
                                                        </div>
                                                    </div>
                                                    {/* End single feature item*/}


                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* End Feature Content*/}

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Feature*/}

                {/* Start Video*/}
                <section id="mu-video">
                    <div className="mu-video-overlay">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mu-video-area">
                                        <div className="downBack">
                                            <h2>Download now!</h2>
                                            <p className='text-light'>Get started today and unlock a world of convenience at your fingertips. Download the app now to experience seamless service connections like never before.</p>

                                            <a className="mu-google-btn mt-2" href="#"><i className="fa fa-android"></i><span>Download Now</span></a>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Video content*/}
                    <div className="mu-video-content">
                        <div className="mu-video-iframe-area">
                            <a className="mu-video-close-btn" href="#"><i className="fa fa-times" aria-hidden="true"></i></a>
                            <iframe className="mu-video-iframe" width="854" height="480" src="https://www.youtube.com/embed/9r40_ffCZ_I" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                    {/* End Video content*/}

                </section>
                {/* End Video*/}

                {/* Start Apps Screenshot*/}
                   <AppScreenshotSlider/>
                {/* End Apps Screenshot*/}

                

                {/* Start FAQ*/}
                <section id="mu-faq">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mu-faq-area">

                                    <div className="mu-title-area">
                                        <h2 className="mu-title">SAFE, SECURE & FAST</h2>
                                        <span className="mu-title-dot"></span>
                                        <p>Introducing our cutting-edge app, designed to provide you with unparalleled safety, security, and speed. Experience peace of mind knowing your data is protected while enjoying lightning-fast performance.</p>
                                    </div>
                                    <div className="single-screeshot">
                                        <img src="assets/images/screenshot/phoneHalf.png" alt="App screenshot img" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End FAQ*/}



            </main>

            {/* End main content*/}


            {/* Start footer*/}
            <footer id="mu-footer" role="contentinfo">
                <div className="container">
                    <div className="mu-footer-area">
                        <p className="mu-copy-right">&copy; Copyright <a rel="nofollow" href="http://nearbynexus.live">NearbyNexus</a>. All right reserved.</p>
                    </div>
                </div>

            </footer>
            {/* End footer*/}
        </div>
    )
}

export default Home
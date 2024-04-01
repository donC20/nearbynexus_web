import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/style.css";

const AppScreenshotSlider = () => {
    return (
        <section id="mu-apps-screenshot">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="mu-apps-screenshot-area">
                            <div className="mu-title-area">
                                <h2 className="mu-title">APPS SCREENSHOT</h2>
                                <span className="mu-title-dot"></span>
                                <p>Experience the essence of our app's sleek design and cutting-edge capabilities encapsulated in these vibrant screenshots, capturing its dynamic interface and user-friendly navigation.</p>
                            </div>
                            <div className="mu-apps-screenshot-content d-flex justify-content-center">
                                <Carousel autoPlay interval={3000} infiniteLoop dynamicHeight={true} showThumbs={false} verticalSwipe="natural" autoFocus={true} showArrows={true} showStatus={false} >
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/job feed.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/job description screen.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/post job.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/map view.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/manage posts.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/descriptn add.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/chat screen.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/lightmode.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/darkmode.png" alt="App screenshot img" />
                                    </div>
                                    <div className="mu-single-screeshot">
                                        <img src="assets/images/screenshot/search user.png" alt="App screenshot img" />
                                    </div>
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppScreenshotSlider;

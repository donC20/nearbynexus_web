import React, { useEffect, useState } from 'react';
import style from '../css/services.module.css';
import AddServices from '../components/servicePage/addServices';
import AllServices from '../components/servicePage/allServices';

const Services = () => {
    const [screen, setScreen] = useState('addService');
    useEffect(() => {
        document.title = 'NearbyNexus | Admin';
        return () => {
          // Reset the document title when the component unmounts
          document.title = 'NearbyNexus';
        };
      }, []);
    return (
        <div className={`container p-3 rounded ${style.servicesMain}`}>
           
           
            <div className="bg-white rounded p-4">
                <div className="d-flex flex-column justify-content-start">

                    <div className={style.tabs}>
                        <input
                            type="radio"
                            id="radio-1"
                            name="tabs"
                            onClick={() => setScreen('addService')}
                            checked={screen === 'addService'}
                        />
                        <label className={style.tab} htmlFor="radio-1"><i className="bi bi-plus-circle-fill me-2"></i>Add services</label>
                        <input
                            type="radio"
                            id="radio-2"
                            name="tabs"
                            onClick={() => setScreen('services')}
                            checked={screen === 'services'}
                        />
                        <label className={style.tab} htmlFor="radio-2"><i className="bi bi-gear-fill me-2"></i>Services</label>
                        <span className={style.glider}></span>
                    </div>
                </div>
                <br />
                <div className={` ${style.serviceTabChild} ${screen === 'addService' ? 'd-block' : 'd-none'}`}>
                    <AddServices />
                </div>
                <div className={`${style.serviceTabChild} ${screen === 'services' ? 'd-block' : 'd-none'}`}>
                    <AllServices />
                </div>
            </div>


        </div>
    );
};

export default Services;

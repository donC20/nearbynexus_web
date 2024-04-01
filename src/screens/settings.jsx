import React, { useEffect } from 'react'
import style from '../css/settings.module.css'
const Settings = () => {
    useEffect(() => {
        document.title = 'NearbyNexus | Admin';
        return () => {
          // Reset the document title when the component unmounts
          document.title = 'NearbyNexus';
        };
      }, []);
    return (
        <div className='container p-4'>
            <h2 className={style.topHeading}>Settings</h2>
            <p className='text-secondary'></p>
            <small className='text-secondary '>Manage the basic control of the application.</small>
            <div className="container bg-white shadow p-4 mt-3 rounded">
                <h6><i className="bi bi-app-indicator"></i> Notifications</h6>
                <hr />
                <div
                    className={`table-responsive ${style.settingsTable}`}
                >
                    <table
                        class="table"
                    >
                        <tbody>
                            <tr class="">
                                <th scope="row"><small>Alert me when new users joins.</small></th>
                                <td className='d-flex justify-content-end'><div className={style['checkbox-apple']}>
                                    <input className="yep" id="check-apple" type="checkbox" />
                                    <label for="check-apple"></label>
                                </div></td>
                            </tr>
                            <tr class="">
                                <th scope="row"><small>Alert me when new jobs added.</small></th>
                                <td className='d-flex justify-content-end'><div className={style['checkbox-apple']}>
                                    <input className="yep" id="check-apple" type="checkbox" />
                                    <label for="check-apple"></label>
                                </div></td>
                            </tr>
                            <tr class="">
                                <th scope="row"><small>Alert me on new reports.</small></th>
                                <td className='d-flex justify-content-end'><div className={style['checkbox-apple']}>
                                    <input className="yep" id="check-apple" type="checkbox" />
                                    <label for="check-apple"></label>
                                </div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Settings
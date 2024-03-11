import React from 'react'
import style from '../css/commonLoader.module.css'
const CommonLoader = () => {
    return (
        <div className={style.commonLoader}>
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}

export default CommonLoader
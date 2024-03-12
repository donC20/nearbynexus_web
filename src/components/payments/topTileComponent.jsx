import React from 'react'
import style from '../../css/payments.module.css'
const TopTileComponent = (props) => {
    return (
        <div className="bg-white p-3 rounded d-flex gap-3 shadow-sm">
            <div className={style.preIconBack}>
                <img className={style.preIcon} src={props.icon} alt="" />
            </div>
            <div className='d-flex flex-column'>
                <span className='fw-bold'>{props.title}</span>
                {props.value == 0 ? (
                    <div class="spinner-border spinner-border-sm" role="status">
                    </div>
                ) : (
                    <small className='fw-bold text-primary'>
                        <i className="bi bi-currency-rupee"></i>
                        {props.value}
                    </small>
                )}

            </div>
        </div>
    );
}

export default TopTileComponent
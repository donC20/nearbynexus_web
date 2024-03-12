import React, { useState } from 'react'
import style from '../css/payments.module.css'
import PaymentLogTable from '../components/payments/paymentLogTable'
const Payments = () => {
    const [totalTransactions, settotalTransactions] = useState(0);
    const handlePassedData = (totalAmount, tableLoading) => {
        settotalTransactions(totalAmount)
    }
    return (
        <div className='container p-lg-4 p-1'>
            <h2 className={style.topHeading}>Payments</h2>
            <p className='text-secondary'></p>
            <div className="d-flex flex-wrap">
                <div className="bg-white p-3 rounded d-flex gap-3 shadow-sm">
                    <div className={style.preIconBack}>
                        <img className={style.preIcon} src="svg/coin-svgrepo-com.svg" alt="" />
                    </div>
                    <div className='d-flex flex-column'>
                        <span className='fw-bold'>Total transactions</span>
                        {totalTransactions == 0 ? (
                            <div class="spinner-border spinner-border-sm" role="status">
                            </div>
                        ) : (
                            <small className='fw-bold text-primary'>
                                <i className="bi bi-currency-rupee"></i>
                                {totalTransactions}
                            </small>
                        )}


                    </div>
                </div>
            </div>
            <br />
            <PaymentLogTable fnData={handlePassedData} />
        </div>
    )
}

export default Payments
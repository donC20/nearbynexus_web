import React, { useEffect, useState } from 'react'
import style from '../css/payments.module.css'
import PaymentLogTable from '../components/payments/paymentLogTable'
import TopTileComponent from '../components/payments/topTileComponent';
const Payments = () => {
    const [totalTransactions, settotalTransactions] = useState(0);
    const [totalCommission, settotalCommission] = useState(0);
    useEffect(() => {
        document.title = 'NearbyNexus | Admin';
        return () => {
          // Reset the document title when the component unmounts
          document.title = 'NearbyNexus';
        };
      }, []);
    const handlePassedData = (totalAmount, totalCommission) => {
        settotalTransactions(totalAmount)
        settotalCommission(totalCommission)
    }
    return (
        <div className='container p-lg-4 p-1'>
            <h2 className={style.topHeading}>Payments</h2>
            <p className='text-secondary'></p>
            <div className="d-flex flex-wrap gap-3">
                <TopTileComponent icon='svg/coin-svgrepo-com.svg' title='Total transactions' value={totalTransactions} />
                <TopTileComponent icon='svg/chart-mixed-svgrepo-com.svg' title='Total Revenue' value={totalCommission} />

            </div>
            <br />
            <PaymentLogTable fnData={handlePassedData} />
        </div>
    )
}




export default Payments
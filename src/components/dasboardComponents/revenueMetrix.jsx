import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import style from '../../css/dashboard.module.css';
import { formatDate, getAllDataOnCondition } from '../Apifunction';
import CommonLoader from '../commonLoader';

const RevenueMatrix = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [convertedData, setConvertedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
            const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0);
            setLoading(true);
            try {
                getAllDataOnCondition('payments', [
                    { field: 'paymentTime', operator: '>=', value: firstDayOfMonth },
                    { field: 'paymentTime', operator: '<=', value: lastDayOfMonth }
                ], (data) => {
                    // Convert Firebase Timestamps to Date objects and format data
                    const newData = data.map(item => ({
                        name: formatDate(item.paymentTime), // Convert Firebase Timestamp to formatted date string
                        revenue: parseInt(item.applicationRevenue) // Convert commission to integer
                    }));
                    var totalAmount = 0;

                    data.forEach((value, index) => {
                        // Check if the value of 'commission' is a valid number
                        if (!isNaN(value['applicationRevenue'])) {
                            // If it's a valid number, parse and add it to the total
                            totalAmount = totalAmount + parseFloat(value['applicationRevenue']);
                        }
                    });

                    setTotalRevenue(totalAmount);
                    setConvertedData(newData);
                    setLoading(false);
                });

            } catch (error) {
                console.error('Error fetching data:', error);
                setConvertedData([]); // Reset data if there's an error
            }
        };

        fetchData();
    }, [selectedMonth, selectedYear]);



    return (
        <div className="col p-4 rounded bg-white">
            <div className={`d-flex justify-content-between align-items-center ${style.amountValue}`}>
                <div className="title d-flex flex-column">
                    <h5>Revenue</h5>
                    <div className='d-flex gap-2'>
                        <select name="month" id={style.monthSelector} value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                                <option key={month} value={month}>{new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select name="year" id={style.yearSelector} value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                            {Array.from({ length: new Date().getFullYear() - 2021 }, (_, index) => 2022 + index).map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <span><i className="bi bi-currency-rupee"></i>{totalRevenue}</span>
                </div>
            </div>
            <br />
            {loading ? <div className='d-flex justify-content-center align-items-center h-25'>
                <CommonLoader />
            </div> :
                convertedData.length === 0 ?
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <b>No revenue generated so far!</b>
                    </div> :
                    <ResponsiveContainer width="100%" className={style.revenueMetrixChart}>
                        <AreaChart data={convertedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" strokeWidth={3} stroke="#5046e5" fill="#EDECFC" />
                        </AreaChart>
                    </ResponsiveContainer>
            }
        </div>
    );
};

export default RevenueMatrix;

import React, { useEffect, useState } from 'react';
import style from '../../css/payments.module.css';
import { fetchDocData, formatDate, getAllDataOnCondition } from '../Apifunction';
import CommonLoader from '../commonLoader';
import { Link } from 'react-router-dom';

const PaymentLogTable = ({ fnData }) => {
    const [paymentData, setPaymentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null); // Changed to null for initial state

    useEffect(() => {
        const fetchNow = async () => {
            try {
                setLoading(true);
                getAllDataOnCondition('payments', [], async (data) => {
                    const newData = await Promise.all(data.map(async (item) => {
                        if (item.payedBy && item.payedBy.id) {
                            const payedBy = await fetchDocData('users', item.payedBy.id);
                            const payedTo = await fetchDocData('users', item.payedTo.id);
                            return {
                                payedBy,
                                payedTo,
                                paymentData: item
                            };
                        }
                        return null; // Return null if condition is not met
                    }));
                    // Filter out null values
                    const filteredData = newData.filter(item => item !== null);
                    // Calculate total amount paid
                    let totalCount = 0;
                    filteredData.forEach(value => {
                        totalCount += parseInt(value.paymentData.amountPaid);
                    });
                    setPaymentData(filteredData);
                    setLoading(false);
                    fnData(totalCount); // Call fnData with the total amount
                });
            } catch (error) {
                console.error('Error fetching payment data:', error);
                setLoading(false); // Ensure loading state is set to false in case of error
            }
        };
        fetchNow();
    }, []);

    return (
        <div className={style.paymentsTable}>
            <div className="bg-white rounded p-3 shadow-sm">
                {loading ? (
                    <div className='d-flex justify-content-center'>
                        <CommonLoader />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Payed by</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentData.length > 0 ? paymentData.map((data, index) => (
                                    <tr key={index}>
                                        <td scope="row">{index + 1}</td>
                                        <td>{data.payedBy.name}</td> {/* Assuming payedBy has a name property */}
                                        <td><i className="bi bi-currency-rupee"></i>{data.paymentData.amountPaid}</td> {/* Assuming paymentData has an amount property */}
                                        <td><i className="bi bi-info-circle" data-bs-toggle="modal" data-bs-target="#modelForPayInfo" onClick={() => setModalData(data)}></i></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4">No data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Modal moved outside the table */}
            <div className="modal fade" id="modelForPayInfo" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className={style.moreInfoTable}>
                                <div className="table-responsive w-100">
                                    <table className="table">
                                        <tbody>
                                            {/* Modal content */}
                                            <tr>
                                                <th scope="row">Amount</th>
                                                <td className='text-end'><small><i className="bi bi-currency-rupee"></i>{modalData && modalData.paymentData.amountPaid}</small></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Payed by</th>
                                                <td className='text-end'><small>{modalData && modalData.payedBy.name}</small></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Payed to</th>
                                                <td className='text-end'><small>{modalData && modalData.payedTo.name}</small></td>

                                            </tr>
                                            <tr>
                                                <th scope="row">Payed on</th>
                                                <td className='text-end'><small>{modalData && formatDate(modalData.paymentData.paymentTime)}</small></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Payed for</th>
                                                <td className='text-end'><small>{modalData && modalData.paymentData.payedFor}</small></td>
                                                {/* <td className='text-end'><Link to={`/proposals/${modalData && modalData.paymentData.jobId.id}`}><small>View job</small></Link></td> */}
                                            </tr>
                                            <tr>
                                                <th scope="row">Commission</th>
                                                <td className='text-end'><small>+ <i className="bi bi-currency-rupee"></i>{modalData && modalData.paymentData.commission}</small></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Transaction id</th>
                                                <td className='text-end'><small>{modalData && modalData.paymentData.id}</small></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentLogTable;

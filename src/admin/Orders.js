import React, { useEffect, useState } from 'react'
import {isAuthenticated} from '../auth'
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin'
import Layout from '../core/Layout'
import moment from 'moment'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [statusVAlues, setStatusValues] = useState([])
    
    const { user, token } = isAuthenticated()



    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setOrders(data)
            }
        })
    }
    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setStatusValues(data)
            }
        })
    }

    useEffect(() => {
        loadOrders()
        loadStatusValues()
    }, [])

    const noOrders = () => (
        orders.length < 1 ? <h4>No orders</h4> : null
    )

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h2 className="text-danger display-4">Total Orders: {orders.length}</h2>
            )
        } else {
            return;
        }
    }

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group prepend">
                <div className="input-group-text">
                    {key}
                </div>            
                <input type="text" value={value} className="form-control" readOnly />
            </div>
        </div>
    )

    const handleStatusChenage = (e, orderId) => {
        updateOrderStatus(user._id, token, orderId, e.target.value)
            .then(data => {
                if (data.error) {
                    console.log('Status update failed')
                } else {
                    loadOrders()
                }
            })
    }

    const showStatus = (o) => (
        <div className="form-group">
            <h4 className="mark mb-4">Status: {o.status}</h4>
            <select className="form-control" onChange={(e) => handleStatusChenage(e, o._id)}>
                <option hidden>Update Status</option>
                {statusVAlues.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                ))}
            </select>
        </div>
    )

    return (
        <Layout title="Orders" description="Manage all orders" className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {noOrders()}
                    {showOrdersLength()}
                    {orders.map((o, i) => (
                        <div className="mt-5" key={i} style={{borderBottom: "4px solid indigo"}}>
                            <h4 className="mb-5">
                                <span className="bg-primary">Order Id: {o._id}</span>
                            </h4>
                            <ul className="list-group mb-2">
                                <li className="list-group-item">{showStatus(o)}</li>
                                <li className="list-group-item">Transaction ID: {o.transaction_id}</li>
                                <li className="list-group-item">Amount: {o.amount}</li>
                                <li className="list-group-item">Order By: {o.user.name}</li>
                                <li className="list-group-item">Ordered On: {moment(o.createdAt).fromNow()}</li>
                                <li className="list-group-item">Delivery address: {o.address}</li>
                            </ul>

                            <h4 className="my-4 font-italic">
                                Total products in the order: {o.products.length}
                            </h4>
                            {o.products.map((p, pIndex) => (
                                <div className="mb-4" key={pIndex} style={{ padding: '20px', border: '1px solid indigo' }}>
                                    {showInput('Product Name', p.name)}
                                    {showInput('Product Price', p.price)}
                                    {showInput('Product Total', p.count)}
                                    {showInput('Product ID', p._id)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Orders

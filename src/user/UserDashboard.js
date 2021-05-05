import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import { Link } from 'react-router-dom'
import { getPurchaseHistory } from './apiUser'

const UserDashboard = () => {
    const [history, setHistory] = useState([])
    const { user: { _id, name, email, role }, token } = isAuthenticated()


    const init = (userId, token) => {
        getPurchaseHistory(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setHistory([data])
                }
            })
    }

    useEffect(() => {
        init(_id, token)
    }, [])


    return (
        <Layout title="User Dashboard" description="User Dashboard" className="container">
            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-5">
                        <h3 className="card-header">
                            User Links
                        </h3>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <Link to="/create/category">My Cart</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to={`/profile/${_id}`}>Update Profile</Link>
                            </li>
                            
                        </ul>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <h3 className="card-header">
                            User Information
                        </h3>                        
                        <ul className="list-group">
                            <li className="list-group-item">{name}</li>
                            <li className="list-group-item">{email}</li>
                            <li className="list-group-item">{role === 1 ? 'Admin' : 'Registrated User'}</li>
                        </ul>
                    </div>
                    <div className="card mt-3">
                        <h3 className="card-header">Purchase history</h3>
                            {history && history.map((h, i) => {
                                return (
                                    <div key={i}>
                                        {h.map((p, i) => {
                                            return (
                                                <div key={i}>
                                                    {p.products.map((p, i) => (
                                                    <li className="list-group-item" key={i}>
                                                        <h6>Product name: {p.name}</h6>
                                                        <h6>Product price: {p.price}</h6>
                                                        <h6>Purchase date: {moment(p.createdAt).fromNow()}</h6>
                                                    </li>
                                                    ))}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UserDashboard

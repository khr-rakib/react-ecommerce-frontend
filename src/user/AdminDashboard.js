import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import Layout from '../core/Layout'

const AdminDashboard = () => {
    const { user: {name, email, role} } = isAuthenticated()

    return (
        <Layout title="Admin Dashboard" description="Welcome to admin dashboard" className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-5">
                        <h3 className="card-header">
                            Admin Links
                        </h3>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <Link to="/create/category">Create Category</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to="/create/product">Create Product</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to="/admin/orders">Orders</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to="/admin/products">Manage Products</Link>
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
                </div>
            </div>
            
            
        </Layout>
    )
}

export default AdminDashboard

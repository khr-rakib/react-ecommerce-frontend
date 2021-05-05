import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import Layout from '../core/Layout'
import { deleteProduct, getProducts } from './apiAdmin'

const ManageProducts = () => {
    const [products, setProducts] = useState([])

    const {user, token} = isAuthenticated()

    const loadProducts = () => {
        getProducts()
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setProducts(data)
                }
            })
    }

    const destroy = productId => {
        deleteProduct(productId, user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    loadProducts()
                    alert('deleted')
                }
            })
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <Layout title="Mange Products" description="Perform CRUD on product" className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center">Total products: {products.length}</h2>
                    <hr/>
                    <ul className="list-group">
                        {products.map((p, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong>{p.name}</strong>
                                <div>
                                    <Link to={`/admin/product/update/${p._id}`}>
                                        <span className="badge badge-warning badge-pill">Update</span>
                                    </Link>
                                    <span className="badge badge-danger badge-pill" onClick={() => destroy(p._id)}>Delete</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default ManageProducts

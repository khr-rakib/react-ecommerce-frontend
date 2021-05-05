import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../auth'
import Layout from '../core/Layout'
import { createProduct, getCategories } from './apiAdmin'

const AddProduct = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    const { name, description, price, categories, quantity, error, createdProduct, formData } = values
    const { user, token } = isAuthenticated()

    // load categories and set form data
    const init = () => {
        getCategories()
            .then(data => {
                if (data.error) {
                    setValues({...values, error: data.error})
                } else {
                    setValues({...values, categories: data, formData: new FormData()})
                }
            })
    }

    useEffect(() => {
        init();
    }, [])

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name, value)
        setValues({ ...values, [name]: value, error: '' })
    }

    const clickSubmit = e => {
        e.preventDefault()
        setValues({ ...values, error: '', loading: true })
        
        createProduct(user._id, token, formData)
            .then(data => {
                if (data.error || data.error === '') {
                    setValues({...values, error: true})
                } else {
                    setValues({...values, name: '', description: '', photo: '', price: '', quantity: '', loading: false, createdProduct: data.name, })
                }
            })
    }
    
    const newPostForm = () => {
        return (
            <form className="mb-3" onSubmit={clickSubmit}>
                <h4>Post Photo</h4>
                <div className="form-group">
                    <label className="btn btn-secondary">
                        <input onChange={handleChange('photo')} type="file" accept="image/*"  />
                    </label>
                </div>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" value={name} className="form-control" onChange={handleChange('name')} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Description</label>
                    <textarea value={description} className="form-control" onChange={handleChange('description')}></textarea>
                </div>
                <div className="form-group">
                    <label className="text-muted">Price</label>
                    <input type="number" value={price} className="form-control" onChange={handleChange('price')} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Category</label>
                    <select className="form-control" onChange={handleChange('category')}>
                        <option hidden>Please select one</option>
                        
                        {categories && categories.map( (c, i) => (<option key={i} value={c._id}>{c.name}</option>))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="text-muted">Quantity</label>
                    <input type="number" value={quantity} className="form-control" onChange={handleChange('quantity')} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Shipping</label>
                    <select className="form-control" onChange={handleChange('shipping')}>
                        <option hidden>Please select one</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
                <button className="btn btn-info">Create Product</button>
            </form>
        )
    }

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>All fields are required</div>
    )
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>Product create successfully</div>
    )

    return (
        <Layout title="Add a new Product" description={`G'day ${user.name}, ready to add a new product?`} className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showError()}
                    {showSuccess()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    )
}

export default AddProduct

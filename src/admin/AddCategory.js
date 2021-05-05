import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import Layout from '../core/Layout'
import { createCategory } from './apiAdmin'

const AddCategory = () => {
    const [name, setName] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const { user, token } = isAuthenticated()

    const clickSubmit = e => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        createCategory(user._id, token, {name})
            .then(data => {
                if (data && data.error) {
                    return setError(data.error)
                } else {
                    setError('')
                    setSuccess(true)
                }
            })

    }

    const newCategoryForm = () => {
        return (
            <form onSubmit={clickSubmit}>
                <div className="form-group">
                    <label htmlFor="" className="text-muted">Name</label>
                    <input type="text" onChange={e => { setName(e.target.value); setError('');}} className="form-control" value={name} />
                </div>
                <button className="btn btn-info">Create Category</button>
            </form>
        )
    }

    const showSuccess = () => {
        if (success) {
            return <h3 className="text-success">{name} is created</h3>
        }
    }

    const showError = () => {
        if (error) {
            return <h3 className="text-success">{name} is should be unique</h3>
        }
    }

     const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to Dashboard
            </Link>
        </div>
    );
    
    return (
        <Layout title="Add a new category" description={`G'day ${user.name}, ready to add a new category?`} className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showError()}
                    {showSuccess()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>            
        </Layout>
    )
}

export default AddCategory

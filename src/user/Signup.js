import React, { useState } from 'react'
import Layout from '../core/Layout'
import { Link } from 'react-router-dom';
import { signup } from '../auth';

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })
    
    const { name, email, password, error, success } = values

    const handleChange = name => e => {
        setValues({...values, error: false, [name]: e.target.value})
    }

    const handleSignup = e => {
        e.preventDefault()
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    return setValues({...values, error: data.error, success: false})
                }
                setValues({...values, name: '', email: '', password: '', error: '', success: true})
            })
    }

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>{error}</div>
    )
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>New account is created. Please <Link to="/signin">Signin</Link> now</div>
    )

    const signupForm = () => {
        return (
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
                </div>
                <button className="btn btn-primary" type="submit">Signup</button>
            </form>
        )
    }



    return (
        <Layout title="Signup" description="Signup with your credientials" className="container col-md-8 offset-md-2">
            {showError()}
            {showSuccess()}
            {signupForm()}
        </Layout>
    )
}

export default Signup
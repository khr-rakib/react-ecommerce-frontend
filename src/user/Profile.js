import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import Layout from '../core/Layout'
import {read, update, updateUser} from './apiUser'

const Profile = ({match}) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    })
    const {token} = isAuthenticated()
    const { name, email, password, error, success } = values

    const init = (userId) => {
        read(userId, token)
            .then(data => {
                if (data.error) {
                    setValues({...values, error: true})
                } else {
                    setValues({...values, name: data.name, email: data.email})
                }
            })
    }

    useEffect(() => {
        init(match.params.userId)
    }, [])


    const handleChange = name => e => {
        setValues({...values, [name]: e.target.value, error: false})
    }

    const clickSubmit = e => {
        e.preventDefault()
        update(match.params.userId, token, { name, email, password })
            .then(data => {
                if (data.error) {
                    setValues({...values, error: true})
                } else {
                    updateUser(data, () => {
                        setValues({...values, name: data.name, email: data.email, success: true})
                    })
                }
            })
    }

    const redirectUser = (success) => {
        if (success) {
            return <Redirect to="/user/dashboard/" />
        }
    }

    const profileUpdate = (name, email, password) => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" onChange={handleChange('name')} value={name} className="form-control"  />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" onChange={handleChange('email')} value={email} className="form-control"  />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" onChange={handleChange('password')} value={password} className="form-control"  />
            </div>

            <button className="btn btn-primary">Submit</button>
        </form>
    )


    return (
        <Layout title="Profile" description="Update your profile" className="container">
            <h2>Profile Update</h2>
            {profileUpdate(name, email, password)}
            {redirectUser(success)}
        </Layout>
    )
}

export default Profile

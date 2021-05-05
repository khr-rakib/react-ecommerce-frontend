import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { createOrder, getBraintreeClientToken, processPayment } from './apiCore'
import DropIn from 'braintree-web-drop-in-react'
import { emptyCart } from './cartHelper';


const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token)
            .then(data => {
                if (data.error) {
                    setData({...data, error: data.error})
                } else {
                    setData({...data, clientToken: data.clientToken, success: false})
                }
            })
    }

    useEffect(() => {
        getToken(userId, token)
    }, [])

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    let deliveryAddress = data.address
    const buy = () => {
        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }
                processPayment(userId, token, paymentData)
                    .then(res => {
                        const createOrderData = {
                            products: products,
                            transaction_id: res.transaction.id,
                            amount: res.transaction.amount,
                            address: deliveryAddress
                        }
                        createOrder(userId, token, createOrderData)
                            .then(() => {
                                setData({ ...data, success: res.success, address: '' })
                                emptyCart(() => {
                                    console.log('payment success and empty cart')
                                })
                            })
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => {
                console.log('dropin error: ', err)
                setData({...data, error: err.message})
            })
    }

    const handleAddress = e => {
        setData({...data, address: e.target.value})
    }

    const showDropIn = () => (
        <div>
            { data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className="form-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea onChange={handleAddress} className="form-control" value={data.address} placeholder="Type your delivery address here..."></textarea>
                    </div>
                    <DropIn options={{ authorization: data.clientToken }} onInstance={(instance) => data.instance = instance} />
                    <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                </div>
            ) : null }
        </div>
    )


    const showError = () => (
        <div className="alert alert-danger" style={{display: data.error ? '' : 'none'}}>{data.error}</div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display: data.success == true ? '' : 'none'}}>Thanks! your payment was successful!</div>
    )

    return (
        <div onBlur={() => setData({...data, error: ''})}>
            <h3>Total: ${getTotal()}</h3>
            {showError()}
            {showSuccess()}
            {isAuthenticated() ? (
                showDropIn()
            ) : (
                <Link to='/signin' className="btn btn-info">Signin to checkout</Link>
            )}
        </div>
    )
}

export default Checkout

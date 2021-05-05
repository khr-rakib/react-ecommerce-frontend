import React, { useEffect, useState } from 'react'
import { getCart } from './cartHelper'
import Layout from './Layout'
import Card from './Card'
import { Link } from 'react-router-dom'
import Checkout from './Checkout'


const Cart = (props) => {
    const [items, setItems] = useState([])
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart())
    }, [run])

    const showItems = items => {
        return (
            <div>
                <h3>Your cart has {items.length} items </h3>
                <hr />
                {items.map((p, i) => (<Card product={p} key={i} showAddToCartButton={false} cartUpdate={true} showRemoveProductButton={true} setRun={setRun} run={run} /> ))}
            </div>
        )
    }

    const noItemMsg = () => (
        <div className="alert alert-info">
            <h3>Your cart is empty</h3>
            <Link to="/shop">Continue Shopping</Link>
        </div>
    )

    return (
        <Layout title="Cart Page" description="Manage your cart items. Add remove checkout or continue shopping." className="container">
            <div className="row">
                <div className="col-md-6">
                    {items.length > 0 ? showItems(items) : noItemMsg()}
                </div>
                <div className="col-md-6">
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
            </div>
            
        </Layout>
    )
}

export default Cart

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
import { addItem, removeItem, updateItem } from './cartHelper'
import { Redirect } from 'react-router-dom'

const Card = ({ product, showViewProductButton = true, showAddToCartButton = true, cartUpdate = false, showRemoveProductButton = false, setRun = f => f, run = undefined }) => {
    const [count, setCount] = useState(product.count)
    const [redirect, setRedirect] = useState(false)
    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true)
        })
    }

    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to="/cart" />
        }
    }

    const handleChange = productId => e => {
        setRun(!run);
        setCount(e.target.value < 1 ? 1 : e.target.value)
        if (e.target.value >= 1) {
            updateItem(productId, e.target.value)
        }
    }

    return (
        <div className="card">
            <div className="card-header">
                { product.name }
            </div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="product" />
                <p className="lead">{product.description.substring(0, 20)}</p>
                <p className="font-weight-bold">${product.price}</p>
                <p>Category: {product.category && product.category.name}</p>
                <p>Added on - {moment(product.createdAt).fromNow()}</p>
                <p>
                    {product.quantity > 0 ? <span className="badge badge-primary">In stock</span> : <span className="badge badge-warning">Out of stock</span>}
                </p>
                {showViewProductButton && <Link to={`/product/${product._id}`}>
                    <button className="btn btn-outline-primary my-2">View Product</button>
                </Link>}
                {showAddToCartButton && <Link to="/">
                    <button className="btn btn-outline-info my-2" onClick={addToCart}>Add to cart</button>
                </Link>}

                {cartUpdate && (
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Adjuct quantity</span>
                        </div>
                        <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
                    </div>
                )}

                {showRemoveProductButton && (
                    <button onClick={() => { removeItem(product._id); setRun(!run);}} className="btn btn-danger my-2">
                        Remove Product
                    </button>
                )}
                
            </div>
        </div>        
    )
}

export default Card

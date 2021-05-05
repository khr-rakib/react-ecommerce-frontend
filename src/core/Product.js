import React, { useEffect, useState } from 'react'
import { listRelated, read } from './apiCore'
import Layout from './Layout'
import Card from './Card'

const Product = (props) => {
    const [product, setProduct] = useState({})
    const [relatedProduct, setRelatedProduct] = useState([])
    const [error, setError] = useState({})

    useEffect(() => {
        const productId = props.match.params.productId
        loadSingleProduct(productId)
    }, [props])

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setProduct(data)
                // fetch related products
                listRelated(data._id).then(data => {
                    if (data.error) {
                        setError(data.error)
                    } else {
                        setRelatedProduct(data)
                    }
                })
            }
        })
    }

    return (
        <Layout title={product && product.name} description={product && product.description && product.description.substring(0, 50)} className="container">
            <div className="row">
                <div className="col-md-8">
                    {product && product.description && <Card product={product} showViewProductButton={false} />}
                </div>
                <div className="col-md-4">
                    <h4>Related Products</h4>
                    {relatedProduct && relatedProduct.map((p, i) => <Card product={p} key={i} />)}
                    {relatedProduct.length < 1 && <p>No related products</p> }
                </div>
            </div>
        </Layout>
    )
}

export default Product

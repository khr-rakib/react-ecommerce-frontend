import React, { useEffect, useState } from 'react'
import { getProducts } from './apiCore'
import Layout from './Layout'
import Card from './Card'
import Search from './Search'

function Home() {
    const [productsBySell, setProductsBySell] = useState([])
    const [productsByArrival, setProductsByArrival] = useState([])
    const [error, setError] = useState(false)

    const loadProductsBySell = () => {
        getProducts('sold')
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setProductsBySell(data)
                }
            })
    }

    const loadProductsByArrival = () => {
        getProducts('createdAt')
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setProductsByArrival(data)
                }
            })
    }
    
    useEffect(() => {
        loadProductsBySell()
        loadProductsByArrival()
    }, [])


    return (
        <Layout title="Home Page" description="Node React E-commerce app" className="container">
            <Search/>
            
            <h2 className="mb-3">Best sellers</h2>
            <div className="row">
                {productsBySell.map((product, i) => (<div className="col-md-4 mb-3" key={i}><Card product={product} /></div>))}
            </div>

            <h2 className="mb-3">New Arrivals</h2>
            <div className="row">
                {productsByArrival.map((product, i) => (<div className="col-md-4 mb-3" key={i}><Card product={product} /></div>))}
            </div>
        </Layout>
    )
}

export default Home

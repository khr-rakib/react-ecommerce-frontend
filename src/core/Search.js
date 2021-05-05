import React, { useEffect, useState } from 'react'
import { getCategories, list } from './apiCore'
import Card from './Card'

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    })

    const {categories, category, search, results, searched} = data

    const loadCategories = () => {
        getCategories()
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setData({...data, categories: data})
                }
            })
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const handleChange = name => e => {
        setData({...data, [name]: e.target.value, searched: false})
    }

    const searchData = () => {
        list({search: search || undefined, categroy: category})
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                } else {
                    setData({...data, results: res, searched: true})
                }
            })
    }

    const searchSubmit = e => {
        e.preventDefault()
        searchData()
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text mb-4">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select onChange={handleChange('category')} id="" className="btn mr-2">
                            <option value="All">All</option>
                            {categories && categories.map((c, i) => (
                                <option value={c._id} key={i}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <input type="search" className="form-control" onChange={handleChange('search')} placeholder="Search by name" />
                </div>
                <div style={{border: 'none'}} className="btn input-group-append">
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    )

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Found ${results.length} products`
        }
        if (searched && results.length < 1) {
            return `No products found`
        }
    }

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="my-4">{searchMessage(searched, results)}</h2>
                <div className="row">
                    {results && results.map((p, i) => (<div className="col-md-4" key={i}><Card product={p} /></div>))}
                </div>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="container mb-3">
                {searchForm()}
            </div>
            <div className="container mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    )
}

export default Search

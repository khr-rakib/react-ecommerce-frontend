import React, { useState } from 'react'

const RadioBox = ({ prices, handleFilters }) => {
    const [value, setValue] = useState(0)

    const handleChange = e => {
        handleFilters(e.target.value);
        setValue(e.target.value);
    }

    return (
        prices && prices.map((p, i) => <div key={i}>
            <input onChange={handleChange} name="radion" value={p._id} type="radio" id={p._id} className="mr-2 ml-4" />
            <label htmlFor={p._id} className="form-check-label">{p.name}</label>
        </div>)
            
        
    )
}

export default RadioBox

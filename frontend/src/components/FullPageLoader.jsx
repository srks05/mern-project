import React from 'react'
import Spinner from '../assets/480px-Loader.gif'
const FullPageLoader = () => {
    return (
        <div className="fp-container text-center">
            <img src={Spinner} className="fp-loader" alt="loading" />

        </div>)
}

export default FullPageLoader
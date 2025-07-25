import React, { Children } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({children}) => {
    const {isAuthenticated , isAdmin} = useSelector(state=>state.auth)

    if (!isAuthenticated) return <Navigate to="/login" replace/>
    if (!isAdmin) return <Navigate to="/home" replace/>

    return children
}

export default AdminRoute
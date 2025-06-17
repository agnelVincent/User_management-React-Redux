import {createSlice} from '@reduxjs/toolkit'

const access = localStorage.getItem('accessToken')
const refresh = localStorage.getItem('refreshToken')

let decoded = null
if(access){
    try{
        decoded = JSON.parse(atob(access.split('.')[1]))
    }
    catch(e){
        decoded = null
    }
}

const initialState = {
    accessToken : access || null,
    refreshToken : refresh || null,
    isAuthenticated : !!access,
    isAdmin : decoded?.is_staff || false,
    userId : decoded?.user_id || null
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setTokens : (state , action) => {
            state.accessToken = action.payload.access
            state.refreshToken = action.payload.refresh
            state.isAuthenticated = true

            const decoded = JSON.parse(atob(action.payload.access.split('.')[1]))
            state.isAdmin = decoded.is_staff
            state.userId = decoded.user_id
        },
        logout : (state) => {
            state.accessToken = null,
            state.refreshToken = null,
            state.isAdmin = false,
            state.isAuthenticated = false,
            state.userId = null,
            localStorage.removeItem('accessToken'),
            localStorage.removeItem('refreshToken')
        }
    }
})

export const {setTokens , logout} = authSlice.actions
export default authSlice.reducer
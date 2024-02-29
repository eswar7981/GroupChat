import {createSlice} from '@reduxjs/toolkit'
const initialAuthState={
    login:false,
    token:'',
    premium:false,
    email:''
};

const authSlice=createSlice({
    name:'authentication',
    initialState:initialAuthState,
    reducers:{
        setLogin(state){
            state.login=!state.login
            if(state.login==false){
                state.token=''
            }
        },
        setToken(state,action){
            state.token=action.payload
        },
        setEmail(state,action){
            state.email=action.payload
        }
    }
})

export const authActions=authSlice.actions
export default authSlice.reducer;


















const { createSlice } = require("@reduxjs/toolkit");

const authManager = createSlice({
    initialState: {
        refresh: false,
        adminId: '',
        full_name: '',
        role: '',
        phone: ''
    },
    name: 'auth',
    reducers: {
        setAuth: (state, { payload }) => {
            state.adminId = payload.adminId;
            state.full_name = payload.full_name;
            state.role = payload.role;
            state.phone = payload.phone;
        },
        setAuthRefresh: (state)=>{
            state.refresh=!state.refresh;
        }
    }
});
export const { setAuth, setAuthRefresh } = authManager.actions
export default authManager.reducer
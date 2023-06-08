const { createSlice } = require("@reduxjs/toolkit");

const orderManager = createSlice({
    initialState: {
        refresh: false,
    },
    name: 'order',
    reducers: {
        setRefreshOrder: (state) => {
            state.refresh = !state.refresh;
        }
    }
});
export const { setRefreshOrder } = orderManager.actions
export default orderManager.reducer
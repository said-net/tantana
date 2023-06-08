const { createSlice } = require("@reduxjs/toolkit");

const operatorManager = createSlice({
    initialState: {
        refresh: false,
    },
    name: 'operator',
    reducers: {
        setRefreshOperator: (state) => {
            state.refresh = !state.refresh;
        }
    }
});
export const { setRefreshOperator } = operatorManager.actions
export default operatorManager.reducer
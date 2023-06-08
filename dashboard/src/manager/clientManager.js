const { createSlice } = require("@reduxjs/toolkit");

const clientManager = createSlice({
    initialState: {
        refresh: false,
    },
    name: 'client',
    reducers: {
        setRefreshClient: (state) => {
            state.refresh = !state.refresh;
        }
    }
});
export const { setRefreshClient } = clientManager.actions
export default clientManager.reducer
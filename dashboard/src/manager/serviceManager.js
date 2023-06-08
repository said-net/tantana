const { createSlice } = require("@reduxjs/toolkit");

const serviceManager = createSlice({
    initialState: {
        refresh: false,
    },
    name: 'service',
    reducers: {
        setRefreshService: (state) => {
            state.refresh = !state.refresh;
        }
    }
});
export const { setRefreshService } = serviceManager.actions
export default serviceManager.reducer
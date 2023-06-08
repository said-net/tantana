import { configureStore } from "@reduxjs/toolkit";
import authManager from "./authManager";
import operatorManager from "./operatorManager";
import serviceManager from "./serviceManager";
import orderManager from "./orderManager";
import clientManager from "./clientManager";

export default configureStore({
    reducer: {
        auth: authManager,
        operator: operatorManager,
        service: serviceManager,
        order: orderManager,
        client: clientManager
    }
});
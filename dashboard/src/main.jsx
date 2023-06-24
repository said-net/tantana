import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import axios from "axios";
import { API } from "./cfg";
import { setAuth } from "./manager/authManager";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Operators from "./pages/operators/operators";
import Services from "./pages/services/services";
import Orders from "./pages/orders/orders";
import Dashboard from "./pages/dashboard/dashboard";
import Notes from "./pages/notes/notes";
import Clients from "./pages/clients/clients";
import Partners from "./pages/partners/partners";
import PartnerOrders from "./pages/partners/partnerorders";
import PartnerClients from "./pages/partners/clients";
import PartnerNotes from "./pages/partners/notes";
function Main() {
    const { refresh, adminId, role } = useSelector(e => e.auth);
    const dp = useDispatch();
    useEffect(() => {
        axios(`${API}/admin/verify`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            if (ok)
                dp(setAuth(data))
            else
                dp(setAuth({
                    adminId: '',
                    full_name: '',
                    role: '',
                    phone: ''
                }));
        });
        // eslint-disable-next-line
    }, [refresh]);
    if (!adminId) {
        return (
            <>
                <Auth />
                <ToastContainer position="top-center" autoClose={2000} closeButton={false} />
            </>
        );
    } else {
        return (
            <>
                <Navbar />
                <Routes>
                    {role === 'creator' || role === 'operator' ? <Route path="/" element={<Dashboard />} /> : <Route path="/" element={<Partners />} />}
                    {role === 'creator' || role === 'operator' ? <Route path="/notes" element={<Notes />} /> : <Route path="/notes" element={<PartnerNotes />} />}
                    {role === 'creator' ? <Route path="/admins" element={<Operators />} /> : null}
                    {role === 'creator' ? <Route path="/services" element={<Services />} /> : null}
                    {role === 'creator' || role === 'operator' ? <Route path="/orders" element={<Orders />} /> : <Route path="/orders" element={<PartnerOrders />} />}
                    <Route path="/clients" element={<Clients />} />
                    {role === 'creator' || role === 'operator' ? <Route path="/partner-clients" element={<PartnerClients />} /> : null}
                    {/* <Route path="*" element={<Dashboard />} /> */}
                    <Route path="/partner-orders" element={<PartnerOrders />} />
                    {/* <Route path="*" element={<Dashboard />} /> */}
                </Routes>
                <ToastContainer position="top-center" autoClose={2000} closeButton={false} style={{ zIndex: '9999999' }} />
            </>
        )
    }
}

export default Main;
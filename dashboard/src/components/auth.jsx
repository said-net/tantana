import { Button, Checkbox, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiLock, BiUser } from 'react-icons/bi';
import { API } from "../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAuthRefresh } from "../manager/authManager";
function Auth() {
    const [state, setState] = useState({ phone: '+998', password: '', check: false });
    const [disabled, setDisablet] = useState(false);
    const dp = useDispatch();
    function Submit() {
        setDisablet(true)
        axios.post(`${API}/admin/signin`, state).then((res) => {
            const { ok, msg, token } = res.data;
            if (!ok) {
                toast.warning(msg);
                setDisablet(false);
            } else {
                localStorage.setItem('access', token);
                toast.success(msg);
                setDisablet(false);
                setTimeout(() => {
                    dp(setAuthRefresh())
                }, 1500)
            }
        })
    }
    return (
        <div className="flex items-center justify-center w-full h-[100vh]">
            <div className="flex items-center justify-start flex-col w-[600px] bg-white rounded-[10px] shadow-lg p-[10px]">
                <h1 className="text-blue-gray-700 text-[24px] mb-[10px]">TIZIMGA KIRISH</h1>
                <div className="flex items-center justify-center w-full mb-[20px]">
                    <Input onChange={e => setState({ ...state, phone: e.target.value.trim() })} disabled={disabled} value={state.phone} label="Telefon raqamingiz: +998...." color="green" icon={<BiUser />} />
                </div>
                <div className="flex items-center justify-center w-full mb-[20px]">
                    <Input type="password" onChange={e => setState({ ...state, password: e.target.value.trim() })} disabled={disabled} value={state.password} label="Parolingiz" color="green" icon={<BiLock />} />
                </div>
                <div className="flex items-center justify-start w-full mb-[20px]">
                    <Checkbox label={"30 kunga eslab qolish"} onChange={e => setState({ ...state, check: e.target.checked })} disabled={disabled} />
                </div>
                <div className="flex items-center justify-center w-full mb-[20px]">
                    <Button color="green" className="w-[200px]" disabled={state.password.length < 4 || !state.phone || disabled} onClick={Submit}>{
                        !disabled ? "KIRISH" : <><Spinner className="inline" />KUTING...</>
                    }</Button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
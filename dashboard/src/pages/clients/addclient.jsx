import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiLock, BiPhone, BiUser } from "react-icons/bi";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshClient } from "../../manager/clientManager";

function ClientAdd({ open, setOpen }) {
    const [state, setState] = useState({ name: '', phone: '+998', location: '' });
    const [disabled, setDisablet] = useState(false);
    const dp = useDispatch();
    function Submit() {
        setDisablet(true)
        axios.post(`${API}/client/create`, state, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisablet(false);
            if (!ok)
                toast.error(msg);
            else {
                toast.success(msg);
                setState({ name: '', phone: '+998', password: '', location: '' });
                setOpen(false);
                dp(setRefreshClient());
            }
        }).catch(() => {
            setDisablet(false);
            toast.warning("Aloqa mavjud emas! Internetga ulanganlikni tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] text-blue-gray-800">MIJOZ QO'SHISH</h1>
                </DialogHeader>
                <DialogBody className="w-full">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} value={state.name} label="F.I ni kiriting!" required icon={<BiUser />} onChange={e => setState({ ...state, name: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="tel" value={state.phone} label="Mijoz raqamini kiriting!" required icon={<BiPhone />} onChange={e => setState({ ...state, phone: e.target.value.trim() })} />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Input disabled={disabled} value={state.location} label="Mijoz manzili" required icon={<BiLock />} onChange={e => setState({ ...state, location: e.target.value })} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setOpen(false)}>
                        Bekor qilish
                    </Button>
                    <Button disabled={state.name.length < 3 || state.phone.length !== 13 || disabled || state.location < 5} variant="gradient" color="green" className="ml-[10px]" onClick={Submit}>
                        {!disabled ? "Qo'shish" : <><Spinner /></>}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default ClientAdd;
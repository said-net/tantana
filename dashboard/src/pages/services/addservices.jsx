import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiListOl, BiMoney } from "react-icons/bi";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshService } from "../../manager/serviceManager";

function ServiceAdd({ open, setOpen }) {
    const [state, setState] = useState({ title: '', about: '' });
    const [disabled, setDisablet] = useState(false);
    const dp = useDispatch();
    function Submit() {
        setDisablet(true)
        axios.post(`${API}/service/create`, state, {
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
                setState({ title: '', about: '' });
                setOpen(false);
                dp(setRefreshService());
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
                    <h1 className="text-[20px] text-blue-gray-800">HIZMAT QO'SHISH</h1>
                </DialogHeader>
                <DialogBody className="w-full">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} value={state.title} label="Hizmat nomini" required icon={<BiListOl />} onChange={e => setState({ ...state, title: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Textarea disabled={disabled} value={state.about} label="Hizmat haqida batafsil" onChange={e => setState({ ...state, about: e.target.value })} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setOpen(false)}>
                        Bekor qilish
                    </Button>
                    <Button disabled={disabled || state.title.length < 4} variant="gradient" color="green" className="ml-[10px]" onClick={Submit}>
                        {!disabled ? "Qo'shish" : <><Spinner /></>}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default ServiceAdd;
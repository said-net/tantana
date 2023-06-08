import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOperator } from "../../manager/operatorManager";

function OperatorDelete({ select, setSelect }) {
    const [disabled, setDisablet] = useState(false);
    const dp = useDispatch();
    function Submit() {
        setDisablet(true);
        axios.post(`${API}/admin/hide-admin/${select._id}`, {}, {
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
                setSelect({ del: false, edit: false, _id: '', full_name: '', super: false, phone: '' });
                dp(setRefreshOperator());
            }
        }).catch(() => {
            setDisablet(false);
            toast.warning("Aloqa mavjud emas! Internetga ulanganlikni tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={select.del} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] text-blue-gray-800">OPERATOR: {select?.full_name}</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <p className="flex items-center"><BiInfoCircle />DIQQAT o'chirib tashlangan operator qayta tiklanmaydi!</p>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setSelect({ del: false, edit: false, _id: '', full_name: '', super: false, phone: '' })}>
                        Bekor qilish
                    </Button>
                    <Button onClick={Submit} color="red">
                        {!disabled ? "O'chirish" : <><Spinner /></>}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default OperatorDelete;
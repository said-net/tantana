import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiLock, BiPhone, BiUser } from "react-icons/bi";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOperator } from "../../manager/operatorManager";

function OperatorEdit({ select, setSelect }) {
    const [disabled, setDisablet] = useState(false);
    const dp = useDispatch();
    function Submit() {
        setDisablet(true);
        axios.put(`${API}/admin/edit-admin/${select._id}`, select, {
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
                setSelect({ del: false, edit: false, operatorId: '', full_name: '', super: false, phone: '' });
                dp(setRefreshOperator());
            }
        }).catch(() => {
            setDisablet(false);
            toast.warning("Aloqa mavjud emas! Internetga ulanganlikni tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={select.edit} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] text-blue-gray-800">{select.old === 'operator' ? "OPERATORNI" : "HAMKORNI"} TAXRIRLASH</h1>
                </DialogHeader>
                <DialogBody className="w-full">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} value={select.full_name} label="F.I ni kiriting!" required icon={<BiUser />} onChange={e => setSelect({ ...select, full_name: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="tel" value={select.phone} label="Operator raqamini kiriting!" required icon={<BiPhone />} onChange={e => setSelect({ ...select, phone: e.target.value.trim() })} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select disabled={disabled} value={select.role} label="Toifa tanlang!" onChange={e => setSelect({ ...select, role: e })}>
                            <Option value="operator">Operator</Option>
                            <Option value="partner">Hamkor</Option>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Input disabled={disabled} value={select.password} label="Operator uchun parol 6 honalik" required icon={<BiLock />} onChange={e => setSelect({ ...select, password: e.target.value.trim() })} />
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setSelect({ del: false, edit: false, operatorId: '', full_name: '', super: false, phone: '' })}>
                        Bekor qilish
                    </Button>
                    <Button disabled={select?.full_name?.length < 3 || select?.phone?.length !== 13 || disabled || (select?.password && select?.password?.length < 6)} variant="gradient" color="green" className="ml-[10px]" onClick={Submit}>
                        {!disabled ? "Qo'shish" : <><Spinner /></>}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default OperatorEdit;
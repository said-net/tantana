import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { BiCalendar, BiLock, BiMoney, BiPhone, BiUser } from "react-icons/bi";
import Formatter from "../../components/formatter";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOrder } from "../../manager/orderManager";

function PartnerOrderAdd({ open, setOpen }) {
    const [state, setState] = useState({ name: '', phone: '+998', location: '', about: '', mortgage: '', price: '', services: '', date: '' });
    const [disabled, setDisabled] = useState(false);
    const dp = useDispatch();
    function Submit() {
        setDisabled(true);
        axios.post(`${API}/partner/create-order`, state, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setDisabled(false);
            const { ok, msg } = res.data;
            if (!ok) {
                toast.warning(msg);
            } else {
                toast.success(msg);
                setState({ name: '', phone: '+998', location: '', about: '', mortgage: '', price: '', services: '', date: '' });
                dp(setRefreshOrder());
                setOpen(false);
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
            setDisabled(false);
        })
    }
    return (
        <Dialog open={open} size="xxl" className=" min-w-[375px] flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] text-blue-gray-800">BUYURTMA QO'SHISH</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y h-[500px] overflow-y-scroll">
                    <div className="flex items-center justify-start flex-col w-full">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled={disabled} value={state.name} label="F.I ni kiriting!" required icon={<BiUser />} onChange={e => setState({ ...state, name: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled={disabled} type="tel" value={state.phone} label="Mijoz raqamini kiriting!" required icon={<BiPhone />} onChange={e => setState({ ...state, phone: e.target.value.trim() })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled={disabled} value={state.location} label="Mijoz manzili" required icon={<BiLock />} onChange={e => setState({ ...state, location: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Textarea disabled={disabled} value={state.about} label="Buyurtma haqida batafsil ma'lumot" onChange={e => setState({ ...state, about: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Textarea disabled={disabled} value={state.services} label="Hizmatlar(Karnay, Iidish tovoq, ..." onChange={e => setState({ ...state, services: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled={disabled} type="date" value={state.date} label="Hizmat nechanchi sanaga?" required onChange={e => setState({ ...state, date: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="number" disabled={disabled} value={state.price} label="Buyurtma narxi(SO'M)" required icon={<BiMoney />} onChange={e => setState({ ...state, price: e.target.value.trim() })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="number" disabled={disabled} value={state.mortgage} label="Oldindan(Zaklad)" required icon={<BiMoney />} onChange={e => setState({ ...state, mortgage: e.target.value.trim() })} />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Hizmat narxi:</p>
                            <b><Formatter value={!state.price ? '0' : state.price} /> So'm</b>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Oldindan zaklad:</p>
                            <b><Formatter value={!state.mortgage ? '0' : state.mortgage} /> So'm</b>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Qolgan to'lov:</p>
                            <b><Formatter value={!state.price ? '0' : (state.price - state.mortgage)} /> So'm</b>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter className="w-full flex items-center justify-between">
                    <Button color="orange" onClick={() => { setOpen(false) }}>Ortga</Button>
                    <Button color="green" onClick={() => { Submit() }}>Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default PartnerOrderAdd;
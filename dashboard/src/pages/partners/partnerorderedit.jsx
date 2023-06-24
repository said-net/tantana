import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import Formatter from "../../components/formatter";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { setRefreshOrder } from "../../manager/orderManager";

function PartnerOrderEdit({ select, setSelect }) {
    const { auth } = useSelector(e => e);
    const [disabled, setDisabled] = useState(false);
    const dp = useDispatch()
    function Submit() {
        setDisabled(true);
        axios.put(`${API}/partner/set-status/${select._id}`, {}, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setDisabled(false);
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefreshOrder());
                setSelect({ ...select, open: false })
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={select?.open} size="xxl" className=" min-w-[375px] flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-blue-gray-700 text-[18px] flex items-center">Buyurtma: {
                        select?.viewed ?
                            <Chip color="green" value={"TASDIQLANGAN"} /> :
                            <Chip color="red" value={"TASDIQLANMAGAN "} />

                    }</h1>
                </DialogHeader>
                <DialogBody className="border-y w-full overflow-y-scroll h-[500px]">
                    <div className="flex items-start justify-start flex-col w-full">
                        <h1 className="text-[20px] font-bold w-full">BUYURTMACHI MA'LUMOTLARI</h1>
                        <p >Ismi: <b>{select?.client?.name}</b></p>
                        <p className="cursor-pointer" onClick={() => window.location.href = "tel:" + select?.client?.phone}>Raqami: <b>{select?.client?.phone}</b></p>
                        <p className="w-full">Manzili: <b>{select?.client?.location}</b></p>
                        <h1 className="text-[20px] font-bold pt-[10px] border-t mt-[10px] w-full">BUYURTMA</h1>
                        <p >Narxi: <b><Formatter value={select?.price} /></b></p>
                        <p>Oldindan(Zaklad): <b><Formatter value={select?.mortgage} /></b></p>
                        <p >Qolgan: <b><Formatter value={select?.price - select?.mortgage} /></b></p>
                        <p >Hizmatlar: <b>{select?.services}</b></p>
                        <p >Batafsil: <b>{select?.about}</b></p>
                        <p >Qachonga: <b>{select?.day < 10 ? `0${select?.day}` : select?.day}-{select?.month < 10 ? `0${select?.month}` : select?.month}-{select?.year}</b></p>
                        <h1 className="text-[20px] font-bold pt-[10px] border-t mt-[10px] w-full">QABUL QILUVCHI</h1>
                        <p >Ismi: <b>{select?.from?.full_name}</b></p>
                        <p className="cursor-pointer" onClick={() => window.location.href = "tel:" + select?.from?.phone}>Raqami: <b>{select?.from?.phone}</b></p>
                        <p className="w-full">Toifa: <b>HAMKOR</b></p>
                    </div>
                </DialogBody>
                <DialogFooter className="w-full" >
                    <Button disabled={disabled} color="orange" onClick={() => setSelect({ open: false })}>Ortga</Button>
                    {
                        !select?.viewed && auth?.role === 'partner' ?
                            <Button disabled={disabled} onClick={Submit} color="green" className="ml-[10px]">KO'rib chiqildi</Button> : null
                    }
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default PartnerOrderEdit;
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../cfg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ClientEdit({ select, setSelect }) {
    const [isLoad, setIsLoad] = useState(false);
    const [orders, setOrders] = useState([]);
    const { role } = useSelector(e => e.auth);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/client/getallorders/${select?._id}`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setOrders(data);
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
            setIsLoad(true);
        })
    }, [select?._id]);
    return (
        <Dialog open={select?._id !== 'test'} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px]">Mijoz ma'lumotlari</h1>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <p>Ismi: {!isLoad ? <Spinner /> : select?.name}</p>
                    <p onClick={() => window.location.href = 'tel:' + select?.phone}>Raqami: {!isLoad ? <Spinner /> : select?.phone}</p>
                    <p>Manzili: {!isLoad ? <Spinner /> : select?.location}</p>
                    <p>Kiritilgan: {!isLoad ? <Spinner /> : select?.created}</p>
                    {/* {
                        role === 'partner' ? null :
                            <>
                                <h1 className="text-[20px] font-bold text-blue-gray-700 mt-[10px] border-t">BUYURTMALARI</h1>
                                <p>Bajarilgan: {!isLoad ? <Spinner /> : orders.filter(e => e.status === 'success').length} ta</p>
                                <p>Bekor qilingan: {!isLoad ? <Spinner /> : orders.filter(e => e.status === 'reject').length} ta</p>
                                <p>Kutulayotgan: {!isLoad ? <Spinner /> : orders.filter(e => e.status === 'pending').length} ta</p>
                            </>
                    } */}
                    {role === 'creator' ?
                        <>
                            <h1 className="text-[20px] font-bold text-blue-gray-700 mt-[10px] border-t">KIM TOMONIDAN QO'SHILGAN</h1>
                            <p>Ismi: {select?.from?.full_name}</p>
                            <p>Raqami: {select?.from?.phone}</p>
                            <p>Toifa: {select?.from?.role === 'operator' ? "OPERATOR" : select?.from?.role === 'partner' ? "HAMKOR" : "BOSHLIQ"}</p>
                        </>
                        : null
                    }
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setSelect({ _id: 'test' })}>
                        Ortga
                    </Button>
                    {/* <Button variant="gradient" color="green" className="ml-[10px]" onClick={Submit}>
                        {!disabled ? "Qo'shish" : <><Spinner /></>}
                    </Button> */}
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default ClientEdit;
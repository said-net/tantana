import { Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import Formatter from "../../components/formatter";
import PartnerOrderEdit from "./partnerorderedit";

function PartnerNotes() {
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState([]);
    const [select, setSelect] = useState({ open: false });
    const { order } = useSelector(e => e);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/partner/get-notes`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunub ko'ring!");
            setIsLoad(true);
        });
    }, [order?.refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            {!isLoad ?
                <div className="flex items-center justify-start w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                    <Spinner /> <p>Kuting...</p>
                </div> :
                !state[0] ?
                    <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                        <p>ESLATMALAR MAVJUD EMAS</p>
                    </div> :
                    state.map((o, key) => {
                        return (
                            <div key={key} onClick={() => setSelect({ open: true, ...o })} className="flex items-center justify-start flex-col w-[100%] bg-white h-[80px] mb-[10px] rounded-[10px] shadow-md hover:shadow-lg p-[0_10px] cursor-pointer">
                                <div className="flex items-center justify-between w-full h-[50px]">
                                    <h1 className="phone:text-[13px] w-[30%]">Hamkor: {o?.from?.full_name}</h1>
                                    <h1 className="phone:text-[13px] w-[30%]"><Formatter value={o?.price} /></h1>
                                    <h1 className="phone:text-[13px]">{o.client.phone}</h1>
                                </div>
                                <div className="flex border-t w-full pt-[10px] items-center justify-between">
                                    <h1 className="text-[14px] text-blue-gray-500">Kiritildi: {o.createdAt}</h1>
                                    <h1 className="text-[14px] text-blue-gray-500">
                                        Qachonga:
                                        {o.day < 10 ? `0${o.day}` : o.day}-{o.month < 10 ? `0${o.month}` : o.month}-{o.year}
                                    </h1>
                                </div>
                            </div>
                        )
                    })
            }
            <PartnerOrderEdit select={select} setSelect={setSelect} />
        </div>
    );
}

export default PartnerNotes;
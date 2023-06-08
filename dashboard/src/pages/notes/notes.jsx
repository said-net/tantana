import { Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { BiTime, BiTimer } from "react-icons/bi";
import Formatter from "../../components/formatter";
import OrderEdit from "../orders/editorder";

function Notes() {
    const [filter, setFilter] = useState({ note: 'now', status: 'note' });
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState([]);
    const [select, setSelect] = useState({ open: false });
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/order/getnotes/${filter.note}/${filter.status}`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            setState(res?.data?.data);
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
            setIsLoad(true);
        })
    }, [filter]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] phone:flex-col">
                <div className="flex items-center justify-center w-[200px] phone:w-full">
                    <Select label="Necha kunlik eslatmalar?" value={filter.note} onChange={e => setFilter({ ...filter, note: e })}>
                        <Option value="now">BUGUN</Option>
                        <Option value="tomorrow">2 KUN</Option>
                        <Option value="tomorrow2">3 KUN</Option>
                    </Select>
                </div>
                <div className="flex items-center w-[200px] tablet:w-full phone:mt-[10px]">
                    <Select value={filter.status} label="Status bo'yicha filter" onChange={e => setFilter({ ...filter, status: e })}>
                        <Option value="note">
                            <BiTimer className="inline text-[20px] text-orange-500" />
                            Eslatma
                        </Option>
                        <Option value="pending">
                            <BiTime className="inline text-[20px] text-blue-500" />
                            Jarayonda
                        </Option>
                    </Select>
                </div>
            </div>
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                {!isLoad ?
                    <>
                        <div className="flex">
                            <Spinner />
                            <h1>Kuting...</h1>
                        </div>
                    </> : !state[0] ?
                        <h1>{filter.note === 'now' ? "BUGUN" : filter.note === 'tomorrow' ? "ERTAGA" : "INDINGA"}LIK ESLATMALAR MAVJUD EMAS</h1>
                        :
                        <h1>{filter.note === 'now' ? "BUGUN" : filter.note === 'tomorrow' ? "ERTAGA" : "INDINGA"}LIK ESLATMALAR - {state.length} TA</h1>
                }

            </div>
            {
                isLoad && state[0] ?
                    state?.map((o, index) => {
                        return (
                            <div key={index} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] h-[90px] bg-white p-[10px_20px] mb-[20px] relative phone:mb-[10px] flex-col hover:shadow-xl">
                                <div className="flex items-center justify-between w-full">
                                    {
                                        o.status === 'note' ?
                                            <BiTimer className="text-orange-500 text-[30px]" />
                                            : o.status === 'pending' ?
                                                <BiTime className="text-blue-500 text-[30px]" />
                                                : null
                                    }
                                    <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={!o?.price ? '0' : o?.price} /></p>
                                    <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                    <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} />
                                </div>
                                <div className="flex items-center justify-between w-full border-t">
                                    <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o.createdAt}</p>
                                    {o.status === 'pending' || o.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o.toDate}</p>
                                        : null}
                                </div>
                            </div>
                        )
                    })
                    : null

            }
            <OrderEdit state={select} setState={setSelect} />
        </div>
    );
}

export default Notes;
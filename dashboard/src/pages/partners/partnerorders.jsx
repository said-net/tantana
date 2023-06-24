import { IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiPlusCircle, BiSearch } from "react-icons/bi";
import PartnerOrderAdd from "./partnerorderadd";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import Formatter from "../../components/formatter";
import PartnerOrderEdit from "./partnerorderedit";
import FromOperator from "./fromoperator";

function PartnerOrders() {
    const [search, setSearch] = useState('');
    const [openAdd, setOpenAdd] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState([]);
    const [select, setSelect] = useState({ open: false });
    const { auth, order } = useSelector(e => e);
    const [partners, setPartners] = useState([]);
    const [filter, setFilter] = useState('');
    const [fromOperatorAdd, setFromOperatorAdd] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/partner/getall-orders`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data, partners } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
                setPartners(partners)
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunub ko'ring!");
            setIsLoad(true);
        });
    }, [order?.refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] tablet2:flex-col tablet2:items-start relative">
                <div className="flex items-center justify-center w-[250px] tablet2:mb-[10px] tablet2:w-[80%]">
                    <Input type="search" label="Ismi, Raqami, Manzili" onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                </div>

                {isLoad && partners[0] && auth?.role === 'operator' ?
                    <div className="flex items-center justify-center w-[250px] tablet2:mb-[10px] tablet2:w-[80%]">
                        <Select onChange={e => setFilter(e)} label={"Hamkor tanlash"}>
                            {
                                partners.map((p, key) => {
                                    return (
                                        <Option key={key} value={p._id}>{p.full_name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    : null
                }

                {auth.role === 'partner' ?
                    <div className="tablet2:absolute tablet2:top-[10px] tablet2:right-[10px]">
                        <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                            <BiPlusCircle />
                        </IconButton>
                    </div>
                    : <div className="tablet2:absolute tablet2:top-[10px] tablet2:right-[10px]">
                        <IconButton onClick={() => setFromOperatorAdd(true)} color="green" className="text-[30px] rounded-full">
                            <BiPlusCircle />
                        </IconButton>
                    </div>
                }
            </div>
            {!isLoad ?
                <div className="flex items-center justify-start w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                    <Spinner /> <p>Kuting...</p>
                </div> :
                !state[0] ?
                    <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                        <p>HAMKORLAR BUYURTMA QO'SHMAGAN</p>
                    </div> :
                    !search && !filter ?
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
                        }) :
                        filter ?
                            state.map((o, key) => {
                                return (
                                    filter === o?.from?._id ?
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
                                        : null
                                )
                            }) :
                            state.map((o, key) => {
                                return (
                                    o?.about?.toLowerCase()?.includes(search?.toLowerCase()) || o?.services?.toLowerCase()?.includes(search?.toLowerCase()) || o?.client?.name?.toLowerCase()?.includes(search?.toLowerCase()) || o?.client?.phone?.includes(search) || o?.client?.location?.toLowerCase()?.includes(search?.toLowerCase()) || o?.from?.full_name?.toLowerCase()?.includes(search?.toLowerCase()) || o?.from?.phone?.includes(search) || String(o?.price)?.includes(search) || String(o?.mortgage)?.includes(search) ?
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

                                        : null
                                )
                            })
            }
            <PartnerOrderAdd open={openAdd} setOpen={setOpenAdd} />
            <PartnerOrderEdit select={select} setSelect={setSelect} />
            <FromOperator open={fromOperatorAdd} setOpen={setFromOperatorAdd} partners={partners} />
        </div>
    );
}

export default PartnerOrders;
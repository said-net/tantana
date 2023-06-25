import { Button, IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiCheckCircle, BiPlusCircle, BiSearch, BiTime, BiTimer, BiXCircle } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import OrderAdd from "./addorder";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../cfg";
import Formatter from "../../components/formatter";
import { setRefreshOrder } from "../../manager/orderManager";
import OrderEdit from "./editorder";

function Orders() {
    const [openAdd, setOpenAdd] = useState(false);
    const [search, setSearch] = useState('');
    const { order, auth } = useSelector(e => e);
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState({});
    const [select, setSelect] = useState({ open: false });
    const [filter, setFilter] = useState({ date: '', status: '' });
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/order/getall?date=${filter.date}&status=${filter.status}`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { data } = res.data;
            setState(data[0] ? data : []);
        })
    }, [order?.refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                <div className="flex items-center justify-center w-[250px] ">
                    <Input type="search" label="Ismi, Raqami, Sanasi" onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                </div>
                <IconButton disabled={auth?.role === 'creator'} onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                    <BiPlusCircle />
                </IconButton>
            </div>
            {!isLoad ?
                <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                    <p className="flex"><Spinner /> KUTING...</p>
                </div>
                :
                <>
                    <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_5px] mb-[20px] phone:mb-[10px] tablet:flex-col">
                        <div className="flex items-center w-[200px] tablet:w-full tablet:mb-[10px]">
                            <Input value={filter.date} type="date" label="Sana bo'yicha filter" onChange={e => setFilter({ ...filter, date: e.target.value })} />
                        </div>
                        <div className="flex items-center w-[200px] tablet:w-full">
                            <Select value={filter.status} label="Status bo'yicha filter" onChange={e => setFilter({ ...filter, status: e })}>
                                <Option value="reject">
                                    <BiXCircle className="inline text-[20px] text-red-500" />
                                    Bekor qilingan
                                </Option>
                                <Option value="note">
                                    <BiTimer className="inline text-[20px] text-orange-500" />
                                    Eslatma
                                </Option>
                                <Option value="pending">
                                    <BiTime className="inline text-[20px] text-blue-500" />
                                    Jarayonda
                                </Option>
                                <Option value="success">
                                    <BiCheckCircle className="inline text-[20px] text-green-500" />
                                    Yakunlangan
                                </Option>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center tablet:mt-[10px]">
                            <Button className=" tablet:w-[150px]" color="orange" disabled={!filter.date && !filter.status} onClick={() => { setFilter({ date: '', status: '' }); dp(setRefreshOrder()) }}>Tozalash</Button>
                            <Button className="ml-[10px] tablet:w-[150px]" color="green" disabled={!filter.date && !filter.status} onClick={() => dp(setRefreshOrder())}>Filterlash</Button>
                        </div>
                    </div>
                    {
                        !state[0] ?
                            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                                <p className="text-blue-gray-600">SIZ BUYURTMA OLMAGANSIZ!</p>
                            </div>
                            :
                            <>
                                {!search ?
                                    state?.map((o, index) => {
                                        return (
                                            <div key={index} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] h-[90px] bg-white p-[10px_20px] mb-[20px] relative phone:mb-[10px] flex-col hover:shadow-xl">
                                                <div className="flex items-center justify-between w-full">
                                                    {
                                                        o?.status === 'reject' ?
                                                            <BiXCircle className="text-red-500 text-[30px]" />
                                                            : o?.status === 'note' ?
                                                                <BiTimer className="text-orange-500 text-[30px]" />
                                                                : o?.status === 'pending' ?
                                                                    <BiTime className="text-blue-500 text-[30px]" />
                                                                    : <BiCheckCircle className="text-green-500 text-[30px]" />
                                                    }
                                                    <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                                    <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                                    <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} />
                                                </div>
                                                <div className="flex items-center justify-between w-full border-t">
                                                    <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o?.createdAt}</p>
                                                    {o?.status === 'pending' || o?.status === 'success' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.date}</p>
                                                        : o?.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.toDate}</p> : null}
                                                </div>
                                            </div>
                                        )
                                    }) :
                                    state?.map((o, index) => {
                                        return (
                                            o?.name.toLowerCase().includes(search.toLowerCase()) || o?.phone.includes(search) || o?.location.toLowerCase().includes(search.toLowerCase()) || String(o?.price).includes(search) || o?.createdAt.includes(search) || String(o?.mortgage).includes(search) || o?.about.toLowerCase().includes(search.toLowerCase()) || o?.date.includes(search) || o?.inpDate.includes(search) || (auth?.role === 'creator' && o?.from_name?.toLowerCase()?.includes(search.toLowerCase())) || auth?.role === 'creator' && o?.from_phone?.includes(search) ?
                                                <div key={index} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] h-[90px] bg-white p-[10px_20px] mb-[20px] relative phone:mb-[10px] flex-col hover:shadow-xl">
                                                    <div className="flex items-center justify-between w-full">
                                                        {
                                                            o?.status === 'reject' ?
                                                                <BiXCircle className="text-red-500 text-[30px]" />
                                                                : o?.status === 'note' ?
                                                                    <BiTimer className="text-orange-500 text-[30px]" />
                                                                    : o?.status === 'pending' ?
                                                                        <BiTime className="text-blue-500 text-[30px]" />
                                                                        : <BiCheckCircle className="text-green-500 text-[30px]" />
                                                        }
                                                        <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                                        <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                                        <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} />
                                                    </div>
                                                    <div className="flex items-center justify-between w-full border-t">
                                                        <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o?.createdAt}</p>
                                                        {o?.status === 'pending' || o?.status === 'success' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.date}</p>
                                                            : o?.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.toDate}</p> : null}
                                                    </div>
                                                </div> : null
                                        )
                                    })

                                }
                            </>
                    }
                </>

            }

            <OrderAdd open={openAdd} setOpen={setOpenAdd} />
            <OrderEdit state={select} setState={setSelect} />
        </div>
    );
}

export default Orders;
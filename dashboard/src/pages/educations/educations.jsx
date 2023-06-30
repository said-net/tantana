import { Button, IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiBox, BiPlusCircle, BiSearch, BiTime, BiXCircle, BiCheckCircle } from 'react-icons/bi';
import { AiFillEye } from 'react-icons/ai'
import EducationAdd from "./educationadd";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import Formatter from "../../components/formatter";
import EducationView from "./educationview";
import Cities from '../../components/cities.json';
import Regions from '../../components/regions.json';
function Educations() {
    const [search, setSearch] = useState('');
    const [openadd, setOpenAdd] = useState(false);
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.order);
    const [select, setSelect] = useState({});
    const [filter, setFilter] = useState('');
    const [date, setDate] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/education/get-all`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { data } = res.data;
            setState(data[0] ? data : []);
            setIsLoad(true);
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            {!isLoad ?
                <div className="flex items-center justify-start w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px]">
                    <Spinner />
                    <h1>KUTING...</h1>
                </div>
                : !state[0] ?
                    <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px]">
                        <h1 className="flex items-center">
                            <BiBox />
                            BUYURTMALR MAVJUD EMAS</h1>
                        <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                            <BiPlusCircle />
                        </IconButton>
                    </div>
                    :
                    <>
                        <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                            <div className="flex items-center justify-center w-[250px] ">
                                <Input type="search" label="Viloyat, tuman, maktab ..." onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                            </div>
                            <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                                <BiPlusCircle />
                            </IconButton>
                        </div>
                        <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_5px] mb-[20px] phone:mb-[10px] tablet:flex-col">
                            <div className="flex items-center w-[200px] tablet:w-full tablet:mb-[10px]">
                                <Input value={filter.date} type="date" label="Sana bo'yicha filter" onChange={e => setDate(e.target.value)} />
                            </div>
                            <div className="flex items-center w-[200px] tablet:w-full tablet:mb-[10px]">
                                <Select value={filter} label="Status bo'yicha filter" onChange={e => setFilter(e)}>
                                    <Option value="rejected">
                                        <BiXCircle className="inline text-[20px] text-red-500" />
                                        Bekor qilingan
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
                            <Button color="orange" onClick={() => { setDate(''); setFilter('') }}>Tozalash</Button>
                        </div>
                        <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_5px] mb-[20px] phone:mb-[10px] tablet:flex-col">
                            <div className="flex items-center w-[200px] tablet:w-full tablet:mb-[10px]">
                                <Select value={region} label="Viloyat bo'yicha filter" onChange={e => setRegion(e)}>
                                    {
                                        Regions.map((e, key) => {
                                            return (
                                                <Option key={key} value={`${e?.id}`}>{e?.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="flex items-center w-[200px] tablet:w-full tablet:mb-[10px]">
                                <Select value={region} label="Viloyat bo'yicha filter" onChange={e => setCity(e)}>
                                    {
                                        Cities?.filter(e => e?.region_id === +region)?.map((e, key) => {
                                            return (
                                                <Option key={key} value={`${e.id}`}>{e.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <Button color="orange" onClick={() => { setRegion(''); setCity('') }}>Tozalash</Button>
                        </div>
                    </>
            }
            {isLoad && state[0] && region && city ?
                state.map((o, key) => {
                    return (
                        +region === o?.region && +city === o?.city ?
                            <div onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} key={key} className={`flex flex-col items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] cursor-pointer ${o?.status === 'pending' ? 'border-blue-500' : o?.status === 'rejected' ? 'border-red-500' : 'border-green-500'} border`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        {
                                            o?.status === 'rejected' ?
                                                <BiXCircle className="text-red-500 text-[30px]" />
                                                : o?.status === 'pending' ?
                                                    <BiTime className="text-blue-500 text-[30px]" />
                                                    : <BiCheckCircle className="text-green-500 text-[30px]" />
                                        }
                                        <p className="ml-[15px]">{o.education}</p>
                                    </div>
                                    <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                    <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                    <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-between w-full border-t">
                                    <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o?.createdAt}</p>
                                    {o?.status === 'pending' || o?.status === 'success' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.date}</p>
                                        : o?.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.toDate}</p> : null}
                                </div>
                            </div> : null
                    )
                })
                : !search && !filter && !date ?
                    state.map((o, key) => {
                        return (
                            <div onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} key={key} className={`flex flex-col items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] cursor-pointer ${o?.status === 'pending' ? 'border-blue-500' : o?.status === 'rejected' ? 'border-red-500' : 'border-green-500'} border`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        {
                                            o?.status === 'rejected' ?
                                                <BiXCircle className="text-red-500 text-[30px]" />
                                                : o?.status === 'pending' ?
                                                    <BiTime className="text-blue-500 text-[30px]" />
                                                    : <BiCheckCircle className="text-green-500 text-[30px]" />
                                        }
                                        <p className="ml-[15px]">{o.education}</p>
                                    </div>
                                    <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                    <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                    <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-between w-full border-t">
                                    <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o?.createdAt}</p>
                                    {o?.status === 'pending' || o?.status === 'success' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.date}</p>
                                        : o?.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.toDate}</p> : null}
                                </div>
                            </div>
                        )
                    })
                    : date ?
                        state.map((o, key) => {
                            return (
                                date === o?.inpDate ?
                                    <div onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} key={key} className={`flex flex-col items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] cursor-pointer ${o?.status === 'pending' ? 'border-blue-500' : o?.status === 'rejected' ? 'border-red-500' : 'border-green-500'} border`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                {
                                                    o?.status === 'rejected' ?
                                                        <BiXCircle className="text-red-500 text-[30px]" />
                                                        : o?.status === 'pending' ?
                                                            <BiTime className="text-blue-500 text-[30px]" />
                                                            : <BiCheckCircle className="text-green-500 text-[30px]" />
                                                }
                                                <p className="ml-[15px]">{o.education}</p>
                                            </div>
                                            <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                            <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                            <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" />
                                        </div>
                                        <div className="flex items-center justify-between w-full border-t">
                                            <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o?.createdAt}</p>
                                            {o?.status === 'pending' || o?.status === 'success' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.date}</p>
                                                : o?.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.toDate}</p> : null}
                                        </div>
                                    </div> : null
                            )
                        }) :
                        search && !filter && !date ?
                            state.map((o, key) => {
                                return (
                                    o?.education?.toLowerCase()?.includes(search?.toLowerCase()) || o?.from_name?.toLowerCase()?.includes(search?.toLowerCase()) || String(o?.price).includes(search) || String(o?.mortgage)?.includes(search) || o?.toDate?.includes(search) || o?.inpDate?.includes(search) ?
                                        <div onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} key={key} className={`flex flex-col items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] cursor-pointer ${o?.status === 'pending' ? 'border-blue-500' : o?.status === 'rejected' ? 'border-red-500' : 'border-green-500'} border`}>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    {
                                                        o?.status === 'rejected' ?
                                                            <BiXCircle className="text-red-500 text-[30px]" />
                                                            : o?.status === 'pending' ?
                                                                <BiTime className="text-blue-500 text-[30px]" />
                                                                : <BiCheckCircle className="text-green-500 text-[30px]" />
                                                    }
                                                    <p className="ml-[15px]">{o.education}</p>
                                                </div>
                                                <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                                <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                                <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" />
                                            </div>
                                            <div className="flex items-center justify-between w-full border-t">
                                                <p className="text-blue-gray-500 phone:text-[12px]">Saqlandi: {o?.createdAt}</p>
                                                {o?.status === 'pending' || o?.status === 'success' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.date}</p>
                                                    : o?.status === 'note' ? <p className="text-blue-gray-500 phone:text-[12px]">Qachonga: {o?.toDate}</p> : null}
                                            </div>
                                        </div> : null
                                )
                            }) :
                            state.map((o, key) => {
                                return (
                                    (o?.education?.toLowerCase()?.includes(search?.toLowerCase()) || o?.from_name?.toLowerCase()?.includes(search?.toLowerCase()) || String(o?.price).includes(search) || String(o?.mortgage)?.includes(search) || o?.toDate?.includes(search) || o?.inpDate?.includes(search)) && filter === o?.status ?
                                        <div onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} key={key} className={`flex flex-col items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] cursor-pointer ${o?.status === 'pending' ? 'border-blue-500' : o?.status === 'rejected' ? 'border-red-500' : 'border-green-500'} border`}>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    {
                                                        o?.status === 'rejected' ?
                                                            <BiXCircle className="text-red-500 text-[30px]" />
                                                            : o?.status === 'pending' ?
                                                                <BiTime className="text-blue-500 text-[30px]" />
                                                                : <BiCheckCircle className="text-green-500 text-[30px]" />
                                                    }
                                                    <p className="ml-[15px]">{o.education}</p>
                                                </div>
                                                <p className="w-[20%] phone:w-[50%] phone:text-center"><Formatter value={o?.price} /></p>
                                                <p className="w-[20%] phone:hidden ">Hizmatlar: {o?.services[0] ? o?.services.length : 0}</p>
                                                <AiFillEye className="text-blue-gray-600 text-[20px] cursor-pointer" />
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
            <EducationAdd open={openadd} setOpen={setOpenAdd} />
            <EducationView state={select} setState={setSelect} />
        </div>
    );
}

export default Educations;
import { IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
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
function Educations() {
    const [search, setSearch] = useState('');
    const [openadd, setOpenAdd] = useState(false);
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.order);
    const [select, setSelect] = useState({});
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
                    <div className="flex items-center justify-start w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px]">
                        <BiBox />
                        <h1>BUYURTMALR MAVJUD EMAS</h1>
                    </div>
                    :
                    <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                        <div className="flex items-center justify-center w-[250px] ">
                            <Input type="search" label="Viloyat, tuman, maktab ..." onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                        </div>
                        <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                            <BiPlusCircle />
                        </IconButton>
                    </div>
            }
            {isLoad && state[0] && !search ?
                state.map((o, key) => {
                    return (
                        <div onClick={() => setSelect({ ...select, open: true, ...o, old: { ...o } })} key={key} className={`flex flex-col items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] cursor-pointer ${o?.status === 'pending' ? 'border-blue-500' : o?.status === 'rejected' ? 'border-red-500' : 'border-green-500'} border`}>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    {
                                        o?.status === 'reject' ?
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
                : null

            }
            <EducationAdd open={openadd} setOpen={setOpenAdd} />
            <EducationView state={select} setState={setSelect}/>
        </div>
    );
}

export default Educations;
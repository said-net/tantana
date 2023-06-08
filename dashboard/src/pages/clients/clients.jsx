import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API } from "../../cfg";
import { IconButton, Input, Spinner } from "@material-tailwind/react";
import { BiPlusCircle, BiSearch } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import ClientEdit from "./editclient";
import ClientAdd from "./addclient";

function Clients() {
    const [clients, setClients] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    // eslint-disable-next-line
    const [search, setSearch] = useState('');
    const { refresh } = useSelector(e => e.client);
    // eslint-disable-next-line
    const [openAdd, setOpenAdd] = useState(false);
    const [select, setSelect] = useState({ _id: 'test' });
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/client/getall`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true)
            if (ok) {
                setClients(data);
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }, [refresh]);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                <div className="flex items-center justify-center w-[250px] ">
                    <Input type="search" label="Ismi, Raqami, Manzili" onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                </div>
                <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                    <BiPlusCircle />
                </IconButton>
            </div>
            {
                !isLoad ?
                    <div className="flex items-center justify-start w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] phone:flex-col">
                        <Spinner /> <p>Kuting...</p>
                    </div>
                    : !clients[0] ?
                        <div className="flex items-center justify-start w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px] phone:flex-col">
                            <p>SIZDA MIJOZLAR YO'Q</p>
                        </div>
                        : !search ?
                            clients.map((c, key) => {
                                return (
                                    <div key={key} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                                        <p className="w-[20%]">{c.name}</p>
                                        <p className="w-[20%]">{c.phone}</p>
                                        <AiFillEye className="cursor-pointer text-[25px] text-blue-gray-700" onClick={() => setSelect(c)} />
                                    </div>
                                );
                            })
                            :
                            clients.map((c, key) => {
                                return (
                                    c?.name?.toLowerCase()?.includes(search?.toLowerCase()) || c?.location?.toLowerCase()?.includes(search?.toLowerCase()) || c?.phone?.includes(search) ?
                                        <div key={key} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                                            <p className="w-[20%]">{c.name}</p>
                                            <p className="w-[20%]">{c.phone}</p>
                                            <AiFillEye className="cursor-pointer text-[25px] text-blue-gray-700" onClick={() => setSelect(c)} />
                                        </div> : null
                                );
                            })

            }
            <ClientEdit select={select} setSelect={setSelect} />
            <ClientAdd setOpen={setOpenAdd} open={openAdd} />
        </div>
    );
}

export default Clients;
import { IconButton, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiPlusCircle, BiSearch } from "react-icons/bi";
import ServiceAdd from "./addservices";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import ServiceEdit from "./editservice";

function Services() {
    const [openAdd, setOpenAdd] = useState(false);
    const [search, setSearch] = useState(false);
    const [state, setState] = useState([]);
    const { refresh } = useSelector(e => e.service);
    const [select, setSelect] = useState({ open: false });
    useEffect(() => {
        axios(`${API}/service/getall`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            if (ok)
                setState(data);
        }).catch(() => {
            toast.warning("Aloqani tekshirib sahifani yangilang!");
        });
    }, [refresh]);

    document.title = "TANTANA - HIZMATLARI " + state?.length + " TA"
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                <div className="flex items-center justify-center w-[250px] ">
                    <Input type="search" label="Hizmat nomi" onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                </div>
                <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                    <BiPlusCircle />
                </IconButton>
            </div>
            {!state[0] ?
                <h1>HIZMATLAR MAVJUD EMAS</h1>
                :
                !search ?
                    state.map((e, index) => {
                        return (
                            <div key={index} onClick={() => setSelect({ ...select, open: true, ...e, oldTitile: e.title, oldAbout: e.about })} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[5px] hover:shadow-xl duration-500 cursor-pointer">
                                <h1 className="hidden phone:inline">{e?.title?.length > 15 ? e?.title.slice(0, 12) + '...' : e?.title}</h1>
                                <h1 className="inline phone:hidden">{e?.title}</h1>
                                <IconButton className="rounded-full text-[25px]" color="blue-gray" >
                                    ?
                                </IconButton>
                            </div>
                        );
                    })
                    :
                    state.map((e, index) => {
                        return (
                            e?.title?.toLowerCase()?.includes(search.toLowerCase()) || e?.about?.toLowerCase()?.includes(search.toLowerCase()) ?
                                <div key={index} onClick={() => setSelect({ ...select, open: true, ...e, oldTitile: e.title, oldAbout: e.about })} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[5px] hover:shadow-xl duration-500 cursor-pointer">
                                    <h1 className="hidden phone:inline">{e?.title?.length > 15 ? e?.title.slice(0, 12) + '...' : e?.title}</h1>
                                    <h1 className="inline phone:hidden">{e?.title}</h1>
                                    <IconButton className="rounded-full text-[25px]" color="blue-gray" >
                                        ?
                                    </IconButton>
                                </div> : null
                        );
                    })
            }
            <ServiceAdd open={openAdd} setOpen={setOpenAdd} />
            <ServiceEdit select={select} setSelect={setSelect} />
        </div>
    );
}

export default Services;
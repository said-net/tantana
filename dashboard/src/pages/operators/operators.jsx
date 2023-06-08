import { IconButton, Input, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiEdit, BiPencil, BiPlusCircle, BiSearch, BiTrash } from "react-icons/bi";
import OperatorAdd from "./addoperator";
import { useSelector } from "react-redux";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import OperatorEdit from "./editoperator";
import OperatorDelete from "./deleteoperator";

function Operators() {
    const [openAdd, setOpenAdd] = useState(false);
    const [operators, setOperators] = useState([]);
    const { refresh } = useSelector(e => e.operator);
    const [select, setSelect] = useState({ del: false, edit: false, _id: '', full_name: '', super: false, phone: '', password: '' });
    const [search, setSearch] = useState('');
    document.title = "TANTANA - OPERATORLAR"
    useEffect(() => {
        axios(`${API}/admin/get-admins`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            if (ok)
                setOperators(data);
            console.log(data);
        }).catch(() => {
            toast.warning("Aloqani tekshirib sahifani yangilang!");
        })
    }, [refresh])
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                <div className="flex items-center justify-center w-[250px] ">
                    <Input type="search" label="Ismi, Raqami" onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                </div>
                <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                    <BiPlusCircle />
                </IconButton>
            </div>
            {!operators[0] ?
                <h1>OPERATORLAR MAVJUD EMAS</h1>
                :
                !search ?
                    operators.map(({ _id, full_name, phone, role }, index) => {
                        return (
                            <div key={index} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[5px] relative">
                                <p className="absolute top-0 left-0 p-[0_5px] text-[14px] bg-blue-gray-400 rounded-[10px] text-[white]">{role === 'operator' ? "OPERATOR" : "HAMKOR"}</p>
                                <h1 className="w-[30%] phone:hidden">{full_name}</h1>
                                <h1 className="w-[30%] hidden phone:inline">{full_name.length>9?full_name.slice(0,9)+'...':full_name}</h1>
                                <h1 className="w-[30%] phone:text-[13px] text-center">{phone}</h1>
                                <div className="flex w-[30%] items-center justify-end">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton color="blue-gray">
                                                <BiEdit className="text-[20px]" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, edit: true, _id, full_name, phone, old: role, role })}>
                                                <BiPencil className="text-[20px] mr-[10px]" /> Taxrirlash
                                            </MenuItem>
                                            <MenuItem className="flex items-center text-red-800" onClick={() => setSelect({ ...select, del: true, _id, full_name })}>
                                                <BiTrash className="text-[20px] mr-[10px]" /> O'chirish
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>
                        );
                    }) :
                    operators.map(({ _id, full_name, phone, role }, index) => {
                        return (
                            full_name?.toLowerCase()?.includes(search.toLowerCase()) || phone?.toLowerCase()?.includes(search.toLowerCase()) ?
                                <div key={index} className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[5px] relative">
                                    <p className="absolute top-0 left-0 p-[0_5px] text-[14px] bg-blue-gray-400 rounded-[10px] text-[white]">{role === 'operator' ? "OPERATOR" : "HAMKOR"}</p>
                                    <h1 className="w-[30%] phone:text-[13px]">{full_name}</h1>
                                    <h1 className="w-[30%] phone:text-[13px] text-center">{phone}</h1>
                                    <div className="flex w-[30%] items-center justify-end">
                                        <Menu>
                                            <MenuHandler>
                                                <IconButton color="blue-gray">
                                                    <BiEdit className="text-[20px]" />
                                                </IconButton>
                                            </MenuHandler>
                                            <MenuList>
                                                <MenuItem className="flex items-center" onClick={() => setSelect({ ...select, edit: true, _id, full_name, phone, old: role, role })}>
                                                    <BiPencil className="text-[20px] mr-[10px]" /> Taxrirlash
                                                </MenuItem>
                                                <MenuItem className="flex items-center text-red-800" onClick={() => setSelect({ ...select, del: true, _id, full_name })}>
                                                    <BiTrash className="text-[20px] mr-[10px]" /> O'chirish
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </div>
                                </div> : null
                        );
                    })
            }
            <OperatorAdd open={openAdd} setOpen={setOpenAdd} />
            <OperatorEdit select={select} setSelect={setSelect} />
            <OperatorDelete select={select} setSelect={setSelect} />
        </div>
    );
}

export default Operators;
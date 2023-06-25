import { Badge, Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { BiBook, BiBox, BiExit, BiMenuAltRight, BiUserCircle, BiUserPlus } from "react-icons/bi";
import { AiFillBook, AiFillDashboard, AiFillPhone, AiFillPlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthRefresh } from "../manager/authManager";
import { HiBell } from 'react-icons/hi'
import { useState } from "react";
import axios from "axios";
import { API } from "../cfg";
import { useEffect } from "react";
function Navbar() {
    const admin = useSelector(e => e.auth);
    const nv = useNavigate();
    const dp = useDispatch();
    const [notes, setNotes] = useState(0);
    function Leave() {
        localStorage.removeItem('access');
        setTimeout(() => {
            dp(setAuthRefresh());
        }, 1500)
    }
    useEffect(() => {
        if (admin?.role === 'partner') {
            axios(`${API}/partner/get-notes`, {
                headers: {
                    'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                setNotes(res?.data?.data?.length);
            });
        } else {
            axios(`${API}/order/getnotes/now/note`, {
                headers: {
                    'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                setNotes(res?.data?.data?.length);
            });
        }
    }, []);
    return (
        <div className="flex items-center justify-center h-[100px] w-full">
            <nav className="fixed top-0 left-0 w-full h-[100px] bg-white shadow-[0_10px_20px] shadow-[#0000000b] flex items-center justify-between p-[0_2%] z-[999]">
                <h1 onClick={() => nv('/')} className="text-blue-gray-800 uppercase text-[30px] relative phone:text-[17px]">
                    {admin?.full_name}
                    <Chip value={admin?.role === 'creator' ? "BOSHLIQ" : admin?.role === 'operator' ? "OPERATOR" : "HAMKOR"} color="green" className="absolute bottom-[-25px]" />
                </h1>
                <div className="flex items-center justify-center">
                    <Badge content={!notes ? 0 : notes} color="orange">
                        <IconButton onClick={() => nv('/notes')} color="green" className="rounded-full text-[25px]">
                            <HiBell />
                        </IconButton>
                    </Badge>
                    <Menu>
                        <MenuHandler>
                            <IconButton className=" text-[25px] mx-[20px]">
                                <BiMenuAltRight />
                            </IconButton>
                        </MenuHandler>
                        <MenuList className="w-[260px]">
                            <MenuItem className="flex text-[20px] items-center uppercase" onClick={() => nv('/')}>
                                <AiFillDashboard className="mr-[10px]" />
                                Statistika
                            </MenuItem>
                            {admin?.role === 'creator' ?
                                <MenuItem className="flex text-[20px] items-center uppercase" onClick={() => nv('/services')}>
                                    <AiFillBook className="mr-[10px]" />
                                    Hizmatlar
                                </MenuItem> : null
                            }
                            {admin?.role === 'creator' ?
                                <MenuItem className="flex text-[20px] items-center uppercase" onClick={() => nv('/admins')}>
                                    <AiFillPhone className="mr-[10px]" />
                                    Adminlar
                                </MenuItem> : null
                            }
                            <MenuItem className="flex text-[20px] items-center uppercase text-light-blue-700" onClick={() => nv('/orders')}>
                                <AiFillPlusCircle className="mr-[10px]" />
                                Buyurtmalar
                            </MenuItem>
                            <MenuItem className="flex text-[20px] items-center uppercase text-green-700" onClick={() => nv('/clients')}>
                                <BiUserCircle className="mr-[10px]" />
                                Haridorlar
                            </MenuItem>
                            <MenuItem className="flex text-[20px] items-center uppercase text-green-700" onClick={() => nv('/educations')}>
                                <BiBook className="mr-[10px]" />
                                Ta'lim
                            </MenuItem>
                            {admin?.role === 'operator' || admin?.role === 'creator' ?
                                <MenuItem className="flex text-[20px] items-center uppercase text-orange-700" onClick={() => nv('/partner-clients')}>
                                    <BiUserPlus className="mr-[10px]" />
                                    H-Haridorlar
                                </MenuItem> : null
                            }
                            {admin?.role === 'operator' || admin?.role === 'creator' ?
                                <MenuItem className="flex text-[20px] items-center uppercase text-teal-700" onClick={() => nv('/partner-orders')}>
                                    <BiBox className="mr-[10px]" />
                                    H-Buyurtmalar
                                </MenuItem> : null
                            }
                        </MenuList>
                    </Menu>
                    <IconButton onClick={Leave} className="rounded-full text-[25px]" color="orange">
                        <BiExit />
                    </IconButton>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiHome, BiPhone, BiUser } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshOperator } from "../../manager/operatorManager";
import Cities from '../../components/cities.json';
import Regions from '../../components/regions.json';
function EducationAdd({ open, setOpen }) {
    const [state, setState] = useState({ type: '', region: '', city: '', education: '', class_room: '', teacher: '',phone:'+998', students: 0, services: '', mortgage: 0, price: 0 });
    const [disabled, setDisablet] = useState(false);
    const dp = useDispatch();
    console.log(state);
    function Submit() {
        setDisablet(true)
        axios.post(`${API}/admin/create-admin`, state, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisablet(false);
            if (!ok)
                toast.error(msg);
            else {
                toast.success(msg);
                setState({ full_name: '', phone: '+998', password: '', role: '' });
                setOpen(false);
                dp(setRefreshOperator());
            }
        }).catch(() => {
            setDisablet(false);
            toast.warning("Aloqa mavjud emas! Internetga ulanganlikni tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] text-blue-gray-800">TA'LIM UCHUN HIZMAT</h1>
                </DialogHeader>
                <DialogBody className="w-full h-[400px] overflow-y-scroll border-y">
                    {/* <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} value={state.full_name} label="F.I ni kiriting!" required icon={<BiUser />} onChange={e => setState({ ...state, full_name: e.target.value })} />
                    </div> */}
                    <div className="flex items-center justify-start flex-col w-full">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Select disabled={disabled} label="Muassasa turi" onChange={e => setState({ ...state, type: e })} value={state.type}>
                                <Option value="mtm">MTM/Bog'cha</Option>
                                <Option value="school">Maktab</Option>
                                <Option value="collage">Kollej/Litsey</Option>
                                <Option value="otm">OTM</Option>
                                <Option value="military">HARBIY HIZMAT(Voenniy chas)</Option>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Select disabled={!state.type || disabled} label="Viloyat" onChange={e => setState({ ...state, region: e })} value={state.region}>
                                {
                                    Regions.map((e, key) => {
                                        return (
                                            <Option key={key} value={`${e.id}`}>{e.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        {
                            state.region ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Select disabled={disabled} label="Tuman/Shaxar" onChange={e => setState({ ...state, city: e })} value={state.city}>
                                        {
                                            Cities?.filter(e => e.region_id === +state.region)?.map((e, key) => {
                                                return (
                                                    <Option key={key} value={`${e.id}`}>{e.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div> : null
                        }
                        {
                            state.city ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input disabled={disabled} value={state.education} label="Muassasa nomi" required icon={<BiHome />} onChange={e => setState({ ...state, education: e.target.value })} />
                                </div> : null
                        }
                        {
                            state.education ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input disabled={disabled} value={state.class_room} label="Sinfi/Kursi/Guruhi" required icon={<BiUser />} onChange={e => setState({ ...state, class_room: e.target.value })} />
                                </div> : null
                        }
                        {
                            state.class_room ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input disabled={disabled} value={state.students} label="O'quvchi soni" required icon={<FaUsers />} onChange={e => setState({ ...state, students: e.target.value })} />
                                </div> : null
                        }
                        {
                            state.students ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input disabled={disabled} value={state.teacher} label="Rahbar F.I si" required icon={<BiUser />} onChange={e => setState({ ...state, teacher: e.target.value })} />
                                </div> : null
                        }
                        {
                            state.teacher ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input disabled={disabled} value={state.phone} label="Rahbar raqami" required icon={<BiPhone />} onChange={e => setState({ ...state, phone: e.target.value })} />
                                </div> : null
                        }
                    </div>
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setOpen(false)}>
                        Bekor qilish
                    </Button>
                    <Button onClick={Submit}>Saqlash</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default EducationAdd;
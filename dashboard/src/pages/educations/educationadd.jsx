import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Switch } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiHome, BiMoney, BiPhone, BiUser } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Cities from '../../components/cities.json';
import Regions from '../../components/regions.json';
import Formatter from "../../components/formatter";
import { setRefreshOrder } from "../../manager/orderManager";
function EducationAdd({ open, setOpen }) {
    const [state, setState] = useState({ type: '', region: '', city: '', education: '', class_room: '', teacher: '', phone: '+998', students: 0, services: [], mortgage: 0, price: 0, date: '' });
    const [disabled, setDisablet] = useState(false);

    const [services, setServices] = useState([]);
    const dp = useDispatch();
    useEffect(() => {
        axios(`${API}/service/getall`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            if (ok) {
                setServices(data);
            }
        });
    }, []);
    function addService(s, type) {
        const { services: ser } = state;
        if (type) {
            ser.push({ ...s, price: 0 });
            setState({ ...state, services: ser, });
        } else {
            let filtered = ser.filter(e => { return e._id !== s._id });
            setState({ ...state, services: filtered, });
        }
    }
    function addServicePrice(price, _id) {
        const service = state?.services?.find(e => e._id === _id);
        console.log(service);
        let filtered = state?.services.filter(e => { return e._id !== _id });
        setState({ ...state, services: [...filtered, { ...service, price }] });
        // console.log(state.services);
    }
    useEffect(() => {
        let p = 0;
        state?.services?.forEach(({ price }) => {
            p += +price
        });
        setState({ ...state, price: p });
    }, [state.services]);
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
                setState({type: '', region: '', city: '', education: '', class_room: '', teacher: '', phone: '+998', students: 0, services: [], mortgage: 0, price: 0 });
                setOpen(false);
                dp(setRefreshOrder());
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
                        {
                            state.teacher ?
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input type="date" disabled={disabled} label="Qaysi sanaga" required  onChange={e => setState({ ...state, date: e.target.value })} />
                                </div> : null
                        }
                        {
                            services[0] && state?.phone?.length > 12 ?
                                <>
                                    <h1 className="border-t w-full text-center">Barcha hizmatlar: {services.length} ta</h1>
                                    {
                                        services.map((e, index) => {
                                            return (
                                                <label htmlFor={index + 1} key={index} className="w-[95%] mb-[10px] items-center justify-between flex">
                                                    {e.title}
                                                    <div className="flex items-center justify-center">
                                                        {state.services.find(s => s._id === e._id) ?
                                                            <input className="w-[120px] h-[30px] p-[0_10px] mr-[10px] rounded border border-blue-gray-700" placeholder="Narxi" type="number" onChange={i => { addServicePrice(i.target.value.trim(), e._id) }} /> : null
                                                        }
                                                        <Switch checked={state?.services?.find(ss => ss._id === e._id)} id={index + 1} onChange={(c) => addService(e, c.target.checked)} />
                                                    </div>
                                                </label>
                                            )
                                        })
                                    }
                                    <div className="flex items-center justify-center w-full mb-[10px]">
                                        <Input disabled={disabled} type="number" label="Oldindan to'lov(Zaklad)" required onChange={e => setState({ ...state, mortgage: e.target.value.trim() })} value={state.mortgage} icon={<BiMoney />} />
                                    </div>
                                </> : null
                            // <p>Hizmatlar mavjud emas!</p>
                        }
                        {
                            state.services[0] ?
                                <>
                                    <h1 className="border-t w-full text-center">Qo'shilgan hizmatlar: {state?.services?.length} ta</h1>
                                    {
                                        state?.services?.map((s, key) => {
                                            return (
                                                <div key={key} className="flex items-center justify-between w-full">
                                                    <p>{key + 1}: {s.title}</p>
                                                    <p><b><Formatter value={s.price} /></b></p>
                                                </div>
                                            )
                                        })
                                    }
                                    <h1 className="w-full flex items-center justify-between py-[10px] border-y">Jami hizmatlar narxi: <b><Formatter value={isNaN(state.price) ? '0' : state.price} /></b></h1>
                                </> : null
                            // <h1>Hizmatlar qo'shilmadi!</h1>
                        }
                        <h1 className="w-full flex items-center justify-between py-[10px] border-b">Oldindan to'lov(Zaklad): <b><Formatter value={state.mortgage} /></b></h1>
                        {state.price > 0 ?
                            <h1 className="w-full flex items-center justify-between py-[10px] border-b">Qolgan to'lov: <b><Formatter value={state.price - state.mortgage} /></b></h1>
                            : null
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
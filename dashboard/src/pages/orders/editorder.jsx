import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Switch, Textarea } from "@material-tailwind/react";
// import axios from "axios";
import { useEffect, useState } from "react";
import { BiInfoCircle, BiLocationPlus, BiMoney, BiPhone, BiUser } from "react-icons/bi";
// import { API } from "../../cfg";
// import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// import { setRefreshOrder } from "../../manager/orderManager";
import Formatter from "../../components/formatter";
import axios from "axios";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { setRefreshOrder } from "../../manager/orderManager";

function OrderEdit({ state, setState }) {
    const [disablet, setDisablet] = useState(true);
    // const [services, setServices] = useState([]);
    const admin = useSelector(e => e.auth)
    const dp = useDispatch();
    const [select, setSelect] = useState({ status: '', _id: '' });
    const [disStatus, setDisStatus] = useState(false);
    // function Submit() {
    //     setDisablet(true);
    //     axios.post(`${API}/order/create`, state, {
    //         headers: {
    //             'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
    //         }
    //     }).then(res => {
    //         const { ok, msg } = res.data;
    //         setDisablet(false);
    //         if (!ok) {
    //             toast.warning(msg);
    //         } else {
    //             toast.success(msg);
    //             setState({ open: false, name: '', location: '', about: '', phone: '+998', type: '', date: '', services: [], price: 0, mortgage: 0, status: '', note: '86400' });
    //             dp(setRefreshOrder());
    //         }
    //     }).catch(() => {
    //         setDisablet(false);
    //         toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
    //     });
    // }
    // useEffect(() => {
    //     axios(`${API}/service/getall`, {
    //         headers: {
    //             'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
    //         }
    //     }).then(res => {
    //         const { ok, data } = res.data;
    //         if (ok) {
    //             setServices(data);
    //         }
    //     });
    // }, []);
    // function addService(s, type) {
    //     const { services: ser } = state;
    //     if (type) {
    //         ser.push({ ...s, price: 0 });
    //         setState({ ...state, services: ser });
    //     } else {
    //         let filtered = ser.filter(e => { return e._id !== s._id });
    //         setState({ ...state, services: filtered });
    //     }
    // }
    // function addServicePrice(price, _id) {
    //     const service = state?.services?.find(e => e._id === _id);
    //     let filtered = state?.services.filter(e => { return e._id !== _id });
    //     setState({ ...state, services: [...filtered, { ...service, price }] });
    // }
    // useEffect(() => {
    //     let p = 0;
    //     state?.services?.forEach(({ price }) => {
    //         p += +price
    //     });
    //     setState({ ...state, price: p });
    //     console.log(state.inpDate)
    //     // if(state.status==='success'){
    //     //     setDisablet(true)
    //     // }else{
    //     //     setDisablet(false);
    //     // }
    // }, [state.services]);
    function setStatus() {
        setDisStatus(true);
        axios.put(`${API}/order/setstatus/${select._id}`, { status: select.status }, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisStatus(false);
            if (!ok) {
                toast.warning(msg)
            } else {
                setState({ open: false, name: '', location: '', about: '', phone: '+998', type: '', date: '', services: [], price: 0, mortgage: 0, status: '', note: '86400', from_name: '', from_phone: '', });
                setSelect({ status: '', _id: '' });
                toast.success(msg);
                dp(setRefreshOrder());
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
            setDisStatus(false);
        })
    }
    return (
        <>
            <Dialog open={state?.open} size="xxl" className=" min-w-[375px] flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
                <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px] text-blue-gray-800">BUYURTMANI KO'RISH</h1>
                    </DialogHeader>
                    <DialogBody className="h-[70vh] border-y-2 w-full overflow-y-scroll">
                        <div className="flex items-center justify-start flex-col w-full">
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input disabled={disablet} label="Mijoz Ismi" required onChange={e => setState({ ...state, name: e.target.value })} value={state.name} icon={<BiUser />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input disabled={disablet} label="Mijoz Raqami" required onChange={e => setState({ ...state, phone: e.target.value.trim() })} value={state.phone} icon={<BiPhone />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Input disabled={disablet} label="Mijoz Manzili" required onChange={e => setState({ ...state, location: e.target.value })} value={state.location} icon={<BiLocationPlus />} />
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Select disabled={disablet} label="Statusni tanlang!" value={state.status} onChange={e => setState({ ...state, status: e })}>
                                    <Option value="note">Eslatma</Option>
                                    <Option value="pending">Jarayonda</Option>
                                    <Option value="reject">Bekor qilindi</Option>
                                    <Option value="success">Bajarildi</Option>
                                </Select>
                            </div>
                            {/*  */}
                            {
                                !state.status ? null :
                                    state.status === 'note' ?
                                        <>
                                            <div className="flex items-center justify-center w-full mb-[10px]">
                                                <Select disabled={disablet} label="Necha kunda eslatilsin!" value={state.note} onChange={e => setState({ ...state, note: e })}>
                                                    <Option value="86400">1 KUN</Option>
                                                    <Option value="172800">2 KUN</Option>
                                                    <Option value="259200">3 KUN</Option>
                                                    <Option value="345600">4 KUN</Option>
                                                    <Option value="432000">5 KUN</Option>
                                                    <Option value="518400">6 KUN</Option>
                                                    <Option value="604800">7 KUN</Option>
                                                </Select>
                                            </div>
                                            <div className="flex items-center justify-center w-full mb-[10px]">
                                                <Textarea disabled={disablet} value={state.about} label="Batafsil ma'lumot" onChange={e => setState({ ...state, about: e.target.value })} />
                                            </div>
                                        </>
                                        : state.status === 'reject' ?
                                            <div className="flex items-center justify-center w-full mb-[10px]">
                                                <Textarea disabled={disablet} value={state.about} label="Buyurtma nima uchun bekor qilindi Batafsil yozing!" onChange={e => setState({ ...state, about: e.target.value })} />
                                            </div> :
                                            <>
                                                <Textarea disabled={disablet} value={state.about} label="Buyurtma haqida batafsilroq yozing!" onChange={e => setState({ ...state, about: e.target.value })} />
                                                <div className="flex items-center justify-center w-full mb-[10px]">
                                                    <Input disabled={disablet} type="date" label="Qaysi sanaga?" value={state?.inpDate} onChange={e => setState({ ...state, inpDate: e.target.value })} required />
                                                </div>
                                                <div className="flex items-center justify-center w-full mb-[10px]">
                                                    <Input disabled={disablet} type="number" label="Oldindan to'lov(Zaklad)" required onChange={e => setState({ ...state, mortgage: e.target.value.trim() })} value={state.mortgage} icon={<BiMoney />} />
                                                </div>
                                                {/* {
                                                services[0] ?
                                                    <>
                                                        <h1 className="border-t w-full text-center">Barcha hizmatlar: {services.length} ta</h1>
                                                        {
                                                            services.map((e, index) => {
                                                                return (
                                                                    <label htmlFor={index + 1} key={index} className="w-[95%] mb-[10px] items-center justify-between flex">
                                                                        {e.title}
                                                                        <div className="flex items-center justify-center">
                                                                            {state.services.find(s => s._id === e._id) ?
                                                                                <input className="w-[120px] h-[30px] p-[0_10px] mr-[10px] rounded border border-blue-gray-700" placeholder="Narxi" type="number" defaultValue={state?.services?.find(ser=>ser._id === e._id).price} disabled={disablet} onChange={i => { addServicePrice(i.target.value.trim(), e._id) }} /> : null
                                                                            }
                                                                            <Switch disabled={disablet} checked={state?.services?.find(ss => ss._id === e._id)} id={index + 1} onChange={(c) => addService({title: e.title, _id: e._id}, c.target.checked)} />
                                                                        </div>
                                                                    </label>
                                                                )
                                                            })
                                                        }
                                                    </> :
                                                    <p>Hizmatlar mavjud emas!</p>
                                            } */}
                                                {
                                                    !state.services[0] ?
                                                        <h1>Hizmatlar qo'shilmadi!</h1> :
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
                                                        </>
                                                }
                                                <h1 className="w-full flex items-center justify-between py-[10px] border-b">Oldindan to'lov(Zaklad): <b><Formatter value={state.mortgage} /></b></h1>
                                                {state.price > 0 ?
                                                    <h1 className="w-full flex items-center justify-between py-[10px] border-b">Qolgan to'lov: <b><Formatter value={state.price - state.mortgage} /></b></h1>
                                                    : null
                                                }
                                            </>
                            }
                            {
                                state?.status === 'pending' ?
                                    <div className="flex items-center my-[10px] justify-between w-full">
                                        <Button color="red" onClick={() => setSelect({ ...select, _id: state._id, status: 'reject' })}>RAD ETILDI</Button>
                                        <Button color="green" onClick={() => setSelect({ ...select, _id: state._id, status: 'success' })}>BAJARILDI</Button>
                                    </div>
                                    : null
                            }
                            {admin?.role === 'creator' ?
                                <>
                                    <h1>KIM TOMONIDAN QO'SHILGAN?</h1>
                                    <h1 className="w-full">Ismi: <b>{state?.from_name}</b></h1>
                                    <h1 className="w-full">Raqami: <b>{state?.from_phone}</b></h1>
                                    <h1 className="w-full">Toifa: <b>{state?.role === 'creator' ? "BOSHLIQ" : state?.role === 'operator' ? "OPERATOR" : "HAMKOR"}</b></h1>
                                </>
                                : null

                            }
                        </div>
                    </DialogBody>
                    <DialogFooter className="w-full items-center justify-end">
                        <Button variant="text" color="orange" onClick={() => setState({ open: false, name: '', from_name: '', from_phone: '', location: '', about: '', phone: '+998', type: '', date: '', services: [], price: 0, mortgage: 0, status: '', note: '86400' })}>
                            Bekor qilish
                        </Button>
                        {/* <Button disabled={disablet} onClick={Submit}>
                        Saqlash
                    </Button> */}
                    </DialogFooter>
                </div>
            </Dialog>
            <Dialog open={select.status === 'reject'} size="xxl" className=" min-w-[375px] flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
                <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px] text-blue-gray-700">BUYURTMA RAD ETILSINMI?</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p>
                            <BiInfoCircle className="inline text-[20px]" />
                            Buyurtma rad etilgach uni boshqa statusga o'tgazib bo'lmaydi va <b>RAD ETILGAN</b> statusida qat'iy qoladi!
                        </p>
                    </DialogBody>
                    <DialogFooter className="w-full flex items-center justify-between">
                        <Button variant="text" color="orange" disabled={disStatus} onClick={() => setSelect({ _id: '', status: '' })}>ORTGA</Button>
                        <Button variant="gradient" color="red" disabled={disStatus} onClick={setStatus}>STATUSNI O'RNATISH</Button>
                    </DialogFooter>
                </div>
            </Dialog>
            <Dialog open={select.status === 'success'} size="xxl" className=" min-w-[375px] flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
                <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px] text-blue-gray-700">BUYURTMA BAJARILDIMI?</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p>
                            <BiInfoCircle className="inline text-[20px]" />
                            Buyurtma bajarilganini tasdiqlaysizmi? Keyin amalni ortga qaytarib bo'lmaydi!
                        </p>
                    </DialogBody>
                    <DialogFooter className="w-full flex items-center justify-between">
                        <Button variant="text" color="orange" disabled={disStatus} onClick={() => setSelect({ _id: '', status: '' })}>ORTGA</Button>
                        <Button variant="gradient" color="green" disabled={disStatus} onClick={setStatus}>BAJARILDI DEB BELGILASH</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default OrderEdit;
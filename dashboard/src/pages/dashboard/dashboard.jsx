import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import Formatter from "../../components/formatter";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { BiFilter } from 'react-icons/bi';
import SuccessOrd from '../../assets/img/success.png'
import PendingOrd from '../../assets/img/pending_orders.png'
import RejectOrd from '../../assets/img/reject.png'
import CompanyProfit from '../../assets/img/profit_company.png'
import PendingCompany from '../../assets/img/pending_company.png'
import Profit from '../../assets/img/profit.png'
import PendingProfit from '../../assets/img/pending_profit.png'
function Dashboard() {
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState([]);
    const { role } = useSelector(e => e.auth);
    const [refresh, setRefresh] = useState(false);
    const [filter, setFilter] = useState({ open: false, filter: '' });
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/dashboard/getdashboard?date=${filter.filter}`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { data, ok } = res.data;
            setIsLoad(ok);
            if (ok) {
                setState(data);
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib sahifani qayta yangilang!");
        });
        // eslint-disable-next-line
    }, [refresh]);
    return (
        <div className="flex items-center justify-center w-full p-[10px]">
            <div className="flex z-[999] items-center justify-center fixed bottom-[20px] right-[20px]">
                <IconButton onClick={() => setFilter({ open: true })} color="blue-gray" className="rounded-full text-[20px]">
                    <BiFilter />
                </IconButton>
            </div>
            <div className="grid grid-cols-4 laptop2:grid-cols-3 tablet:grid-cols-2 tablet2:flex tablet2:flex-col tablet2:items-center tablet2:w-full tablet:justify-start">
                {/* SUCCESS */}
                <div className="flex items-center justify-center w-[250px] h-[250px] bg-green-300 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] phone:w-full phone:justify-between px-[10px] flex-col phone:flex-row">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">
                        YAKUNLANGAN BUYURTMALAR
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={SuccessOrd} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.success} />
                                </h1>
                            </>
                    }
                </div>
                {/* PENDING */}
                <div className="flex flex-col phone:flex-row items-center justify-center phone:justify-between px-[10px] w-[250px] h-[250px] bg-blue-300 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] flex-wrap phone:w-full">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">
                        JARAYONDAGI BUYURTMALAR
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={PendingOrd} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.pending} />
                                </h1>
                            </>
                    }
                </div>
                {/* REJECT */}
                <div className="flex flex-col phone:flex-row items-center justify-center phone:justify-between px-[10px] w-[250px] h-[250px] bg-red-300 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] flex-wrap phone:w-full">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">
                        RAD ETILGAN BUYURTMALAR
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={RejectOrd} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.reject} />
                                </h1>
                            </>
                    }
                </div>
                {/* PAYED */}
                <div className="flex flex-col phone:flex-row items-center justify-center phone:justify-between px-[10px] w-[250px] h-[250px] bg-light-green-500 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] flex-wrap phone:w-full">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">
                        KOMPANIYA FOYDASI
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={CompanyProfit} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.payed} />
                                </h1>
                            </>
                    }
                </div>
                {/* COMMING PAY */}
                <div className="flex flex-col phone:flex-row items-center justify-center phone:justify-between px-[10px] w-[250px] h-[250px] bg-cyan-400 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] flex-wrap phone:w-full">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">
                        KUTULAYOTGAN FOYDA(KOMPANIYA)
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={PendingCompany} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.comming_pay} />
                                </h1>
                            </>
                    }
                </div>
                {/* PROFIT */}
                <div className="flex flex-col phone:flex-row items-center justify-center phone:justify-between px-[10px] w-[250px] h-[250px] bg-teal-400 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] flex-wrap phone:w-full">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">
                        {role === 'creator' ?
                            "OPERATORLAR FOYDASI(OYLIK)"
                            :
                            "FOYDANGIZ(OYLIK)"
                        }
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={Profit} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.profit} />
                                </h1>
                            </>
                    }
                </div>
                {/*COMMING PROFIT */}
                <div className="flex flex-col phone:flex-row items-center justify-center phone:justify-between px-[10px] w-[250px] h-[250px] bg-deep-purple-400 rounded-[10px] shadow-lg phone:h-[150px] relative  m-[10px] flex-wrap phone:w-full">
                    <h1 className="absolute top-0 left-0 bg-blue-gray-400 rounded-[10px] p-[5px_10px] text-white text-[12px]">

                        {role === 'creator' ?
                            "KUTULAYOTGAN OPERATORLAR FOYDASI(OYLIK)"
                            :
                            "KUTULAYOTGAN FOYDANGIZ(OYLIK)"
                        }
                    </h1>
                    {
                        !isLoad ?
                            <Spinner color="orange" />
                            :
                            <>
                                <img src={PendingProfit} alt="Success" className="w-[140px]" />
                                <h1 className="text-[30px] text-white phone:text-[18px]">
                                    <Formatter value={state.comming_profit} />
                                </h1>
                            </>
                    }
                </div>
            </div>

            <Dialog open={filter.open} size="xxl" className="flex items-center justify-center bg-[#1a122862] backdrop-blur-sm">
                <div className="flex items-center justify-start flex-col w-[500px] bg-white rounded-[10px] phone:w-[90%]">
                    <DialogHeader className="w-full">
                        <h1 className="text-blue-gray-800 text-[18px]">FILTERLASH</h1>
                    </DialogHeader>
                    <DialogBody className="w-full">
                        <Input onChange={e => setFilter({ ...filter, filter: e.target.value })} type="month" label="Kerakli oyni tanlang!" />
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button variant="text" color="orange" className="mr-[20px]" onClick={() => setFilter({ open: false })}>
                            ortga
                        </Button>
                        <Button disabled={!filter.filter} onClick={() => { setRefresh(!refresh); setFilter({ ...filter, open: false }) }}>
                            Qabul qilish
                        </Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default Dashboard;
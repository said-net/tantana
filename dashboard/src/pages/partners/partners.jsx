import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../cfg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IconButton } from "@material-tailwind/react";
import PartnerOrderAdd from "./partnerorderadd";
import PartnerOrderEdit from "./partnerorderedit";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from "react-date-range";
function Partners() {
    const [isLoad, setIsLoad] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [calendar, setCalendar] = useState([]);
    const [select, setSelect] = useState({ open: false });
    const [days, setDays] = useState([]);
    const { refresh } = useSelector(e => e.order);
    function handleSelect(date) {
        console.log(date.getDate()); // native Date object
        console.log(date.getMonth()); // native Date object
        console.log(date.getFullYear()); // native Date object
        
    }
    useEffect(() => {
        setIsLoad(false);
        axios(`${API}/dashboard/getdashboard`, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { pending, ok, calendar } = res.data;
            setIsLoad(ok);
            if (ok) {
                setCalendar(calendar)
                setDays(pending)
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib sahifani qayta yangilang!");
        });
        // eslint-disable-next-line
    }, [refresh]);
    return (
        <div className="flex items-center justify-center w-full h-[80vh]">
            {/* <div className="grid grid-cols-7 gap-[10px] p-[10px] rounded-[20px] bg-white">
                {!calendar[0] ?
                    <h1>KUTING...</h1>
                    :
                    calendar?.map((c, key) => {
                        return (
                            <IconButton disabled={c <= new Date().getDate()} onClick={() => days.find(e => e.day === c) ? setSelect({ ...days.find(e => e.day === c), open: true }) : setOpenAdd(true)} key={key} color={days.find(e => e.day === c) ? 'green' : "gray"} className="rounded-full">
                                {c}
                            </IconButton>
                        )
                    })
                }
            </div> */}
            <Calendar
                date={new Date()}
                onChange={handleSelect}
                rangeColors={'green'}
                
            />  
            <PartnerOrderAdd open={openAdd} setOpen={setOpenAdd} />
            <PartnerOrderEdit select={select} setSelect={setSelect} />
        </div>
    );
}

export default Partners;
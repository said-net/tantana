import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import Formatter from "../../components/formatter";

function PartnerOrderEdit({ select, setSelect }) {
    return (
        <Dialog open={select?.open} size="xxl" className=" min-w-[375px] flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-blue-gray-700 text-[18px]">Buyurtmani ko'rish</h1>
                </DialogHeader>
                <DialogBody className="border-y w-full overflow-y-scroll h-[500px]">
                    <div className="flex items-start justify-start flex-col w-full">
                        <h1 className="text-[20px] font-bold w-full">BUYURTMACHI MA'LUMOTLARI</h1>
                        <p >Ismi: <b>{select?.client?.name}</b></p>
                        <p className="cursor-pointer" onClick={() => window.location.href = "tel:" + select?.client?.phone}>Raqami: <b>{select?.client?.phone}</b></p>
                        <p className="w-full">Manzili: <b>{select?.client?.location}</b></p>
                        <h1 className="text-[20px] font-bold pt-[10px] border-t mt-[10px] w-full">BUYURTMA</h1>
                        <p >Narxi: <b><Formatter value={select?.price} /></b></p>
                        <p>Oldindan(Zaklad): <b><Formatter value={select?.mortgage} /></b></p>
                        <p >Qolgan: <b><Formatter value={select?.price - select?.mortgage} /></b></p>
                        <p >Hizmatlar: <b>{select?.services}</b></p>
                        <p >Batafsil: <b>{select?.about}</b></p>
                        <p >Qachonga: <b>{select?.day < 10 ? `0${select?.day}` : select?.day}-{select?.month < 10 ? `0${select?.month}` : select?.month}-{select?.year}</b></p>
                        <h1 className="text-[20px] font-bold pt-[10px] border-t mt-[10px] w-full">QABUL QILUVCHI</h1>
                        <p >Ismi: <b>{select?.from?.full_name}</b></p>
                        <p className="cursor-pointer" onClick={() => window.location.href = "tel:" + select?.from?.phone}>Raqami: <b>{select?.from?.phone}</b></p>
                        <p className="w-full">Toifa: <b>HAMKOR</b></p>
                    </div>
                </DialogBody>
                <DialogFooter className="w-full" onClick={() => setSelect({ open: false })}>
                    <Button color="orange">Ortga</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default PartnerOrderEdit;
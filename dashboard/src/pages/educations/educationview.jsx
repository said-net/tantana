import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select } from "@material-tailwind/react";
import { API } from "../../cfg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Cities from '../../components/cities.json';
import Regions from '../../components/regions.json';
import Formatter from "../../components/formatter";
import { setRefreshOrder } from "../../manager/orderManager";
function EducationView({ state, setState }) {

    const disabled = true;
    const dp = useDispatch();
    return (
        <Dialog open={state?._id} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className="w-full">
                    <h1 className="text-[20px] text-blue-gray-800">TA'LIM UCHUN HIZMAT</h1>
                </DialogHeader>
                <DialogBody className="w-full h-[400px] overflow-y-scroll border-y">
                    {/* <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} value={state?.full_name} label="F.I ni kiriting!" required icon={<BiUser />} onChange={e => setState({ ...state, full_name: e.target.value })} />
                    </div> */}
                    <div className="flex items-center justify-start flex-col w-full">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Select disabled={disabled} label="Muassasa turi" onChange={e => setState({ ...state, type: e })} value={state?.type}>
                                <Option value="mtm">MTM/Bog'cha</Option>
                                <Option value="school">Maktab</Option>
                                <Option value="collage">Kollej/Litsey</Option>
                                <Option value="otm">OTM</Option>
                                <Option value="military">HARBIY HIZMAT(Voenniy chas)</Option>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={Regions.find(e => e.id === state?.region)?.name} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={Cities.find(e => e.id === state?.city)?.name} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={state?.education} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={state?.class_room} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={state?.students} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={state?.name} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input disabled value={state?.phone} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="date" disabled value={state?.inpDate} />
                        </div>
                        {
                            !state?.services ?
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
                                    <h1 className="w-full flex items-center justify-between py-[10px] border-y">Jami hizmatlar narxi: <b><Formatter value={isNaN(state?.price) ? '0' : state?.price} /></b></h1>
                                </>
                        }
                        <h1 className="w-full flex items-center justify-between py-[10px] border-b">Oldindan to'lov(Zaklad): <b><Formatter value={state?.mortgage} /></b></h1>
                        {state?.price > 0 ?
                            <h1 className="w-full flex items-center justify-between py-[10px] border-b">Qolgan to'lov: <b><Formatter value={state?.price - state?.mortgage} /></b></h1>
                            : null
                        }
                    </div>
                    {
                        state?.status === 'pending' ?
                            <div className="flex items-center justify-between w-full mt-[10px]">
                                <Button color="red">Rad etildi</Button>
                                <Button color="green">Bajarildi</Button>
                            </div> :
                            state?.status === 'rejected' ?
                                <Chip color="red">Rad etilgan</Chip> :
                                <Chip color="green">Bajarilgan</Chip>
                    }
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button variant="text" color="orange" onClick={() => setState({})}>
                        Ortga
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default EducationView;
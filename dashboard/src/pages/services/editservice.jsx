import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from '@material-tailwind/react';
import axios from 'axios';
import { API } from '../../cfg';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setRefreshService } from '../../manager/serviceManager';
function ServiceEdit({ select, setSelect }) {
    const dp = useDispatch();
    function Submit() {
        axios.put(`${API}/service/edit/${select._id}`, { title: select.title, about: select.about }, {
            headers: {
                'x-auth-token': `X-Checker ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.warning(msg);
            } else {
                toast.success(msg);
                dp(setRefreshService());
                setSelect({ ...select, open: false });
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }
    return (
        <Dialog open={select?.open} size="xxl" className="flex items-center justify-center bg-[#0000002a] backdrop-blur-[10px]">
            <div className="flex items-center justify-start flex-col w-[500px] p-[10px] rounded-xl bg-white shadow-lg tablet2:w-[95%]">
                <DialogHeader className='w-full'>
                    <h1>{select?.oldTitile}</h1>
                </DialogHeader>
                <DialogBody className='border-y w-full'>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label='Xizmat nomi' required value={select?.title} onChange={e => setSelect({ ...select, title: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Textarea label='Xizmat nomi' value={select?.about} onChange={e => setSelect({ ...select, about: e.target.value })} />
                    </div>
                </DialogBody>
                <DialogFooter className='flex items-center justify-between w-full'>
                    <Button variant='text' color='orange' onClick={() => setSelect({ ...select, open: false })}>Yopish</Button>
                    <Button onClick={Submit} variant='gradient' color='green' disabled={select?.title === select?.oldTitile && select?.about === select?.oldAbout}>O'zgartirish</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default ServiceEdit;
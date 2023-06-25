import { IconButton, Input, Option, Select } from "@material-tailwind/react";
import { useState } from "react";
import { BiPlusCircle, BiSearch } from 'react-icons/bi'
import EducationAdd from "./educationadd";
function Educations() {
    const [search, setSearch] = useState('');
    const [openadd, setOpenAdd] = useState(false);
    return (
        <div className="flex items-center justify-start flex-col w-full mt-[20px] phone:mt-[10px] phone:px-[5px]">
            <div className="flex items-center justify-between w-full rounded-[10px] shadow-[0_10px_20px] shadow-[#0000000b] bg-white p-[10px_20px] mb-[20px] phone:mb-[10px]">
                <div className="flex items-center justify-center w-[250px] ">
                    <Input type="search" label="Viloyat, tuman, maktab ..." onChange={e => setSearch(e.target.value)} icon={<BiSearch />} />
                </div>
                <IconButton onClick={() => setOpenAdd(true)} color="green" className="text-[30px] rounded-full">
                    <BiPlusCircle />
                </IconButton>
            </div>
            <EducationAdd open={openadd} setOpen={setOpenAdd} />
        </div>
    );
}

export default Educations;
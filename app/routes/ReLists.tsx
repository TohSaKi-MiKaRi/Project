import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";

export default function ReLists(){
    const navigate = useNavigate();
    const [loadStatus, setLoadStatus] = useState(true);
    const [RepairData, setRepairData] = useState([]);

    useEffect(()=>{
        try {
            const fetchRepair = async() => {
                const Repair = await fetch(
                    'http://localhost:3004/api/getRepair'
                );
                if(Repair.ok){
                    const ReJson = await Repair.json();
                    setRepairData(ReJson);
                    setLoadStatus(false);
                }else{
                    alert('[ERR] Unable to read data.');
                }
            }
            fetchRepair().catch(console.error);
            setLoadStatus(false);
            console.log('Fetch pets data.');
        } catch (error) {
            alert('[ERR] An error occurs when reading the data.');
        }
    }, [loadStatus]);

    const handleDelete = async(ReId: string) => {
        alert (`กำลังลบRepair: ${ReId}`);
        try {
            const fetchData = async() => {
                const ReData = await fetch(
                    `http://localhost:3004/api/deleteRepair/${ReId}`,
                    { 
                        method: 'DELETE'
                    }
                );
                if(ReData.ok){
                    const myJson = await ReData.json();
                    alert(myJson.message);
                }else{
                    alert('[ERR] An error when deleting data.');
                }
            } 
            fetchData();
            setLoadStatus(true);
        } catch (error) {
            alert('[ERR] An error occurs when deleting the data.');
        }
    }
    
    return (
    <div className="m-3">
        <a href='/ReForm'>[ เพิ่มข้อมูลสัตว์เลี้ยง ]</a>
        <h1 className="font-bold">รายการสัตว์เลี้ยง</h1>
        {
            RepairData.map((R_item, index) => 
            <div key={index}>
                <div className="font-bold p-2 m-2 border-2 rounded-lg">
                    ชื่องาน: {R_item.ReName}<br/>
                    วันที่แจ้ง: {R_item.Redate}<br/>
                    เวลา: {R_item.ReTime}<br/>
                    ชื่อสถานที่: {R_item.Readd}<br/>
                    ชื่อผู้แจ้ง: {R_item.ReOwner}<br/>
                    รายละเอียด: {R_item.ReNote}<br/>
                </div>
                <div className="p-2 m-2">
                    <a href={`/RepairDetail/${R_item.ReId}`}>[ รายละเอียด ]</a>
                    <a href={`/RepairEditForm/${R_item.ReId}`}>[ แก้ไข ]</a>
                    <a href="#" onClick={(e) => handleDelete(`${R_item.ReId}`)}>[ ลบ ]</a>
                </div>
            </div>
            )
        }
    </div>
    );
}
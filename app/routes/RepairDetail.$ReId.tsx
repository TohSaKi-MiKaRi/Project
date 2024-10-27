import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";

export default function HerbDetail(){
    const myParams = useParams();
    const ReId = myParams.ReId;
    const [ReData, setReData] = useState({
        ReId: "",
        ReName: "",
        Redate: "",
        ReTime: "",
        Readd: "",
        ReOwner: "",
        ReNote: ""
    });

    useEffect(() => {
        try {
            const fetchReData = async () => {
                const ReData = await fetch(`http://localhost:3004/api/RepairById/${ReId}`);
                if (ReData.ok) {
                    const ReJson = await ReData.json();
                    setReData(ReJson);
                    console.log(ReJson);
                } else {
                    alert('[ERR] Failed to loaded data.');
                }
            }

            fetchReData().catch(console.error);
        } catch (error) {
            alert('[ERR] An error occurred while loading the data.');
        }
    }, []);

    return (
    <div className="m-3">
        <a href='#'>[ ข้อมูลสัตว์เลี้ยง ]</a>
        <h1 className="font-bold">รายละเอียดสัตว์เลี้ยง</h1>
        {
            <div key={ReData.ReId}>
                <div className="font-bold p-2 m-2 border-2 rounded-lg">
                    ชื่องาน: {ReData.ReName}<br/>
                    วันที่แจ้ง: {ReData.Redate}<br/>
                    เวลา: {ReData.ReTime}<br/>
                    ชื่อสถานที่: {ReData.Readd}<br/>
                    ชื่อผู้แจ้ง: {ReData.ReOwner}<br/>
                    รายละเอียด: {ReData.ReNote}<br/>
                </div>
            </div>
        }
        <a href='/ReLists'>[ ย้อนกลับ ]</a>
    </div>
    );
}
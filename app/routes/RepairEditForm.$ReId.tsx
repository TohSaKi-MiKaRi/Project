import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { json } from "body-parser";

export default function RepairEditForm(){
    const navigate = useNavigate();
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
    const [typeOption, setTypeOption] = useState('');

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setReData({
          ...ReData,
          [name]: value
        });
    };

    useEffect(() => {
        try {
            const fetchReData = async () => {
                const ReData = await fetch(`http://localhost:3004/api/RepairById/${ReId}`);
                if (ReData.ok) {
                    const ReJson = await ReData.json();
                    setReData(ReJson);
                    setTypeOption(ReJson.ReType);
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

    const handleSubmit = async(e) => {
      e.preventDefault();
      if(confirm('Confirm the information update?')){
        const form = e.target;
        const formData = new FormData(form);  
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        
        try {
            const resPet = await fetch('http://localhost:3004/api/updateRepair', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formJson),
            });
    
            if(resPet.ok){
                const myJson = await resPet.json();
                alert(`${myJson.message}`);
                navigate('/ReLists');
            }else{
                alert('[ERR] Failed to update the form.');
            }
        } catch (error) {
            alert('[ERR] An error occurred while updatting the form.');
        }
        return true;
      }
    }

    return (
        <div className="m-3">
            <a href='/ReLists'>[ ข้อมูลแจ้งซ่อม ]</a>
            <h1 className="font-bold">อัปเดตข้อมูลแจ้งซ่อม</h1>
            <form method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="ReId" value={ReId} />
            <label>ชื่องาน (*)</label>:<br />
            <input type="text" name="ReName" id="ReName" className="border rounded-lg p-2 w-1/2"
            onChange={handleChange} value={ReData.ReName} required /><br />
            <label>รายละเอียด</label>:<br />
            <textarea rows={3} cols={50} name="ReNote" id="ReNote" className="border rounded-lg p-2 w-1/2"
                onChange={handleChange} value={ReData.ReNote}
            /><br />
            <label>วันที่แจ้ง</label>:<br />
            <input type="date" name="Redate" id="Redate" className="border rounded-lg p-2 w-1/2" 
                onChange={handleChange} value={ReData.Redate} /><br />
             <label>เวลา</label>:<br />
            <input type="Time" name="ReTime" id="ReTime" className="border rounded-lg p-2 w-1/2"
                onChange={handleChange} value={ReData.ReTime}
            /><br />
            <label>ชื่อสถานที่ (*)</label>:<br />
            <textarea rows={3} cols={50} name="Readd" id="Readd" className="border rounded-lg p-2 w-1/2"
                onChange={handleChange} value={ReData.Readd} required
            /><br />
            <label>ชื่อผู้แจ้ง</label>:<br />
            <input type="text" name="ReOwner" id="ReOwner" className="border rounded-lg p-2 w-1/2"
            onChange={handleChange} value={ReData.ReOwner} /><br />
            <div className="p-3">
                <button type="submit">[ Submit ]</button>
                <button type="reset">[ Reset ]</button>
            </div>
            </form>
        </div>
    );
}
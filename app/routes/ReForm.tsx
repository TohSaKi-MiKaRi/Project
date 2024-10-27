import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function ReFrom(){
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData);

        try { 
            const resRepair = await fetch(
                'http://localhost:3004/api/addRepair',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formJson)
                }
            );

            if(resRepair.ok){
                const data = await resRepair.json();
                alert(`${data.message}`);
                navigate('/ReLists');
            }else{
                alert('[ERR] Failed to update the form.');
            }

        } catch (error) {
            alert('[ERR] An error occurred while updatting the form.');
        }
    }

    return (
    <div className="m-3">
        <a href='/ReLists'>[ ข้อมูลแจ้งซ่อม ]</a>
        <h1 className="font-bold">เพิ่มข้อมูล</h1>
        <form method="POST" onSubmit={handleSubmit}>
        <label>ชื่องาน (*):</label><br/>
        <input type="text" name="ReName" className="border rounded-lg p-2 w-1/2" required /><br/>
        <label>วันที่แจ้ง (*)</label>:<br />
        <input type="date" name="Redate" id="Redate" className="border rounded-lg p-2 w-1/2" required /><br />
        <label>เวลา (*):</label><br/>
        <input type="Time" name="ReTime" className="border rounded-lg p-2 w-1/2" required /><br/>
        <label>ชื่อสถานที่ (*):</label><br/>
        <input type="text" name="Readd" className="border rounded-lg p-2 w-1/2" required /><br/>
        <label>ชื่อผู้แจ้ง (*)</label>:<br />
        <input type="text" name="ReOwner" id="ReOwner" className="border rounded-lg p-2 w-1/2" placeholder="ระบุชื่อ-สกุล" required /><br />
        <label>รายละเอียด</label><br/>
        <textarea rows={3} cols={50} name="ReNote" className="border rounded-lg p-2 w-1/2" /><br/>
        <button type="submit">[ บันทึก ]</button>
        <button type="reset">[ เคลียร์ ]</button>
        </form>
    </div>
    );
}
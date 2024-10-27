import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import admin from "firebase-admin";

import serviceAccount from "./config/Project-firebase.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 3004;

app.use(bodyParser.json());
app.use(cors());
app.listen(port, ()=>{
    console.log(`Web application listening on port ${port}.`);
});

async function addRepair(tmpReData){
    const ReRef = db.collection('Repair').doc();
    const docRef = db.collection('Repair').doc(ReRef.id);
    let tmpObj = { ...tmpReData, ReId: ReRef.id };
    await docRef.set(tmpObj);
    console.log('Repair added.');
}

app.post('/api/addRepair', (req, res) => {
    const { ReName,Redate, ReNote, ReTime, Readd, ReOwner } = req.body;
    const tmpData = { ReName,Redate, ReNote, ReTime, Readd, ReOwner };
    addRepair(tmpData);
    res.status(200).json({ message: '[INFO] Add new Repair successfully.' });
})

async function deletePet(ReId){
    const docRef = db.collection("Repair").doc(ReId);
    await docRef.delete();
    console.log('Repair deleted.');
}

app.delete('/api/deleteRepair/:ReId', (req, res) => {
    const { ReId } = req.params;
    deletePet(ReId);
    res.status(200).json({ message: '[INFO] Deleted Repair successfully.' });
});

async function fetchRepair(){
    const result = [];
    const ReRef = db.collection('Repair');
    const docRef = await ReRef.get();
    docRef.forEach(doc => {
       result.push({
        id: doc.id,
        ...doc.data()
       });
    });
    return JSON.stringify(result);
}

app.get('/api/getRepair', (req, res) => {
    res.set('Content-type', 'application/json');
    fetchRepair().then((jsonData) => {
        res.send(jsonData);
    }).catch((error) => {
        res.send(error);
    });
});

async function fetchRepairById(ReId){
    const result = [];
    const ReRef = db.collection('Repair')
                     .where('ReId', '==', ReId);
    const docRef = await ReRef.get();
    docRef.forEach(doc => {
       result.push({
        id: doc.id,
        ...doc.data()
       });
    });
    return result;
}

app.get('/api/RepairById/:ReId', (req, res) => {
    const { ReId } = req.params;
    res.set('Content-type', 'application/json');
    fetchRepairById(ReId).then((jsonData) => {
        res.send(jsonData[0]);
    }).catch((error) => {
        res.send(error);
    });
});

async function updateRepair(ReId, ReData){
    const docRef = db.collection('Repair').doc(ReId);
    await docRef.update(ReData);
    console.log('Repair updated!');
}

app.post('/api/updateRepair', (req, res) => {
    const { ReId, ReName,Redate, ReNote, ReTime, Readd, ReOwner } = req.body;
    updateRepair(ReId, { ReName,Redate, ReNote, ReTime, Readd, ReOwner });
    res.status(200).json({ message: '[INFO] Repair updated successfully.'});
});

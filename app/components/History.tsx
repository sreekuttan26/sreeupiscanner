'use client'
import { collection, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { firestore } from './Firebase';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';

type ExpenseData = {
    amount: number;
    category: string;
    subcategory: string;
    name: string;
    note: string;
    status: string;
    vpa: string;
    marchantCode: string;
    createdAt: Timestamp;
};

type Expense = {
    id: string,
    data: ExpenseData
}


const History = () => {

    const [expData, setExpData] = useState<Expense[]>([]);
    const [change, setchange] = useState(false)
    const[isdeletewindow, Setisdeletewindow]=useState(false)
    const [deletedocid, setdeletedocid]=useState('')


    useEffect(() => {
        const fetchData = async () => {
            const data = await getdoc(); // wait for the promise to resolve
            console.log(data)
            setExpData(data)
        };

        fetchData();
    }, [change]);

    const getdoc = async () => {
        const snapshot = await getDocs(collection(firestore, 'expenses'));

        return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            data: docSnap.data() as ExpenseData
        })).sort(
            (a, b) =>
                b.data.createdAt.toMillis() - a.data.createdAt.toMillis()
        );
    }

    const deletedoc = async (docID: string) => {
        disableScroll()
        setdeletedocid(docID)
        Setisdeletewindow(true)

      

    }
    const deletecnf=async()=>{
          await deleteDoc(doc(firestore, "expenses", deletedocid));
        setchange(!change)
    }

    const deletcancel=async()=>{
         setdeletedocid('')
         enableScroll();
         Setisdeletewindow(false)

        setchange(!change)
    }
    function disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    function enableScroll() {
        document.body.style.overflow = '';
    }


    return (
        <div className=' w-full max-w-sm mx-auto  '>
            <h1 className='flex text-lg font-semibold'>History</h1>
            <div>
                {expData.map((exp, index) => (
                    <div key={index} className=' relative flex w-full border-2 shadow-xl my-2 rounded-xl py-4 flex-wrap justify-between text-sm px-2  '>
                        <div className="flex flex-col gap-2">

                            <span>{exp.data.name}</span>
                            <span className="text-gray-600">{exp.data.note}</span>
                            <span className="p-2 border-2 rounded-md bg-black text-white">{format(exp.data.createdAt.toDate(), "EEEE, dd MMM yyyy | hh:mm a")}</span>
                        </div>
                        <span className="px-2 font-semibold text-xl">₹ {exp.data.amount}</span>

                        <div className="absolute bottom-1 right-4 " onClick={() => { deletedoc(exp.id) }}>
                            <Trash className="w-4 " />
                        </div>


                    </div>
                ))}
            </div>
            {isdeletewindow&&<div className="absolute top-0 left-0 flex w-full h-[200vh] z-10   items-center justify-center px-8 ">
                <div className="absolute top-0 left-0 flex w-full h-[200vh] z-1   items-center justify-center px-8 opacity-25  bg-black"></div>
                <div className="w-full p-4 border-2 flex flex-col gap-2 rounded-xl items-center bg-white z-9">
                    <h1 className="text-xl font-semibold py-2">Delete</h1>
                    <p>Do you want to delete this?</p>
                    <div className="flex justify-around gap-2 py-2">
                        <button className="p-2 rounded-xl border-2" onClick={deletcancel}>Cancel</button>
                        <button className="p-2 rounded-xl border-2 hover:bg-red-500 focus:bg-red-500 focus:border-red-300 focus:text-white" onClick={deletecnf}>Delete</button>
                    </div>
                </div>


            </div>}


        </div>
    )
}

export default History



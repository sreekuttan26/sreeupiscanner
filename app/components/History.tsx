'use client'
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { firestore } from './Firebase';
import { format } from 'date-fns';

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


    useEffect(() => {
        const fetchData = async () => {
            const data = await getdoc(); // wait for the promise to resolve
            console.log(data)
            setExpData(data)
        };

        fetchData();
    }, []);

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
    return (
        <div className=' w-full max-w-sm mx-auto  '>
            <h1 className='flex text-lg font-semibold'>History</h1>
            <div>
                {expData.map((exp, index) => (
                    <div key={index} className='flex w-full border-2 shadow-xl my-2 rounded-xl py-4 flex-wrap justify-between text-sm px-2  '>
                        <div className="flex flex-col gap-2">

                            <span>{exp.data.name}</span>
                            <span className="text-gray-600">{exp.data.note}</span>
                            <span className="p-2 border-2 rounded-md bg-black text-white">{format(exp.data.createdAt.toDate(), "EEEE, dd MMM yyyy | hh:mm a")}</span>
                        </div>
                        <span className="px-2 font-semibold text-xl">₹ {exp.data.amount}</span>


                    </div>
                ))}
            </div>


        </div>
    )
}

export default History



'use client'
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { firestore } from '../components/Firebase';
import { ArrowLeft } from 'lucide-react';

export default function budget() {

    const [essentail, Setessential] = useState(-1);
    const [needs, Setneeds] = useState(-1);
    const [fun, Setfun] = useState(-1);
    const [future, Setfuture] = useState(-1);

    const submitData = async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        if (essentail < 0 || needs < 0 || fun < 0 || future < 0) {
            alert("Enter valid amount")
            return;
        }

        try {
            const budgetCollectionpath = doc(firestore, String(year), `${month}_${year}`, "budget", "0");
            await setDoc(budgetCollectionpath, {
                Essentials: essentail,
                Needs: needs,
                Fun: fun,
                Future: future
            })
            window.location.href="/"

        } catch (error) {
            console.log(error)

        }




    }


    return (
        <main className="h-auto w-full  flex flex-col items-center justify-center p-4 gap-6">
            <div className="max-w-sm flex flex-col gap-2 mt-5">
                <div onClick={() => { window.location.href = '/' }} className="flex flex-row w-full">
                    <ArrowLeft />

                </div>
                <h1 className="font-semibold text-lg ">Add Budget</h1>

                {/* input essential */}
                <div className="flex flex-col gap-0">
                    <p className="text-sm text-gray-500 px-2">Essential</p>
                    <input onChange={(e) => { Setessential(Number(e.target.value)) }} type="number" className="p-2 w-full border-2  rounded-xl" />
                </div>

                {/* input Needs */}
                <div className="flex flex-col gap-0">
                    <p className="text-sm text-gray-500 px-2">Needs</p>
                    <input onChange={(e) => { Setneeds(Number(e.target.value)) }} type="number" className="p-2 w-full border-2  rounded-xl" />
                </div>

                {/* input fun */}
                <div className="flex flex-col gap-0">
                    <p className="text-sm text-gray-500 px-2">Fun</p>
                    <input onChange={(e) => { Setfun(Number(e.target.value)) }} type="number" className="p-2 w-full border-2  rounded-xl" />
                </div>

                {/* input future */}
                <div className="flex flex-col gap-0">
                    <p className="text-sm  px-2">Future</p>
                    <input onChange={(e) => { Setfuture(Number(e.target.value)) }} type="number" className="p-2 w-full border-2  rounded-xl" />
                </div>

                <div className="w-full flex items-center justify-center">
                    <button onClick={submitData} className="px-4 py-3 bg-gary-600 border-2 rounded-xl hover:bg-gray-600 cursor-pointer">Sumbit</button>
                </div>



            </div>


        </main>
    )
};




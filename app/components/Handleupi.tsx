'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { firestore } from './Firebase';
import { Save } from 'lucide-react';

type UPIProps = {
    vpa: string;
    name: string;
    marchantCode: string;
};

type Budget_exp_cats = {
    Essentials: number,
    Needs: number,
    Fun: number,
    Future: number
}

type Expenses = {
    id: string,
    amount: number;
    category: string;
    createdAt: any; // Firestore Timestamp
    marchantCode: string;
    name: string;
    note: string;
    subcategory: string;
    vpa: string;

}



const Categories = {
    "Essentials": [
        "Rent",
        "Grocery",
        "Electricity Bill",
        "Water",
        "Internet",
        "Mobile Recharge",
        "Gas",
        "Petrol",
        "Taxi",
        "Bike maintenance"
    ],
    "Needs": [
        "Clothes",
        "Shoes",
        "Personal Care",
        "Medicines",
        "Home Decor",
        "Repairs",
        "Haircut"
    ],
    "Fun": [
        "Netflix",
        "Prime",
        "Spotify",
        "Dining Out",
        "Movies",
        "Games",
        "Fun Travel",
        "Hobbies",
        "Stay Out"
    ],
    "Future": [
        "SIP",
        "Stocks",
        "FD",
        "Emergency Fund",
        "Insurance",
        "Retirement Savings",
        "Education Fund",
        "Debt"
    ]
}



const Handleupi = ({ vpa, name, marchantCode }: UPIProps) => {

    const [C_vpa, SetCvpa] = useState(vpa);
    const [amount, Setamount] = useState("");
    const [note, SetNote] = useState("");
    const [Currentcategory, SetcurrentCategory] = useState("Essentials");
    const [Currentsubcat, SetcurrentSubcat] = useState("Select");

    const [budget, Setbudget] = useState<Budget_exp_cats>(
        {
            Essentials: 0,
            Needs: 0,
            Fun: 0,
            Future: 0

        }

    )
    const [expincats, Setexpincats] = useState<Budget_exp_cats>({
        Essentials: 0,
        Needs: 0,
        Fun: 0,
        Future: 0

    })
    const [balincats, Setbalincats] = useState<Budget_exp_cats>({
        Essentials: 0,
        Needs: 0,
        Fun: 0,
        Future: 0

    })
    const [expenses, Setexpeses] = useState<Expenses[]>([])

    const total: Budget_exp_cats = {
        Essentials: 0,
        Needs: 0,
        Fun: 0,
        Future: 0

    }



    useEffect(() => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const fetch_budget = async () => {
            const budgetpath = doc(firestore, String(year), `${month}_${year}`, "budget", "0")
            const budgetdoc = await getDoc(budgetpath)
            if (!budgetdoc.exists()) { return null }

            const budgetdata = budgetdoc.data() as Budget_exp_cats;
            Setbudget(budgetdata)
        }

        const fetch_expesnses = async () => {
            const expCollectionPath = collection(firestore, String(year), `${month}_${year}`, "expenses")
            const expensesDocs = await getDocs(expCollectionPath)
            if (expensesDocs.empty) { return null }

            const tempexparray: Expenses[] = []
            expensesDocs.forEach(document => {
                const data = document.data()
                tempexparray.push({
                    id: document.id,
                    amount: data.amount,
                    category: data.category,
                    createdAt: data.createdAt, // Firestore Timestamp
                    marchantCode: data.marchantCode,
                    name: data.name,
                    note: data.note,
                    subcategory: data.subcategory,
                    vpa: data.vpa
                })

                const currentCategory = data.category as keyof Budget_exp_cats
                if (total.hasOwnProperty(currentCategory)) {
                    total[currentCategory] += data.amount;
                }

            })
            Setexpeses(tempexparray)
            Setexpincats(total)


        }

        fetch_budget()
        fetch_expesnses()

        SetCvpa(vpa)

    }, [])

    useEffect(() => {

        const setBalace = () => {
            const tempbal = {
                Essentials: (budget.Essentials) - (expincats.Essentials),
                Needs: (budget.Needs) - (expincats.Needs),
                Fun: (budget.Fun) - (expincats.Fun),
                Future: (budget.Future) - (expincats.Future)
            }

            Setbalincats(tempbal)


        }
        setBalace();



    }, [budget, expenses, expincats])

    useEffect(() => {
       SetCvpa(vpa)

    }, [vpa])





    const HandlePayemt=()=>{
        if(Number(amount)<1 || C_vpa.length<1 || Currentsubcat==="Select" ){
            alert("Invalid data")
            
            return null}

        ProcessdbPush()
        window.location.href=buildUPIUrl('upi://pay')
    }

    const buildUPIUrl = (scheme: string) => {
        const params = new URLSearchParams({
            pa: C_vpa,
            pn: name,
            mc: marchantCode,
            tr: Date.now().toString(),
            am: String(amount),
            cu: 'INR',
            tn: note,
        });





        return `${scheme}?${params.toString()}`;
    };

    const ProcessdbPush= async()=>{
        console.log("pushing to db")
        const now= new Date();
        const month=now.getMonth()+1;
        const year=now.getFullYear()

        const expensepath=collection(firestore,String(year),`${month}_${year}`,"expenses")
        await addDoc(expensepath,{
            amount: Number(amount),
            vpa: C_vpa,
            name: name,
            marchantCode: marchantCode,
            note: note,
            category: Currentcategory,
            subcategory: Currentsubcat,
            createdAt: serverTimestamp(),
            
        })
            window.location.reload()
        

    }



    return (
        <div className="flex flex-col gap-2 max-w-sm max-auto">
            <p>Paying to: {name}</p>
            <p>VPA: {C_vpa} </p>

            <input onChange={(e) => { SetCvpa(e.target.value) }} placeholder="Enter VPA" type="text" className="p-2 border-2 rounded-xl" value={C_vpa} />

            <input onChange={(e) => { Setamount((e.target.value)) }} placeholder="Enter Amount" type="number" inputMode="decimal" className="p-2 border-2 rounded-xl" value={amount} />

            <input onChange={(e) => { SetNote(e.target.value) }} placeholder="Enter Note" type="text" className="p-2 border-2 rounded-xl" value={note} />

            <div className="flex mt-1  flex-col gap-2 ">
                <div className="flex justify-around">
                {Object.entries(Categories).map(([cat, subcats]) => (
                    <div onClick={()=>{SetcurrentCategory(cat)}} key={cat} className={`flex flex-col gap-2 items-center justify-center  p-2 rounded-xl text-sm ${Currentcategory===cat?"bg-black text-white border-2":"opacity-80"}` }>
                        <p className="text-md font-semibold">{cat}</p>
                        <p className="text-sm font-semibold">₹{budget[cat as keyof Budget_exp_cats]}</p>
                        <p>Balance</p>
                        <p className="text-lg font-semibold">₹{balincats[cat as keyof Budget_exp_cats]}</p>

                    </div>
                ))}
                </div>

                <select onChange={(e)=>{SetcurrentSubcat(e.target.value)}} className="p-2 border-2 rounded-xl mt-5 text-black bg-white ">
                     <option value="Select">Select</option>
                    {Categories[Currentcategory as keyof typeof Categories].map((item)=>(
                        <option key={item} value={item}>{item}</option>
                    ))}

                </select>

                <button onClick={()=>{HandlePayemt()}} className="flex p-2 border-2 bg-gray-800 text-white rounded-lg shadow-xl text-center justify-center">Pay Now</button>

            </div>


           

        </div>
    )
}

export default Handleupi

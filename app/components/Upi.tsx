'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from './Firebase';
import { Save } from 'lucide-react';

type UPIProps = {
    vpa: string;
    name: string;
    marchantCode: string;


};

type Transaction = {
    amount: number;
    category: string;
    createdAt: any; // Firestore Timestamp
    marchantCode: string;
    name: string;
    note: string;
    subcategory: string;
    vpa: string;
};
type Expense = {
    id: string,
    data: Transaction
}

type Budgetitems = {
    Essentials: number,
    Needs: number,
    Fun: number,
    Future: number,
}

type Budget = {
    id: string,
    data: Budgetitems

}

const PAYEE_VPA = '17157114001337@cnrb';
const PAYEE_NAME = 'THE INDIAN SOCIETY FOR ECOLOGICAL ECONOM';
const MERCHANT_CODE = '8641';

type UPIApp = {
    name: string;
    scheme: string;
};

const UPI_APPS: UPIApp[] = [
    { name: 'Google Pay', scheme: 'tez://upi/pay' },
    { name: 'PhonePe', scheme: 'phonepe://pay' },
    { name: 'Paytm', scheme: 'paytmmp://pay' },
    { name: 'Any UPI App', scheme: 'upi://pay' },
];

type BudgetCategories = Record<string, number>;


export default function UPIPayment({ vpa, name, marchantCode }: UPIProps) {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [showApps, setShowApps] = useState(false);
    const [showRecord, setShowrecord] = useState(false);
    const [category, setCategory] = useState<Category>('Essentials');
    const [sub_category, setsub_Category] = useState('Select');
    const [budget, setBudget] = useState<(Record<string, number>)>({});
    const [budget_now, setBudget_now] = useState<(Budget[])>([]);
    const [Lvpa, Setvpa] = useState(vpa)
    const [allexp, Setallexp] = useState<Expense[]>();

    const [Essentials_bal, Setessential_bal] = useState(0)
    const [Need_bal, Setneed_bal] = useState(0)
    const [Fun, Setfun_bal] = useState(0)
    const [Future, Sefuture_bal] = useState(0)

    const categories = {
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
    } as const;
    type Category = keyof typeof categories;


    useEffect(() => {
        let totalSpent = 0;

        allexp?.forEach((exp) => {
            if (exp.data.category === "Needs") {
                totalSpent += exp.data.amount;
            }
        });

        const remaining = (budget_now[0]?.data.Needs ?? 0) - totalSpent;
        Setneed_bal(remaining);
    }, [allexp, budget_now]);


    useEffect(() => {
        Setvpa(vpa)
        const fetchData = async () => {
            const data = await getdoc(); // wait for the promise to resolve
            console.log(data);

            const jandata = data.find((item) => item.id === '1_2026');

            console.log(jandata?.categories.Essentials);

            if (jandata) {
                setBudget(jandata.categories);

            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (vpa) {
            Setvpa(vpa);
        }
    }, [vpa]);

    useEffect(() => {
        const fetchData = async () => {

            await get_budget()
            await get_expenses()

        };
        fetchData();

        // const trasaction:Transaction[] =allexp;


        console.log(allexp)

    }, [])

    useEffect(() => {

    }, [budget_now]);





    // const getDocData_exp = async (docId: string) => {
    //     const docRef = doc(firestore, 'expenses', docId);
    //     const snapshot = await getDoc(docRef);
    //     snapshot.docs.map((docSnap) => ({
    //         id: docSnap.id,
    //         data: docSnap.data() as Transaction
    //     }))




    //     return docSnap.exists() ? docSnap.data() : null;
    // }

    const get_budget = async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const budgetData: Budget[] = [];
        const doc_location = `${month}_${year}`
        const collectionRef = collection(firestore, String(year), doc_location, "budget");
        const collectionSnap = await getDocs(collectionRef);

        collectionSnap.forEach((doc) => {

            budgetData.push({
                id: doc.id,
                data: doc.data() as Budgetitems
            });
        })

        setBudget_now(budgetData)


    }

    const get_expenses = async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const doc_location = `${month}_${year}`
        const collectionRef = collection(firestore, String(year), doc_location, "expenses");

        const collectionsnap = await getDocs(collectionRef)

        const tempExp: Expense[] = []

        collectionsnap.forEach(doc => {
            tempExp.push({
                id: doc.id,
                data: doc.data() as Transaction
            })


        })
        Setallexp(tempExp)






    }

    const getdoc = async () => {
        const snapshot = await getDocs(collection(firestore, 'budget'));

        return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,           // e.g. "1_2026"
            categories: docSnap.data() as Record<string, number>,
        }));;
    }



    const addToFirebase = async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        await addDoc(collection(firestore, String(year), `${month}_${year}`, "expenses"), {
            amount: Number(amount),
            vpa: Lvpa,
            name: name,
            marchantCode: marchantCode,
            note: note,
            category: category,
            subcategory: sub_category,
            createdAt: serverTimestamp(),

        });
        setAmount('');
        setNote('');
        setCategory('Essentials')
        setsub_Category('Select')
        window.location.reload()


    }

    const buildUPIUrl = (scheme: string) => {
        const params = new URLSearchParams({
            pa: Lvpa,
            pn: name,
            mc: marchantCode,
            tr: Date.now().toString(),
            am: amount,
            cu: 'INR',
            tn: note,
        });





        return `${scheme}?${params.toString()}`;
    };

    const handleProceed = () => {
        //console.log(getDocData_budget)

        if (!amount || Number(amount) <= 0 || Lvpa.trim() === '' || sub_category === "Select") {
            alert('Please enter valid info.');
            return;
        }
        addToFirebase();

        setShowApps(true);
        window.location.href = buildUPIUrl('upi://pay');
    };

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
            <p>paying to {name}</p>
            <p>VPA: {Lvpa}</p>
            <input
                type="text"

                placeholder="VPA"
                value={Lvpa}
                onChange={(e) => Setvpa(e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
            />
            <input
                type="number"
                inputMode="decimal"
                placeholder="Amount (INR)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
            />

            <input
                type="text"
                placeholder="Comment (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border px-4 py-2"
            />
            <div>
                <p>Budget Info:</p>
                <div className="flex gap-2 justify-center">


                    {Object.entries(categories).map(([cat, items]) => (
                        <div
                            key={cat}
                            className={`p-2 border-2 shadow-xl rounded-xl flex justify-between flex-col text-sm items-center ${category === cat
                                ? "border-white bg-black text-white"
                                : "  text-gray-500 border-black"
                                }`}
                            onClick={() => setCategory(cat as Category)}
                        >
                            <h1 className="text-md font-semibold">{cat}</h1>
                            <p>₹{budget_now[0]?.data[cat as keyof Budgetitems] || 0}</p>
                            <p>Balance</p>
                            <p className="text-lg font-black">{Need_bal}</p>
                        </div>
                    ))}

                </div>
            </div>

            <select className="w-full rounded-lg border px-4 py-2" onChange={(e) => {
                setsub_Category(e.target.value)


            }} value={sub_category}>
                <option value="Select">Select</option>



                {categories[category]?.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <button
                onClick={handleProceed}
                className="w-full rounded-lg bg-black text-white py-2 border-2 border-gray-200"
            >
                Pay Now
            </button>

            {showApps && (
                <div className="flex flex-col gap-2 pt-2">
                    {/* <p className="text-sm text-gray-600 text-centre">
                        Choose a UPI app
                    </p> */}

                    {/* <a href={buildUPIUrl('upi://pay')}
                        className="w-full text-centre border rounded-lg py-2">
                        Choose UPI app
                    </a> */}

                    {/* <div>
                        <button
                            onClick={()=>{addToFirebase()}}
                            className="w-full rounded-lg bg-black text-white py-2 border-2 border-gray-200 flex items-center justify-center"
                        >
                           <Save /> Record 
                        </button>

                    </div> */}


                </div>
            )}
        </div>
    );
}

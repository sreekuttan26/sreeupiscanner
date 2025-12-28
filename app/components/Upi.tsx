'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from './Firebase';

type UPIProps = {
    vpa: string;
    name: string;
    marchantCode: string;


};

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
    const [category, setCategory] = useState('Essentials');
    const [budget, setBudget] = useState<( Record<string, number>)>({} );

    const categories = ['Essentials', 'Needs', 'Fun', 'Future'];

    useEffect(() => {
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





    const getDocData_exp = async (docId: string) => {
        const docRef = doc(firestore, 'expenses', docId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }

    const getDocData_budget = async (docId: string) => {
        const docRef = doc(firestore, 'budget', docId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;

        return docSnap.data() as BudgetCategories;

    }

    const getdoc = async () => {
        const snapshot = await getDocs(collection(firestore, 'budget'));

        return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,           // e.g. "1_2026"
            categories: docSnap.data() as Record<string, number>,
        }));;
    }



    const addToFirebase = async () => {
        await addDoc(collection(firestore, 'expenses'), {
            amount: Number(amount),
            note,
            category,
            createdAt: serverTimestamp(),
            status: 'initiated',
        });

    }

    const buildUPIUrl = (scheme: string) => {
        const params = new URLSearchParams({
            pa: vpa,
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
        if (!amount || Number(amount) <= 0 || vpa.trim() === '') {
            alert('Please enter a valid amount.');
            return;
        }
        addToFirebase();

        setShowApps(true);
    };

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
            <p>paying to {name}</p>
            <p>VPA: {vpa}</p>
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
                    {categories.map((cat)=>(
                        <div key={cat} className={`p-2 border-2 shadow-xl rounded-xl flex justify-between flex-col text-sm items-center ${category===cat?"border-black bg-black text-white ":"border-gray-50 bg-gray-200 text-black "}`} onClick={()=>{setCategory(cat)}}>
                            <h1 className='text-md font-semibold'>{cat}</h1>
                            <p >₹{budget[cat] || 0}</p>
                            <p >Balance</p>
                            <p className="text-lg font-black">0</p>

                        </div>

                    ))}
                </div>
            </div>

            <select className="w-full rounded-lg border px-4 py-2" onChange={(e) => {
                setCategory(e.target.value);
            }} value={category}>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <button
                onClick={handleProceed}
                className="w-full rounded-lg bg-black text-white py-2"
            >
                Pay Now
            </button>

            {showApps && (
                <div className="flex flex-col gap-2 pt-2">
                    <p className="text-sm text-gray-600 text-centre">
                        Choose a UPI app
                    </p>

                    <a href={buildUPIUrl('upi://pay')}
                        className="w-full text-centre border rounded-lg py-2">
                        Choose UPI app
                    </a>

                    {/* {UPI_APPS.map((app) => (
            <a
              key={app.name}
              href={buildUPIUrl(app.scheme)}
              className="w-full text-centre border rounded-lg py-2"
            >
              {app.name}
            </a>
          ))} */}
                </div>
            )}
        </div>
    );
}

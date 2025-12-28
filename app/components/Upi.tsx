'use client';

import { useState } from 'react';

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

export default function UPIPayment({vpa, name, marchantCode}: UPIProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showApps, setShowApps] = useState(false);

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
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

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

      <button
        onClick={handleProceed}
        className="w-full rounded-lg bg-black text-white py-2"
      >
        Pay via UPI
      </button>

      {showApps && (
        <div className="flex flex-col gap-2 pt-2">
          <p className="text-sm text-gray-600 text-centre">
            Choose a UPI app
          </p>

          {UPI_APPS.map((app) => (
            <a
              key={app.name}
              href={buildUPIUrl(app.scheme)}
              className="w-full text-centre border rounded-lg py-2"
            >
              {app.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

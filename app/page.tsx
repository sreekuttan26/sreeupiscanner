
'use client'
import Image from "next/image";
import Scanqr from "./components/Scanqr";
import { useEffect, useState } from 'react';
import UPIPayment from "./components/Upi";

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [vpa, setVpa] = useState('');
  const [name, setName] = useState('');
  const [marchantCode, setMarchantCode] = useState('');

  useEffect(() => {
    if (result) {
      // Example logic to extract UPI details from the scanned QR code result
      // This assumes the result is a UPI URL; adjust parsing as needed
      try {
        const url = new URL(result);
        if (url.protocol === 'upi:') {
          const params = url.searchParams;
          setVpa(params.get('pa') || '');
          setName(params.get('pn') || '');
          setMarchantCode(params.get('mc') || '');
        }
      } catch (error) {
        console.error('Invalid QR code format for UPI:', error);
      }
    }


  }, [result]);

  return (
  
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-xl font-semibold">Sree Pay</h1>

      {!result && (
        <Scanqr onScan={(value) => setResult(value)} />
      )}

      {result && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Scanned result:</p>
          <p className="font-mono break-all">{result}</p>

          <button
            onClick={() => setResult(null)}
            className="mt-4 px-4 py-2 rounded-lg border"
          >
            Scan again
          </button>
        </div>
      )}

      <div className="min-h-screen flex items-centre justify-centre p-4">
      <UPIPayment vpa={vpa} name={name} marchantCode={marchantCode} />
    </div>




    </main>
     
  );
}
'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

type QRScannerProps = {
  onScan: (value: string) => void;
};

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlRef = useRef<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
  const start = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
    } catch {
      setError('Camera permission denied.');
      return;
    }

    readerRef.current = new BrowserMultiFormatReader();

    const devices = await BrowserMultiFormatReader.listVideoInputDevices();

    const backCamera =
      devices.find(d => d.label.toLowerCase().includes('back')) ||
      devices.find(d => d.label.toLowerCase().includes('rear')) ||
      devices[0];

    controlRef.current = await readerRef.current.decodeFromVideoDevice(
      backCamera.deviceId,
      videoRef.current!,
      (result) => {
        if (result) {
          onScan(result.getText());
        }
      }
    );
  };

  start();

  return () => controlRef.current?.stop();
}, [onScan]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {!permissionGranted && !error && (
        <p className="text-sm text-gray-600 text-centre">
          Please allow camera access to scan the QR code.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 text-centre">
          {error}
        </p>
      )}

      <div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-xl border">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      </div>
    </div>
  );
}

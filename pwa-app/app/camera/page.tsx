// app/camera/page.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import imageCompression from 'browser-image-compression';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CameraPage() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      setPreviewImage(URL.createObjectURL(compressedFile));
      setSelectedFile(compressedFile);
    } catch (error) {
      console.error('Error proses gambar:', error);
      alert("Gagal memproses gambar. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], 'foto-kamar.jpg', { type: 'image/jpeg' });
    await processImage(file);
  }, [webcamRef]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await processImage(file);
  };

  const retake = () => {
      setPreviewImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKirim = () => {
      if (!selectedFile) return;
      
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
          localStorage.setItem('fotoKos', reader.result as string);
          router.push('/loading-ai');
      };
  };

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans p-6 flex flex-col">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h2 className="text-white font-black text-lg uppercase tracking-wider">Pemindaian</h2>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Camera Viewport */}
      <div className="flex-1 w-full bg-white rounded-[40px] border-[6px] border-[#78B5D6] overflow-hidden shadow-2xl relative flex items-center justify-center">
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[#78B5D6] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#78B5D6] font-bold">Memproses...</p>
          </div>
        ) : !previewImage ? (
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode }} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
        )}
      </div>

      {/* Footer Controls */}
      <footer className="mt-8 mb-4">
        {!previewImage ? (
          <div className="flex items-center justify-around">
            <button onClick={toggleCamera} className="bg-white p-4 rounded-full shadow-lg text-[#78B5D6]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            </button>
            <button onClick={capture} className="w-20 h-20 bg-[#FF7AA2] rounded-full border-[8px] border-white shadow-[0_6px_0_#78B5D6] active:scale-90 transition-all"></button>
            <button onClick={() => fileInputRef.current?.click()} className="bg-white p-4 rounded-full shadow-lg text-[#78B5D6]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button onClick={retake} className="flex-1 bg-white border-[4px] border-[#78B5D6] text-[#78B5D6] py-5 rounded-full font-black text-lg shadow-[0_4px_0_#78B5D6] active:scale-95 transition-all">Ulangi</button>
            <button onClick={handleKirim} className="flex-1 bg-[#F9D66F] border-[4px] border-[#78B5D6] text-[#FF7AA2] py-5 rounded-full font-black text-lg shadow-[0_4px_0_#78B5D6] active:scale-95 transition-all">Analisis!</button>
          </div>
        )}
      </footer>
    </main>
  );
}
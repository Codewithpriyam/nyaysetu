/**
 * NyayaSetu — LawyerProfileEditPage Component
 * Advocate Profile & Direct Payment Setup:
 * Allows advocates to edit profile details, enter custom UPI ID, and upload custom QR Code images.
 */

import { useState, useEffect } from 'react';
import BentoTilt from '@/components/common/BentoTilt';
import {
  HiSave,
  HiCheckCircle,
  HiUser,
  HiShieldCheck,
  HiQrcode,
  HiPhotograph,
  HiCheck,
  HiCreditCard,
  HiRefresh,
  HiPhone,
} from 'react-icons/hi';
import { MdOutlineGavel } from 'react-icons/md';

const LawyerProfileEditPage = () => {
  const [name, setName]                   = useState('Adv. Prince Kumar');
  const [court, setCourt]                 = useState('Jharkhand High Court & Ranchi District Court');
  const [barEnrollment, setBarEnrollment] = useState('JH/2019/5842');
  const [experience, setExperience]       = useState(3);
  const [languages, setLanguages]         = useState('Hindi, English, Nagpuri');
  const [bio, setBio]                     = useState('Committed to helping clients understand their legal options and navigate court procedures with confidence. Provides practical guidance and professional assistance across a variety of everyday legal matters.');
  const [upiId, setUpiId]                 = useState('princekumar@upi');
  const [qrCodeImage, setQrCodeImage]     = useState('/img/qrcodes/prince_kumar_qr.png');
  const [savedAlert, setSavedAlert]       = useState('');

  // Load custom saved profile & payment details on mount
  useEffect(() => {
    const saved = localStorage.getItem('nyaysetu_advocate_payment_settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name) setName(data.name);
        if (data.court) setCourt(data.court);
        if (data.barEnrollment) setBarEnrollment(data.barEnrollment);
        if (data.experience) setExperience(data.experience);
        if (data.languages) setLanguages(data.languages);
        if (data.bio) setBio(data.bio);
        if (data.upiId) setUpiId(data.upiId);
        if (data.qrCodeImage) setQrCodeImage(data.qrCodeImage);
      } catch (err) {
        console.error('Error parsing saved advocate payment settings:', err);
      }
    }
  }, []);

  // Handle Custom QR Code Image File Upload
  const handleQrImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('QR Code image file size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setQrCodeImage(base64Url);
        setSavedAlert('New QR Code Image uploaded successfully! Click "Save Profile & QR Settings" to activate.');
        setTimeout(() => setSavedAlert(''), 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset QR Code Image to Default
  const handleResetQrImage = () => {
    setQrCodeImage('/img/qrcodes/prince_kumar_qr.png');
    setSavedAlert('QR Code reset to default platform QR code.');
    setTimeout(() => setSavedAlert(''), 4000);
  };

  // Handle Form Submit & Local Storage Persist
  const handleSave = (e) => {
    e.preventDefault();

    const profileData = {
      name,
      court,
      barEnrollment,
      experience,
      languages,
      bio,
      upiId,
      qrCodeImage,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('nyaysetu_advocate_payment_settings', JSON.stringify(profileData));
    setSavedAlert('Advocate profile, custom UPI ID, and QR Code saved successfully! Clients will now see your updated payment details.');
    setTimeout(() => setSavedAlert(''), 5000);
  };

  return (
    <div className="min-h-screen bg-ct-void text-ct-ivory pt-28 pb-20">
      <div className="section-container max-w-4xl mx-auto">

        {/* Feedback Alert Banner */}
        {savedAlert && (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-center text-xs font-bold text-emerald-400 shadow-md animate-in fade-in">
            {savedAlert}
          </div>
        )}

        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="gold-divider-sm" />
            <span className="label-text">ADVOCATE PORTAL SETUP</span>
            <div className="gold-divider-sm" />
          </div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-ct-ivory leading-tight">
            Advocate Profile & <span className="text-ct-gold italic">Payment QR Settings</span>
          </h1>

          <p className="mt-2 font-inter text-xs sm:text-sm text-ct-muted leading-relaxed">
            Upload your personal UPI QR Code image, edit your custom UPI ID, and update your Bar Council practitioner details.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="court-card-surface p-8 sm:p-10 border border-ct-gold/30 shadow-court-hover flex flex-col gap-8">

          {/* ─── SECTION 1: ADVOCATE PUBLIC PROFILE ──────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-ct-gold/20">
              <MdOutlineGavel className="text-ct-gold" size={22} />
              <h2 className="font-cormorant text-2xl font-bold text-ct-ivory">1. Professional Practitioner Info</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  Advocate Display Name*:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  Bar Council Enrollment Number*:
                </label>
                <input
                  type="text"
                  required
                  value={barEnrollment}
                  onChange={(e) => setBarEnrollment(e.target.value)}
                  className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-mono text-xs text-ct-gold focus:border-ct-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                  Primary Practice Courts*:
                </label>
                <input
                  type="text"
                  required
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                    Years of Exp*:
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                    Languages*:
                  </label>
                  <input
                    type="text"
                    required
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1 block">
                Professional Bio & Practice Summary*:
              </label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-ct-gold/20 bg-ct-void p-3 font-inter text-xs text-ct-ivory focus:border-ct-gold focus:outline-none"
              />
            </div>
          </div>

          {/* ─── SECTION 2: CUSTOM UPI ID & QR CODE UPLOAD ────────────────── */}
          <div className="rounded-2xl border border-ct-gold/40 bg-ct-void/80 p-6 sm:p-8 flex flex-col gap-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ct-gold/20">
              <div>
                <div className="flex items-center gap-2">
                  <HiQrcode className="text-ct-gold" size={26} />
                  <h2 className="font-cormorant text-2xl font-bold text-ct-ivory">2. Payment UPI ID & Custom QR Code</h2>
                </div>
                <p className="font-inter text-xs text-ct-muted mt-0.5">
                  Set your custom UPI ID and upload your personal payment QR Code image so clients can pay directly to your account.
                </p>
              </div>

              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-general text-[9px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                <HiCheckCircle size={14} /> Direct Account Settlement
              </span>
            </div>

            <div className="grid gap-8 md:grid-cols-2 items-start">

              {/* Left Column: Custom UPI ID Input */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold mb-1.5 flex items-center justify-between">
                    <span>Advocate Custom UPI ID*:</span>
                    <span className="text-emerald-400 font-mono text-[9px]">GPay / PhonePe / Paytm</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. princekumar@upi, yourname@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full rounded-xl border border-ct-gold/40 bg-ct-deep p-3.5 pr-10 font-mono text-xs text-ct-gold focus:border-ct-gold focus:outline-none shadow-inner"
                    />
                    <HiCreditCard size={20} className="absolute right-3 top-3.5 text-ct-gold/60" />
                  </div>
                  <p className="font-inter text-[10px] text-ct-muted mt-1.5">
                    Clients will see this exact UPI ID during payment verification when booking consultations.
                  </p>
                </div>

                {/* Live Preview Card */}
                <div className="rounded-xl border border-ct-gold/20 bg-ct-deep/90 p-4">
                  <span className="font-general text-[8px] uppercase tracking-widest text-ct-muted block mb-1.5">
                    Live Client Payment Badge Preview
                  </span>

                  <div className="flex items-center justify-between rounded-lg border border-ct-gold/30 bg-ct-void px-3.5 py-2.5">
                    <div>
                      <span className="font-general text-[7px] uppercase tracking-widest text-ct-muted block">Advocate Verified UPI</span>
                      <span className="font-mono text-xs font-bold text-ct-gold">{upiId || 'advocate@upi'}</span>
                    </div>
                    <span className="rounded bg-emerald-400/20 px-2 py-0.5 font-general text-[8px] uppercase text-emerald-400 font-bold border border-emerald-400/30">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Custom QR Code Image Upload */}
              <div className="flex flex-col gap-3">
                <label className="font-general text-[9px] uppercase tracking-widest text-ct-gold font-bold flex items-center justify-between">
                  <span>Upload Personal QR Code Image*:</span>
                  <span className="text-ct-gold font-general text-[9px]">PNG / JPG / WEBP</span>
                </label>

                {/* QR Code Upload Box */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ct-gold/40 bg-ct-deep p-6 text-center transition-all hover:border-ct-gold group">
                  {qrCodeImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative rounded-xl border-2 border-ct-gold/60 bg-white p-2 shadow-gold-glow max-w-[150px]">
                        <img
                          src={qrCodeImage}
                          alt="Advocate Payment QR Code"
                          className="w-full h-auto object-contain rounded-lg max-h-[150px]"
                        />
                        <span className="absolute -top-2 -right-2 rounded-full bg-emerald-500 p-1 text-white shadow-md">
                          <HiCheck size={12} />
                        </span>
                      </div>
                      <p className="font-inter text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <HiCheckCircle size={14} /> Custom QR Code Active
                      </p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <HiQrcode className="mx-auto text-ct-gold/50 mb-2 group-hover:scale-110 transition-transform" size={48} />
                      <p className="font-inter text-xs text-ct-ivory font-bold">No Custom QR Code Uploaded</p>
                      <p className="font-inter text-[10px] text-ct-muted mt-0.5">Upload GPay / PhonePe / Paytm QR Code image</p>
                    </div>
                  )}

                  {/* Upload Controls */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <label className="cursor-pointer flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D9A758] to-[#C89B52] px-4 py-2 font-general text-[10px] uppercase font-bold text-ct-void shadow-gold-glow hover:scale-105 transition-all">
                      <HiPhotograph size={15} />
                      <span>{qrCodeImage ? 'Change QR Image' : 'Upload QR Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleQrImageUpload}
                      />
                    </label>

                    {qrCodeImage && (
                      <button
                        type="button"
                        onClick={handleResetQrImage}
                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 font-general text-[10px] uppercase font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Reset QR code to platform default"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-ct-gold/15 flex items-center justify-between">
            <span className="font-general text-[9px] uppercase tracking-widest text-ct-muted">
              All payment changes update instantly across client booking modals
            </span>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A758] via-[#E8C07A] to-[#C89B52] px-8 py-3.5 font-general text-xs font-bold uppercase tracking-widest text-ct-void border border-ct-gold/60 shadow-gold-glow hover:scale-105 transition-all"
            >
              <HiSave size={18} />
              <span>Save Profile & QR Settings</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default LawyerProfileEditPage;

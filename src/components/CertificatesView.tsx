import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Search,
  ExternalLink,
  QrCode,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Certificate } from '../types/index';
import { INITIAL_CERTIFICATES } from '../services/mockData';

interface CertificatesViewProps {
  certificates: Certificate[];
  onTakeAssessment: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ certificates, onTakeAssessment }) => {
  const { currentUser } = useApp();
  const allCerts = certificates.length > 0 ? certificates : INITIAL_CERTIFICATES;

  const [activeCert, setActiveCert] = useState<Certificate>(allCerts[0]);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(verifyInput.trim())}`);
      const data = await res.json();
      setVerifyResult(data);
    } catch (err) {
      console.error(err);
      setVerifyResult({ verified: false, message: 'Could not contact verification server.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F5C451] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Verifiable Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Proficiency Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Server-verified CEFR language credentials with cryptographic verification codes and QR lookups.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onTakeAssessment}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#635BFF] to-[#22D3EE] hover:opacity-95 shadow-md shadow-[#635BFF]/30 transition-all flex items-center gap-1.5"
          >
            <span>Take Diagnostic Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CERTIFICATE DOCUMENT PREVIEW */}
        <div className="lg:col-span-2">
          
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              Official Certificate View
            </span>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* High Fidelity Certificate Paper */}
          <div className="relative bg-[#0E1528] rounded-3xl border-4 border-[#F5C451]/60 p-6 sm:p-10 shadow-2xl text-slate-100 overflow-hidden print:border-black print:bg-white print:text-black">
            
            {/* Ambient Gold Glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#F5C451]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#635BFF]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Inner Border */}
            <div className="border border-[#F5C451]/30 rounded-2xl p-6 sm:p-8 text-center flex flex-col justify-between h-full">
              
              {/* Header Crest */}
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F5C451] to-[#F59E0B] p-0.5 mx-auto mb-3 shadow-lg shadow-[#F5C451]/20">
                  <div className="w-full h-full bg-[#0E1528] rounded-[14px] flex items-center justify-center text-2xl">
                    🏆
                  </div>
                </div>

                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#F5C451]">
                  Talkie AR Global Assessment Council
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 uppercase font-serif">
                  Certificate of Proficiency
                </h2>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  This official credential certifies that
                </p>
              </div>

              {/* Candidate Name */}
              <div className="my-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#635BFF] to-[#A855F7]">
                  {activeCert.candidateName}
                </h3>
                <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  has demonstrated verified competency in English conversational discourse, lexical coherence, and listening comprehension corresponding to:
                </p>

                {/* CEFR Level Badge */}
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#635BFF]/20 border border-[#635BFF]/50 text-white font-bold text-base shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CEFR Level {activeCert.cefrLevel} — {activeCert.levelTitle}</span>
                </div>
              </div>

              {/* Skills Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left my-4 bg-[#0B1020]/90 p-3 rounded-xl border border-slate-800">
                {activeCert.skills.map((skill) => (
                  <div key={skill.name} className="p-2">
                    <p className="text-[10px] text-slate-400 truncate">{skill.name}</p>
                    <p className="text-xs font-bold text-[#22D3EE] mt-0.5">{skill.score}%</p>
                  </div>
                ))}
              </div>

              {/* Footer with Signatures & QR Code */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="text-left">
                  <p className="font-mono text-[11px] text-white">ID: {activeCert.id}</p>
                  <p className="text-[10px]">Issued: {activeCert.issueDate}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Database Status: Active Valid</span>
                  </p>
                </div>

                {/* QR Code graphic */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono leading-tight">
                      <span>TAR-QR</span>
                      <span>VALID</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white uppercase">Scan to Verify</p>
                    <p className="text-[9px] text-slate-400">talkiear.app/verify</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CERTIFICATES LIST & PUBLIC LOOKUP */}
        <div className="space-y-6">
          
          {/* Certificate Selector */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Your Certificate Portfolio ({allCerts.length})
            </h3>
            <div className="space-y-2">
              {allCerts.map((cert) => (
                <button
                  key={cert.id}
                  onClick={() => setActiveCert(cert)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    activeCert.id === cert.id
                      ? 'bg-[#635BFF]/20 border-[#635BFF] text-white font-bold'
                      : 'bg-[#0B1020] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <p className="font-bold text-white">{cert.levelTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{cert.id}</p>
                  </div>
                  <span className="font-extrabold text-sm text-[#F5C451]">{cert.cefrLevel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Public Verification Lookup Form */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
            <h3 className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Certificate Registry</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Verify any candidate's Talkie AR certificate by entering their official ID below.
            </p>

            <form onSubmit={handleVerify} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. TAR-2026-B2901X"
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0B1020] border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#635BFF]"
              />
              <button
                type="submit"
                disabled={isVerifying || !verifyInput.trim()}
                className="w-full py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5249e0] text-xs font-bold text-white disabled:opacity-50 transition-colors"
              >
                {isVerifying ? 'Verifying Registry...' : 'Verify Certificate in Database'}
              </button>
            </form>

            {/* Verification Result Feedback */}
            {verifyResult && (
              <div
                className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
                  verifyResult.verified
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-500/15 border-red-500/40 text-red-200'
                }`}
              >
                {verifyResult.verified ? (
                  <div>
                    <p className="font-bold text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Official Certificate Verified!</span>
                    </p>
                    <p className="mt-1">Candidate: <strong>{verifyResult.certificate.candidateName}</strong></p>
                    <p>CEFR Level: <strong>{verifyResult.certificate.cefrLevel} ({verifyResult.certificate.levelTitle})</strong></p>
                    <p>Issue Date: {verifyResult.certificate.issueDate}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold">Verification Failed</p>
                    <p className="text-slate-300 mt-0.5">{verifyResult.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

import { createPortal } from 'react-dom';
import { Award, Download, X, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  recipientName: string;
  categoryTitle: string;
  lessonCount: number;
  dateIssued: string;
  certificateId: string;
  onClose: () => void;
}

export default function CertificateModal({
  recipientName,
  categoryTitle,
  lessonCount,
  dateIssued,
  certificateId,
  onClose,
}: CertificateModalProps) {
  return createPortal(
    <div className="certificate-overlay fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-auto space-y-4">
        {/* Action bar (hidden when printing) */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-white">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm">Your Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download / Print</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate (printable) */}
        <div className="printable bg-white rounded-2xl p-2 shadow-2xl">
          <div className="relative border-[3px] border-emerald-700 rounded-xl p-8 md:p-12 text-center overflow-hidden">
            {/* Corner flourishes */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

            <div className="relative space-y-5">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black">
                  M
                </span>
                <span className="font-serif text-lg font-bold text-emerald-900 tracking-tight">
                  Maxim Vet Farmers Academy
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-700">
                  Certificate of Completion
                </p>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto" />
              </div>

              <p className="text-xs text-slate-500">This certificate is proudly presented to</p>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">
                {recipientName}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                for successfully completing all <strong className="text-emerald-800">{lessonCount} lessons</strong> of the{' '}
                <strong className="text-emerald-800">{categoryTitle}</strong> training program, demonstrating practical
                competence in modern smallholder livestock management.
              </p>

              {/* Seal */}
              <div className="flex items-center justify-center py-1">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex flex-col items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-amber-300" />
                    <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">Certified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-2">
                <div className="text-center">
                  <p className="font-serif text-sm font-bold text-slate-800 border-b border-slate-300 pb-1">
                    {dateIssued}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">Date Issued</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-sm font-bold text-slate-800 border-b border-slate-300 pb-1 italic">
                    Maxim Vet Academy
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">Authorized Signature</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certificate ID: <span className="font-mono">{certificateId}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

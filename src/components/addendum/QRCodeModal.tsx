import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  open: boolean;
  signingUrl: string;
  onClose: () => void;
}

const QRCodeModal = ({ open, signingUrl, onClose }: QRCodeModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold font-barlow-condensed text-foreground">📱 Customer Signing</h2>
        <p className="text-xs text-muted-foreground">
          Have the customer scan this QR code with their phone or iPad to sign and initial the addendum.
        </p>
        <div className="flex justify-center py-4">
          <QRCodeSVG value={signingUrl} size={200} />
        </div>
        <p className="text-[10px] text-muted-foreground break-all">{signingUrl}</p>
        <div className="flex gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(signingUrl).then(() => alert("Link copied!"))}
            className="flex-1 h-10 rounded-lg border-2 border-border text-sm font-semibold text-foreground hover:bg-muted"
          >
            📋 Copy Link
          </button>
          <button onClick={onClose} className="flex-1 h-10 rounded-lg bg-navy text-primary-foreground text-sm font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;

import { User, Users } from "lucide-react";

export interface CustomerInfo {
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_phone: string;
  buyer_email: string;
  cobuyer_first_name: string;
  cobuyer_last_name: string;
  cobuyer_phone: string;
  cobuyer_email: string;
}

interface CustomerInfoSectionProps {
  info: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
  showCobuyer: boolean;
  inkSaving?: boolean;
}

const CustomerInfoSection = ({ info, onChange, showCobuyer, inkSaving }: CustomerInfoSectionProps) => {
  const update = (field: keyof CustomerInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  return (
    <div className={`px-3 py-2 rounded ${inkSaving ? "bg-card border border-border" : "bg-light border border-border-custom"}`}>
      <div className="flex items-center gap-1 mb-1.5">
        <User className="w-3 h-3 text-muted-foreground" />
        <p className="text-[9px] font-bold text-foreground uppercase tracking-wide">Buyer Information</p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-1">
        <div>
          <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">First Name</label>
          <input
            value={info.buyer_first_name}
            onChange={(e) => update("buyer_first_name", e.target.value)}
            placeholder="First"
            className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
          />
        </div>
        <div>
          <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Last Name</label>
          <input
            value={info.buyer_last_name}
            onChange={(e) => update("buyer_last_name", e.target.value)}
            placeholder="Last"
            className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
          />
        </div>
        <div>
          <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
          <input
            value={info.buyer_phone}
            onChange={(e) => update("buyer_phone", e.target.value)}
            placeholder="(555) 555-5555"
            type="tel"
            className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
          />
        </div>
        <div>
          <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Email</label>
          <input
            value={info.buyer_email}
            onChange={(e) => update("buyer_email", e.target.value)}
            placeholder="email@example.com"
            type="email"
            className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
          />
        </div>
      </div>

      {showCobuyer && (
        <>
          <div className="flex items-center gap-1 mt-2 mb-1.5 pt-1.5 border-t border-border-custom/50">
            <Users className="w-3 h-3 text-muted-foreground" />
            <p className="text-[9px] font-bold text-foreground uppercase tracking-wide">Co-Buyer Information <span className="text-muted-foreground font-normal normal-case">(optional)</span></p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">First Name</label>
              <input
                value={info.cobuyer_first_name}
                onChange={(e) => update("cobuyer_first_name", e.target.value)}
                placeholder="First"
                className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
              />
            </div>
            <div>
              <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Last Name</label>
              <input
                value={info.cobuyer_last_name}
                onChange={(e) => update("cobuyer_last_name", e.target.value)}
                placeholder="Last"
                className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
              />
            </div>
            <div>
              <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
              <input
                value={info.cobuyer_phone}
                onChange={(e) => update("cobuyer_phone", e.target.value)}
                placeholder="(555) 555-5555"
                type="tel"
                className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
              />
            </div>
            <div>
              <label className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                value={info.cobuyer_email}
                onChange={(e) => update("cobuyer_email", e.target.value)}
                placeholder="email@example.com"
                type="email"
                className="w-full border-b-[1.5px] border-border-custom bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50 py-0.5"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerInfoSection;
export const emptyCustomerInfo: CustomerInfo = {
  buyer_first_name: "",
  buyer_last_name: "",
  buyer_phone: "",
  buyer_email: "",
  cobuyer_first_name: "",
  cobuyer_last_name: "",
  cobuyer_phone: "",
  cobuyer_email: "",
};

import { Product } from "@/hooks/useProducts";

interface TotalBarProps {
  installedTotal: number;
  optionalTotal: number;
  grandTotal: number;
  optionalItems: Product[];
  acceptedOptional: Product[];
  inkSaving?: boolean;
}

const TotalBar = ({ installedTotal, optionalTotal, grandTotal, optionalItems, acceptedOptional, inkSaving }: TotalBarProps) => (
  <div className={`px-3 py-2 rounded ${inkSaving ? "bg-card border border-border" : "bg-navy/5 border border-navy/20"}`}>
    <div className="flex items-baseline justify-between">
      <div>
        <p className="text-[10px] font-bold text-foreground">Pre-Installed Items (Non-Removable)</p>
        <p className="text-[8px] text-muted-foreground">Included in vehicle selling price · not optional</p>
        {optionalItems.length > 0 && (
          <p className="text-[8px] text-muted-foreground mt-0.5">
            + Optional items: ${optionalItems.reduce((s, p) => s + p.price, 0).toFixed(2)} (if accepted)
          </p>
        )}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-semibold text-muted-foreground">Installed Total</p>
        <p className="text-sm font-bold text-foreground">${installedTotal.toFixed(2)}</p>
        {optionalItems.length > 0 && (
          <p className="text-[8px] text-muted-foreground">
            ${(installedTotal + optionalItems.reduce((s, p) => s + p.price, 0)).toFixed(2)} if all optional accepted
          </p>
        )}
      </div>
    </div>
  </div>
);

export default TotalBar;

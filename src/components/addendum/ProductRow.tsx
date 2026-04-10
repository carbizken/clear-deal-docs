interface ProductRowProps {
  num: number;
  name: string;
  subtitle: string;
  warranty: string;
  badgeType: "installed" | "optional";
  price: string;
  priceLabel: string;
  disclosure: React.ReactNode;
  isOptional?: boolean;
  inkSaving?: boolean;
}

const ProductRow = ({ num, name, subtitle, warranty, badgeType, price, priceLabel, disclosure, isOptional, inkSaving }: ProductRowProps) => (
  <div className={`border-b border-border-custom py-2 px-2 ${isOptional ? "bg-gold/5" : ""}`}>
    <div className="flex gap-2">
      <span className="text-[10px] font-bold text-muted-foreground w-5 shrink-0 pt-0.5">{num}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-foreground leading-tight">{name}</p>
        <p className="text-[8px] text-muted-foreground leading-tight mt-0.5">{subtitle}</p>
        <p className="text-[8px] text-muted-foreground">{warranty}</p>
        {badgeType === "installed" ? (
          <span className="inline-block mt-0.5 text-[7px] font-bold bg-navy text-primary-foreground px-1.5 py-0.5 rounded-sm">⚙ Pre-Installed · Non-Removable</span>
        ) : (
          <span className="inline-block mt-0.5 text-[7px] font-bold bg-gold text-navy px-1.5 py-0.5 rounded-sm">✦ Optional — Consumer May Accept or Decline</span>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-[12px] font-bold text-foreground">{price}</p>
        <p className="text-[7px] text-muted-foreground">{priceLabel}</p>
      </div>
    </div>
    <p className="text-[7px] text-muted-foreground mt-1 pl-7 leading-tight">{disclosure}</p>
  </div>
);

export default ProductRow;

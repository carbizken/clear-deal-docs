interface AddendumHeaderProps {
  inkSaving?: boolean;
}

const AddendumHeader = ({ inkSaving }: AddendumHeaderProps) => (
  <div className={`text-center py-3 border-b-2 border-navy ${inkSaving ? "bg-card" : "bg-navy text-primary-foreground"}`}>
    <h1 className="text-lg font-extrabold tracking-wide font-barlow-condensed uppercase">Dealer Addendum</h1>
    <p className="text-[9px] tracking-widest mt-0.5 opacity-80">Supplemental Window Label · Dealer-Installed Products &amp; Accessories</p>
    <p className="text-[10px] font-semibold mt-1">Harte Auto Group</p>
    <p className="text-[8px] opacity-70">Connecticut's Premier Family-Owned Dealer Group Since 1995</p>
  </div>
);

export default AddendumHeader;

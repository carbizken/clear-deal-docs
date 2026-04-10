interface AddendumFooterProps {
  inkSaving?: boolean;
}

const AddendumFooter = ({ inkSaving }: AddendumFooterProps) => (
  <div className={`text-center py-2 border-t border-border-custom text-[7px] text-muted-foreground ${inkSaving ? "" : "bg-light"}`}>
    <p>This label must remain affixed to the vehicle until delivery to the purchaser · Retain signed copy for dealership records per applicable state law</p>
    <p className="font-semibold mt-0.5">Harte Auto Group · Dealer Addendum · Form HAG-ADD-2026</p>
  </div>
);

export default AddendumFooter;

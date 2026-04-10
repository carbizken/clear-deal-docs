interface IntentBoxProps {
  inkSaving?: boolean;
}

const IntentBox = ({ inkSaving }: IntentBoxProps) => (
  <div className={`text-[8px] leading-[1.45] px-3 py-2 rounded ${inkSaving ? "bg-card border border-border" : "bg-light border border-action/30"}`}>
    <span className="mr-1">ℹ️</span>
    <strong>IMPORTANT NOTICE TO CONSUMER:</strong> This addendum lists dealer-installed products and accessories added to this vehicle prior to sale. Items marked "Pre-Installed" have been physically installed on this vehicle and cannot be removed. Their cost is included in the selling price of this vehicle as listed. Optional items — you may accept or decline without affecting your ability to purchase or finance this vehicle. None of the items listed below are included in the manufacturer's suggested retail price (MSRP) and none are required by any lender.
  </div>
);

export default IntentBox;

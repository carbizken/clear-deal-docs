import { useState } from "react";
import { Product } from "@/hooks/useProducts";

interface SelectionRecordProps {
  installed: Product[];
  optional: Product[];
  initials: Record<string, string>;
  onInitialChange: (id: string, val: string) => void;
  optionalSelections: Record<string, string>;
  onOptionalChange: (id: string, val: "accept" | "decline") => void;
  installedStartNum: number;
  inkSaving?: boolean;
}

const SelectionRecord = ({ installed, optional, initials, onInitialChange, optionalSelections, onOptionalChange, installedStartNum, inkSaving }: SelectionRecordProps) => {
  const [bulkInitials, setBulkInitials] = useState("");
  const allProducts = [...installed, ...optional];

  const handleFillAll = () => {
    if (!bulkInitials.trim()) return;
    allProducts.forEach((p) => onInitialChange(p.id, bulkInitials.toUpperCase()));
  };

  return (
    <div className={`px-3 py-2 rounded ${inkSaving ? "bg-card" : "bg-light"}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-foreground">Consumer Acknowledgment & Selection Record</p>
        <div className="flex items-center gap-1">
          <input
            value={bulkInitials}
            onChange={(e) => setBulkInitials(e.target.value.toUpperCase())}
            placeholder="Initials"
            className="w-16 px-1.5 py-0.5 text-[10px] text-foreground bg-card border border-border-custom rounded text-center outline-none uppercase placeholder:text-muted-foreground/50"
          />
          <button onClick={handleFillAll} className="text-[8px] px-2 py-0.5 bg-teal text-primary-foreground rounded font-bold">
            Fill All
          </button>
        </div>
      </div>

      {/* Installed items */}
      {installed.map((item, i) => (
        <div key={item.id} className="flex items-center gap-2 py-1 border-b border-border-custom/50">
          <span className="text-[9px] text-muted-foreground w-4">⚙</span>
          <span className="text-[9px] flex-1 text-foreground">
            Pre-Installed{" "}
            <strong>{item.name}</strong> {item.warranty && `(${item.warranty})`}
          </span>
          <span className="text-[9px] font-semibold text-foreground">${item.price.toFixed(2)}</span>
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-bold text-muted-foreground">✍ INITIALS</span>
            <input
              value={initials[item.id] || ""}
              onChange={(e) => onInitialChange(item.id, e.target.value.toUpperCase())}
              placeholder="____"
              className={`w-24 h-9 border-2 rounded-md px-2 text-base font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/30 ml-auto block transition-all ${initials[item.id]?.trim() ? "border-teal bg-[hsl(var(--teal)/0.08)]" : "border-action bg-[hsl(var(--action)/0.06)] animate-pulse"}`}
            />
          </div>
        </div>
      ))}

      {/* Optional items */}
      {optional.length > 0 && (
        <>
          <div className="text-[9px] font-bold text-gold mt-2 mb-1">▼ Optional Items — Consumer Must Choose to Accept or Decline</div>
          {optional.map((item) => (
            <div key={item.id} className="flex items-center gap-2 py-1 border-b border-border-custom/50">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onOptionalChange(item.id, "accept")}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] ${optionalSelections[item.id] === "accept" ? "border-teal bg-teal text-primary-foreground" : "border-border"}`}
                >
                  {optionalSelections[item.id] === "accept" && "✓"}
                </button>
                <span className="text-[6px] text-center">Accept</span>
                <button
                  onClick={() => onOptionalChange(item.id, "decline")}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] ${optionalSelections[item.id] === "decline" ? "border-destructive bg-destructive text-primary-foreground" : "border-border"}`}
                >
                  {optionalSelections[item.id] === "decline" && "✗"}
                </button>
                <span className="text-[6px] text-center">Decline</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-foreground">
                  Optional{" "}
                  <strong>{item.name}</strong>
                </span>
                <p className="text-[7px] text-muted-foreground">You are not required to purchase this product. Declining will not affect your purchase, financing, or delivery.</p>
              </div>
              <span className="text-[9px] font-semibold text-foreground">${item.price.toFixed(2)}</span>
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-bold text-muted-foreground">✍ INITIALS</span>
                <input
                  value={initials[item.id] || ""}
                  onChange={(e) => onInitialChange(item.id, e.target.value.toUpperCase())}
                  placeholder="____"
                  className={`w-24 h-9 border-2 rounded-md px-2 text-base font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/30 ml-auto block transition-all ${initials[item.id]?.trim() ? "border-teal bg-[hsl(var(--teal)/0.08)]" : "border-action bg-[hsl(var(--action)/0.06)] animate-pulse"}`}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SelectionRecord;

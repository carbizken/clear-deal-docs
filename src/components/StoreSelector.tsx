import { useTenant } from "@/contexts/TenantContext";

const StoreSelector = () => {
  const { stores, currentStore, setCurrentStore, tenant } = useTenant();

  if (stores.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Store:</span>
      <select
        value={currentStore?.id || ""}
        onChange={(e) => {
          const store = stores.find(s => s.id === e.target.value);
          if (store) setCurrentStore(store);
        }}
        className="text-xs px-2 py-1 border border-border-custom rounded bg-card text-foreground"
      >
        {stores.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
};

export default StoreSelector;

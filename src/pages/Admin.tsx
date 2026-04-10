import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  subtitle: string | null;
  warranty: string | null;
  badge_type: string;
  price: number;
  price_label: string | null;
  disclosure: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyProduct = {
  name: "",
  subtitle: "",
  warranty: "",
  badge_type: "installed",
  price: 0,
  price_label: "Included in Selling Price",
  disclosure: "",
  sort_order: 0,
  is_active: true,
};

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
    if (data) setProducts(data as any);
    setFetching(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (!editing || !editing.name) return;
    const payload = {
      name: editing.name,
      subtitle: editing.subtitle || null,
      warranty: editing.warranty || null,
      badge_type: editing.badge_type || "installed",
      price: Number(editing.price) || 0,
      price_label: editing.price_label || "Included in Selling Price",
      disclosure: editing.disclosure || null,
      sort_order: Number(editing.sort_order) || 0,
      is_active: editing.is_active ?? true,
    };

    if (editing.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product added");
    }
    setEditing(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    fetchProducts();
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-barlow-condensed text-foreground">Admin — Product Configuration</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate("/")} className="text-xs px-3 py-1.5 rounded bg-action text-primary-foreground">← Back to Addendum</button>
            <button onClick={signOut} className="text-xs px-3 py-1.5 rounded bg-destructive text-primary-foreground">Sign Out</button>
          </div>
        </div>

        <button
          onClick={() => setEditing({ ...emptyProduct, sort_order: products.length + 1 })}
          className="mb-4 px-4 py-2 bg-teal text-primary-foreground rounded font-semibold text-sm"
        >
          + Add Product
        </button>

        {/* Product List */}
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{p.badge_type}</span>
                  {!p.is_active && <span className="ml-2 text-xs text-destructive">INACTIVE</span>}
                </div>
                <div className="flex gap-2">
                  <span className="text-sm font-semibold text-foreground">${p.price.toFixed(2)}</span>
                  <button onClick={() => setEditing({ ...p })} className="text-xs px-3 py-1 bg-blue text-primary-foreground rounded">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 bg-destructive text-primary-foreground rounded">Delete</button>
                </div>
              </div>
              {p.subtitle && <p className="text-xs text-muted-foreground mt-1">{p.subtitle}</p>}
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold font-barlow-condensed">{editing.id ? "Edit Product" : "Add Product"}</h2>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Product Name</label>
                <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Subtitle</label>
                <input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Warranty</label>
                <input value={editing.warranty || ""} onChange={(e) => setEditing({ ...editing, warranty: e.target.value })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Price ($)</label>
                <input type="number" step="0.01" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Sort Order</label>
                <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Type</label>
                <select value={editing.badge_type || "installed"} onChange={(e) => setEditing({ ...editing, badge_type: e.target.value, price_label: e.target.value === "installed" ? "Included in Selling Price" : "If Accepted" })} className="w-full px-3 py-2 border border-border-custom rounded text-sm">
                  <option value="installed">Pre-Installed</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Price Label</label>
                <input value={editing.price_label || ""} onChange={(e) => setEditing({ ...editing, price_label: e.target.value })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Disclosure Text</label>
                <textarea value={editing.disclosure || ""} onChange={(e) => setEditing({ ...editing, disclosure: e.target.value })} className="w-full px-3 py-2 border border-border-custom rounded text-sm" rows={3} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                <label className="text-xs">Active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 py-2 bg-teal text-primary-foreground rounded font-semibold text-sm">Save</button>
                <button onClick={() => setEditing(null)} className="flex-1 py-2 bg-muted text-foreground rounded font-semibold text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

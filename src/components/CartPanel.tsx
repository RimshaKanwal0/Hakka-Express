import { ArrowRight, CreditCard, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import type { CartEntry } from "@/lib/cart";

type CartPanelProps = {
  mode: "delivery" | "pickup";
  setMode: (mode: "delivery" | "pickup") => void;
  entries: CartEntry[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  dec: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  deliveryDisabled?: boolean;
  deliveryUnavailableMessage?: string;
};

export function CartPanel({
  mode, setMode, entries, subtotal, deliveryFee, tax, total, dec, add, remove,
  deliveryDisabled = false, deliveryUnavailableMessage,
}: CartPanelProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-2 border-b border-border">
        {(["delivery", "pickup"] as const).map((cartMode) => {
          const isDeliveryUnavailable = cartMode === "delivery" && deliveryDisabled;

          return (
            <button
              key={cartMode}
              type="button"
              disabled={isDeliveryUnavailable}
              onClick={() => {
                if (!isDeliveryUnavailable) setMode(cartMode);
              }}
              className={`py-4 text-sm font-semibold capitalize transition-all relative ${
                mode === cartMode ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              } ${isDeliveryUnavailable ? "opacity-45 cursor-not-allowed hover:text-muted-foreground" : ""}`}
            >
              <div>{cartMode === "delivery" ? "Delivery" : "Pick-up"}</div>
              {mode === cartMode && (
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {cartMode === "delivery" ? "Standard (30-45 min)" : "Ready in 15-20 min"}
                </div>
              )}
              {mode === cartMode && <div className="absolute bottom-0 inset-x-6 h-0.5 bg-primary rounded-full" />}
            </button>
          );
        })}
      </div>

      {deliveryDisabled && deliveryUnavailableMessage && (
        <div className="mx-4 mt-4 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
          {deliveryUnavailableMessage}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div className="font-bold mb-1">Your cart is empty</div>
          <p className="text-sm text-muted-foreground">Add items to get started. Free delivery on orders over $30.</p>
        </div>
      ) : (
        <>
          <div className="p-5 border-b border-border">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Your items</div>
            <ul className="space-y-4">
              {entries.map(({ item, qty }) => (
                <li key={item.id} className="flex gap-3 items-start">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-secondary shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{item.name}</div>
                    <div className="text-primary font-bold text-sm">${(item.price * qty).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => remove(item.id)} aria-label="Remove" className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center border border-border rounded-full h-7">
                      <button onClick={() => dec(item.id)} className="h-7 w-6 flex items-center justify-center text-muted-foreground hover:text-primary" aria-label="Decrease">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{qty}</span>
                      <button onClick={() => add(item.id)} className="h-7 w-6 flex items-center justify-center text-muted-foreground hover:text-primary" aria-label="Increase">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 space-y-2 text-sm border-b border-border">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            {mode === "delivery" && (
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-primary font-bold" : "text-foreground"}>
                  {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (5%)</span><span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="font-bold">Total</div>
                <div className="text-[11px] text-muted-foreground">incl. fees and tax</div>
              </div>
              <div className="text-2xl font-bold text-primary">${total.toFixed(2)}</div>
            </div>

            <button
              onClick={() => alert("Stripe Checkout coming soon.")}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-3.5 rounded-full text-sm uppercase tracking-wider transition-all hover:scale-[1.01] shadow-lg shadow-primary/30"
            >
              <CreditCard className="h-4 w-4" /> Pay with Card <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-widest">Stripe - Secure Checkout</p>
          </div>
        </>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search, Flame, Plus, Minus, ChevronLeft, ShoppingBag, Trash2, CreditCard, Clock, MapPin, X, Phone, Mail, Instagram, Facebook, Menu as MenuIcon } from "lucide-react";

import { AddressPickerModal } from "@/components/AddressPickerModal";
import { CartPanel as SharedCartPanel } from "@/components/CartPanel";
import { CART_ITEMS, usePersistentCart, type CartItem } from "@/lib/cart";
import logoColor from "@/assets/Logos/Hakka Express logo.png";
import logoWhite from "@/assets/Logos/Hakka Express White.png";
import dishChili from "@/assets/dish-chili-chicken.jpg";
import dishNoodles from "@/assets/dish-noodles.jpg";
import dishRice from "@/assets/dish-rice.jpg";
import dishLollipop from "@/assets/dish-lollipop.jpg";
import dishSoup from "@/assets/dish-soup.jpg";
import dishPotato from "@/assets/dish-honey-potato.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu | Hakka Express — Indo-Chinese, Saskatoon" },
      { name: "description", content: "Order from the full Hakka Express menu — appetizers, soups, hakka chow mein, schezwan rice, chili chicken, wings, frankie rolls and more." },
      { property: "og:title", content: "Hakka Express — Full Menu" },
      { property: "og:description", content: "Indo-Chinese favorites from Hakka Express in Saskatoon." },
    ],
  }),
  component: MenuPage,
});

type Item = CartItem;
type Category = { id: string; name: string; blurb?: string; items: CartItem[] };
type Coords = { lat: number; lng: number };

const LOCATION_KEY = "hakka-express-location";
const LOCATION_COORDS_KEY = "hakka-express-location-coords";
const STORE_COORDS: Coords = { lat: 52.1306623, lng: -106.7272992 };
const DELIVERY_RADIUS_KM = 18;

const LEGACY_MENU: Category[] = [
  {
    id: "popular",
    name: "Popular",
    blurb: "Most ordered right now.",
    items: [
      { id: "p1", name: "Chili Chicken", desc: "Crispy chicken tossed in a smoky sweet-spicy chili glaze.", price: 14.99, img: dishChili, spicy: true },
      { id: "p2", name: "Hakka Chow Mein", desc: "Hand-pulled noodles wok-tossed with vegetables.", price: 13.99, img: dishNoodles },
      { id: "p3", name: "Schezwan Fried Rice", desc: "Fiery schezwan-tossed rice with veggies.", price: 13.99, img: dishRice, spicy: true },
      { id: "p4", name: "Chicken Lollipop", desc: "Marinated drumettes, golden fried.", price: 14.99, img: dishLollipop },
    ],
  },
  { id: "lunch-combo", name: "Lunch Combo", blurb: "Weekday combos — soup + main + rice or noodle.", items: [] },
  {
    id: "appetizers",
    name: "Appetizers",
    items: [
      { id: "a1", name: "Honey Chilli Potato", desc: "Crispy potato batons in honey-chilli glaze.", price: 12.99, img: dishPotato },
      { id: "a2", name: "Veg Spring Rolls", desc: "Crispy rolls stuffed with seasoned vegetables.", price: 9.99 },
    ],
  },
  {
    id: "soups",
    name: "Soups",
    items: [
      { id: "s1", name: "Hot & Sour Soup", desc: "Tangy peppery broth with chicken or veg.", price: 11.99, img: dishSoup },
      { id: "s2", name: "Manchow Soup", desc: "Spicy Indo-Chinese soup with crispy noodles.", price: 11.99, spicy: true },
    ],
  },
  {
    id: "chowmein",
    name: "Chowmein",
    items: [
      { id: "n1", name: "Hakka Chow Mein", desc: "Classic wok-tossed noodles.", price: 13.99, img: dishNoodles },
      { id: "n2", name: "Schezwan Chow Mein", desc: "Noodles fired with schezwan sauce.", price: 14.49, spicy: true },
    ],
  },
  {
    id: "rice",
    name: "Rice",
    items: [
      { id: "r1", name: "Chicken Fried Rice", desc: "Wok-tossed rice with chicken & veggies.", price: 13.49, img: dishRice },
      { id: "r2", name: "Schezwan Fried Rice", desc: "Spicy schezwan-style rice.", price: 13.99, spicy: true },
    ],
  },
  { id: "chicken", name: "Chicken", items: [{ id: "c1", name: "Chili Chicken", desc: "Crispy chicken, smoky chili glaze.", price: 14.99, img: dishChili, spicy: true }] },
  { id: "shrimp", name: "Shrimp", items: [] },
  { id: "beef", name: "Beef", items: [] },
  { id: "fish", name: "Fish", items: [] },
  { id: "vegetarian", name: "Vegetarian", items: [{ id: "v1", name: "Honey Chilli Potato", desc: "Glossy honey-chilli glaze.", price: 12.99, img: dishPotato }] },
  { id: "wings", name: "Wings", items: [] },
  { id: "frankie", name: "Frankie Roll", items: [] },
  { id: "burger", name: "Burger", items: [] },
  { id: "side", name: "Side", items: [] },
  { id: "drinks", name: "Drinks & Shakes", items: [] },
  { id: "soft-drinks", name: "Soft Drinks", items: [] },
  { id: "desserts", name: "Desserts", items: [] },
];

const menuItems = (...ids: string[]) => ids.map((id) => CART_ITEMS[id]).filter((item): item is CartItem => Boolean(item));

const MENU: Category[] = [
  {
    id: "lunch-combo",
    name: "Monday to Saturday Lunch Combo",
    blurb: "Lunch combos include a 355 ml pop.",
    items: menuItems("lc1", "lc2", "lc3", "lc4"),
  },
  {
    id: "burger",
    name: "Burger",
    items: menuItems("b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11", "b12", "b13", "b14", "b15"),
  },
  { id: "wings", name: "Wings", items: menuItems("w1") },
  { id: "desserts", name: "Desserts", items: menuItems("d1") },
  { id: "chicken", name: "Chicken", items: menuItems("ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7") },
  {
    id: "rice",
    name: "Rice",
    items: menuItems("rice1", "rice2", "rice3", "rice4", "rice5", "rice6", "rice7", "rice8", "rice9", "rice10", "rice11", "rice12", "rice13", "rice14", "rice15", "rice16"),
  },
  { id: "soft-drinks", name: "Soft Drinks", items: menuItems("sd1") },
  { id: "soups", name: "Soups", items: menuItems("soup1", "soup2", "soup3", "soup4", "soup5", "soup6", "soup7", "soup8", "soup9") },
  { id: "shrimp", name: "Shrimp", items: menuItems("sh1", "sh2", "sh3", "sh4") },
  { id: "beef", name: "Beef", items: menuItems("beef1", "beef2", "beef3", "beef4") },
  { id: "frankie", name: "Frankie - Roll", items: menuItems("fr1", "fr2", "fr3", "fr4", "fr5", "fr6", "fr7", "fr8") },
  { id: "fish", name: "Fish", items: menuItems("fish1", "fish2", "fish3", "fish4", "fish5", "fish6", "fish7", "fish8") },
  { id: "side", name: "Side", items: menuItems("side1", "side2", "side3", "side4", "side5", "side6", "side7", "side8", "side9") },
  { id: "drinks", name: "Drinks / Shake", items: menuItems("drink1", "drink2", "drink3", "drink4", "drink5", "drink6", "drink7", "drink8", "drink9", "drink10") },
  {
    id: "appetizers",
    name: "Appetizers",
    items: menuItems(
      "app1", "app2", "app3", "app4", "app5", "app6", "app7", "app8", "app9", "app10",
      "app11", "app12", "app13", "app14", "app15", "app16", "app17", "app18", "app19", "app20",
      "app21", "app22", "app23", "app24", "app25", "app26", "app27", "app28", "app29", "app30",
      "app31", "app32", "app33", "app34", "app35",
    ),
  },
  { id: "vegetarian", name: "Vegetarian", items: menuItems("veg1", "veg2", "veg3", "veg4", "veg5", "veg6", "veg7") },
  {
    id: "chowmein",
    name: "Chowmein (Noodle)",
    items: menuItems("cm1", "cm2", "cm3", "cm4", "cm5", "cm6", "cm7", "cm8", "cm9", "cm10"),
  },
];

function parseSavedCoords(raw: string | null): Coords | null {
  if (!raw) return null;

  try {
    const coords = JSON.parse(raw) as Partial<Coords>;
    if (typeof coords.lat === "number" && typeof coords.lng === "number") {
      return { lat: coords.lat, lng: coords.lng };
    }
  } catch {
    return null;
  }

  return null;
}

function getDistanceKm(from: Coords, to: Coords) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MenuPage() {
  const [active, setActive] = useState(MENU[0].id);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("Select delivery location");
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const categoryScrollerRef = useRef<HTMLDivElement | null>(null);
  const { cart, entries: cartEntries, totalItems, subtotal, add, dec, remove } = usePersistentCart();

  useEffect(() => {
    const savedLocation = window.localStorage.getItem(LOCATION_KEY);
    const savedCoords = parseSavedCoords(window.localStorage.getItem(LOCATION_COORDS_KEY));

    if (savedLocation) {
      setUserLocation(savedLocation);
    }

    if (savedCoords) {
      setSelectedCoords(savedCoords);
    }

    if (!savedLocation) {
      setAddressModalOpen(true);
    }
  }, []);

  const saveLocation = (location: string, coords?: Coords) => {
    setUserLocation(location);
    window.localStorage.setItem(LOCATION_KEY, location);

    if (coords) {
      setSelectedCoords(coords);
      window.localStorage.setItem(LOCATION_COORDS_KEY, JSON.stringify(coords));
    } else {
      setSelectedCoords(null);
      window.localStorage.removeItem(LOCATION_COORDS_KEY);
    }
  };

  useEffect(() => {
    if (query) return;
    const handler = () => {
      const sections = MENU.map((c) => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
      const top = window.scrollY + 220;
      const current = [...sections].reverse().find((s) => s.offsetTop <= top);
      if (current) setActive(current.id.replace("cat-", ""));
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [query]);

  useEffect(() => {
    const scroller = categoryScrollerRef.current;
    const activeNode = categoryRefs.current[active];
    if (!scroller || !activeNode) return;

    const left = activeNode.offsetLeft - (scroller.clientWidth - activeNode.clientWidth) / 2;
    scroller.scrollTo({
      left: Math.max(0, left),
      behavior: "smooth",
    });
  }, [active]);

  const closeAddressModal = () => {
    setAddressModalOpen(false);
  };

  const addAndOpenCart = (id: string) => {
    add(id);
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      setCartOpen(true);
    }
  };

  const deliveryDistanceKm = selectedCoords ? getDistanceKm(STORE_COORDS, selectedCoords) : null;
  const isOutsideDeliveryRadius = deliveryDistanceKm !== null && deliveryDistanceKm > DELIVERY_RADIUS_KM;
  const deliveryUnavailableMessage = isOutsideDeliveryRadius && deliveryDistanceKm !== null
    ? `Delivery is not available for this address. It is ${deliveryDistanceKm.toFixed(1)} km from Hakka Express, and delivery is available within ${DELIVERY_RADIUS_KM} km only. Please choose pick-up.`
    : "";

  useEffect(() => {
    if (isOutsideDeliveryRadius && mode === "delivery") {
      setMode("pickup");
    }
  }, [isOutsideDeliveryRadius, mode]);

  const deliveryFee = mode === "delivery" && !isOutsideDeliveryRadius ? (subtotal > 0 ? (subtotal >= 30 ? 0 : 3.99) : 0) : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const filtered = query
    ? MENU.map((c) => ({
        ...c,
        items: c.items.filter((i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.desc?.toLowerCase().includes(query.toLowerCase()),
        ),
      })).filter((c) => c.items.length)
    : MENU;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-5 lg:px-8 h-20 gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logoColor} alt="Hakka Express" className="h-14 w-auto" />
          </Link>
          <div className="hidden">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">Standard · 30–45 min · Open until 10:00 PM</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary">
              <ChevronLeft className="h-4 w-4" /> Home
            </Link>
            <button
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label="Open navigation menu"
              className="md:hidden h-11 w-11 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative h-11 w-11 inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden border-t border-border bg-background/95 px-5 py-4 shadow-lg backdrop-blur-md"
            >
              <div className="grid gap-3 text-sm font-semibold uppercase tracking-widest text-foreground">
                <Link to="/" onClick={() => setMobileNavOpen(false)} className="hover:text-primary">Home</Link>
                <Link to="/menu" onClick={() => setMobileNavOpen(false)} className="hover:text-primary">Menu</Link>
                <a href="/#about" onClick={() => setMobileNavOpen(false)} className="hover:text-primary">Why</a>
                <a href="/#story" onClick={() => setMobileNavOpen(false)} className="hover:text-primary">Story</a>
                <a href="/#visit" onClick={() => setMobileNavOpen(false)} className="hover:text-primary">Visit</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="border-t border-border bg-card/95">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-3 grid gap-3 md:grid-cols-[minmax(190px,auto)_minmax(240px,560px)_auto] md:items-center text-sm">
            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="flex items-center gap-2 min-w-0 text-left hover:text-primary transition-colors"
            >
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate font-medium">{userLocation}</span>
            </button>
            <div className="relative w-full min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in menu"
                className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="hidden sm:flex items-center justify-end gap-2 text-muted-foreground shrink-0">
              <Clock className="h-4 w-4 text-primary" />
              <span>Standard 30-45 min</span>
            </div>
          </div>
        </div>
      </header>

      {isOutsideDeliveryRadius && (
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 pt-4">
          <div className="rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold shadow-sm">
            {deliveryUnavailableMessage}
          </div>
        </div>
      )}

      {/* HEADER */}
      <section className="relative border-b border-border bg-background">
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-display leading-[0.9]">
              The <span className="text-primary">Menu</span>.
            </h1>
          </div>
        </div>
      </section>

      {/* MAIN MENU */}
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        {/* LEFT column */}
        <div className="min-w-0">
          {/* Sticky search + categories */}
          <div className="sticky top-[180px] md:top-[144px] z-40 -mx-5 lg:mx-0 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="px-5 lg:px-0 py-3 flex gap-3 items-center">
              <div ref={categoryScrollerRef} className="flex-1 overflow-x-auto scrollbar-none">
                <div className="flex gap-2 min-w-max">
                  {MENU.map((c) => (
                    <a
                      key={c.id}
                      ref={(node) => {
                        categoryRefs.current[c.id] = node;
                      }}
                      href={`#cat-${c.id}`}
                      onClick={() => setActive(c.id)}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-semibold transition-all ${
                        active === c.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-secondary text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                      }`}
                    >
                      {c.name} {c.items.length ? <span className="opacity-70">({c.items.length})</span> : null}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <main className="py-10 space-y-14">
            {filtered.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-40">
                <div className="mb-5">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{cat.name}</h2>
                  {cat.blurb && <p className="text-muted-foreground text-sm mt-1">{cat.blurb}</p>}
                </div>

                {cat.items.length === 0 ? (
                  <div className="text-muted-foreground italic text-sm py-4">Coming soon.</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {cat.items.map((item, idx) => {
                      const qty = cart[item.id] ?? 0;
                      return (
                        <motion.article
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => addAndOpenCart(item.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              addAndOpenCart(item.id);
                            }
                          }}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                          whileHover={{ y: -2 }}
                          className="group relative flex gap-4 bg-card border border-border hover:border-primary/50 hover:shadow-lg rounded-2xl p-4 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1.5">
                              <h3 className="text-base font-bold leading-tight">{item.name}</h3>
                              {item.tag && (
                                <span className="shrink-0 bg-accent text-accent-foreground text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <div className="text-primary font-bold mb-1.5">${item.price.toFixed(2)}</div>
                            {item.desc && <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{item.desc}</p>}
                            {item.spicy && (
                              <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-semibold">
                                <Flame className="h-3.5 w-3.5" /> Spicy
                              </div>
                            )}
                          </div>

                          <div className="relative shrink-0">
                            {item.img ? (
                              <div className="relative h-28 w-28 rounded-xl overflow-hidden">
                                <img src={item.img} alt={item.name} loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              </div>
                            ) : (
                              <div className="h-28 w-28 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                                No photo
                              </div>
                            )}

                            {/* Quantity control overlay */}
                            <div className="absolute -bottom-2 -right-2">
                              <AnimatePresence mode="wait" initial={false}>
                                {qty === 0 ? (
                                  <motion.button
                                    key="add"
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.6, opacity: 0 }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      addAndOpenCart(item.id);
                                    }}
                                    aria-label={`Add ${item.name}`}
                                    className="h-9 w-9 rounded-full bg-white text-primary border border-border shadow-md hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </motion.button>
                                ) : (
                                  <motion.div
                                    key="qty"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 h-9"
                                  >
                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        dec(item.id);
                                      }}
                                      className="h-9 w-8 flex items-center justify-center hover:bg-black/10 rounded-l-full"
                                      aria-label="Decrease"
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-sm">{qty}</span>
                                    <button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        addAndOpenCart(item.id);
                                      }}
                                      className="h-9 w-8 flex items-center justify-center hover:bg-black/10 rounded-r-full"
                                      aria-label="Increase"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </section>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">No items match "{query}".</div>
            )}
          </main>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <SharedCartPanel
              mode={mode} setMode={setMode}
              entries={cartEntries} subtotal={subtotal}
              deliveryFee={deliveryFee} tax={tax} total={total}
              dec={dec} add={add} remove={remove}
              deliveryDisabled={isOutsideDeliveryRadius}
              deliveryUnavailableMessage={deliveryUnavailableMessage}
            />
          </div>
        </aside>
      </div>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-background z-[80] shadow-2xl overflow-hidden"
            >
              <div className="h-16 px-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  All carts
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                  className="h-9 w-9 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">
                <SharedCartPanel
                  mode={mode} setMode={setMode}
                  entries={cartEntries} subtotal={subtotal}
                  deliveryFee={deliveryFee} tax={tax} total={total}
                  dec={dec} add={add} remove={remove}
                  deliveryDisabled={isOutsideDeliveryRadius}
                  deliveryUnavailableMessage={deliveryUnavailableMessage}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddressPickerModal
        open={addressModalOpen}
        value={userLocation}
        coords={selectedCoords}
        fallbackCoords={STORE_COORDS}
        deliveryRadiusKm={DELIVERY_RADIUS_KM}
        onClose={closeAddressModal}
        onSelect={saveLocation}
      />

      {/* FOOTER */}
      <footer className="bg-ink text-white mt-10 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12">
            <div>
              <img src={logoWhite} alt="Hakka Express" className="h-14 w-auto mb-5" />
              <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                Indo-Chinese comfort food, cooked fresh in Saskatoon.
              </p>
              <div className="flex gap-3 mt-6">
                {[
                  { Icon: Instagram, href: "https://instagram.com" },
                  { Icon: Facebook, href: "https://facebook.com" },
                  { Icon: Mail, href: "mailto:hakkaexpress13@gmail.com" },
                ].map(({ Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 w-10 rounded-full border border-white/20 hover:border-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-bold">Explore</div>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-white/70 hover:text-accent transition-colors">Home</Link></li>
                <li><Link to="/menu" className="text-white/70 hover:text-accent transition-colors">Menu</Link></li>
                <li><a href="#cat-popular" className="text-white/70 hover:text-accent transition-colors">Popular</a></li>
                <li><a href="#cat-appetizers" className="text-white/70 hover:text-accent transition-colors">Appetizers</a></li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-bold">Restaurant</div>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>3000 Diefenbaker Drive #13, Saskatoon, SK</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <a href="tel:+13063438880" className="hover:text-accent transition-colors">(306) 343-8880</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <a href="mailto:hakkaexpress13@gmail.com" className="hover:text-accent transition-colors">hakkaexpress13@gmail.com</a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-bold">Hours</div>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Open 7 days</span>
                </li>
                <li>11:30 AM - 10:00 PM</li>
                <li>Delivery and pick-up available.</li>
              </ul>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-accent mb-5 font-bold">Order Direct</div>
              <p className="text-sm md:text-[15px] text-white/75 leading-relaxed">
                Skip the third-party fees. Order direct for the freshest, fastest experience.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3 text-xs uppercase tracking-widest text-white/60">
            <div>© 2019 Hakka Express. All rights reserved.</div>
            <div>3000 Diefenbaker Drive #13, Saskatoon, SK</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LegacyCartPanel({
  mode, setMode, entries, subtotal, deliveryFee, tax, total, dec, add, remove,
}: {
  mode: "delivery" | "pickup";
  setMode: (m: "delivery" | "pickup") => void;
  entries: { item: Item; qty: number }[];
  subtotal: number; deliveryFee: number; tax: number; total: number;
  dec: (id: string) => void; add: (id: string) => void; remove: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Delivery / Pickup toggle */}
      <div className="grid grid-cols-2 border-b border-border">
        {(["delivery", "pickup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`py-4 text-sm font-semibold capitalize transition-all relative ${
              mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div>{m === "delivery" ? "Delivery" : "Pick-up"}</div>
            {mode === m && <div className="text-[10px] text-muted-foreground mt-0.5">{m === "delivery" ? "Standard (30–45 min)" : "Ready in 15–20 min"}</div>}
            {mode === m && <div className="absolute bottom-0 inset-x-6 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

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

            {/* STRIPE PLACEHOLDER — replace onClick with real Stripe Checkout later */}
            <button
              onClick={() => alert("Stripe Checkout coming soon.")}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-3.5 rounded-full text-sm uppercase tracking-wider transition-all hover:scale-[1.01] shadow-lg shadow-primary/30"
            >
              <CreditCard className="h-4 w-4" /> Pay with Card <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-widest">Stripe · Secure Checkout</p>
          </div>
        </>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Phone, MapPin, Clock, Instagram, Facebook, Mail,
  Flame, Leaf, Truck, Star, ArrowRight, ShoppingBag, UtensilsCrossed, X, Menu as MenuIcon,
} from "lucide-react";

import { CartPanel } from "@/components/CartPanel";
import { usePersistentCart } from "@/lib/cart";
import logoColor from "@/assets/Logos/Hakka Express logo.png";
import logoWhite from "@/assets/Logos/Hakka Express White.png";
import heroFood from "@/assets/hero-food.jpg";
import heroWok from "@/assets/hero-wok.jpg";
import dishChili from "@/assets/dish-chili-chicken.jpg";
import dishNoodles from "@/assets/dish-noodles.jpg";
import dishRice from "@/assets/dish-rice.jpg";
import dishLollipop from "@/assets/dish-lollipop.jpg";
import dishSoup from "@/assets/dish-soup.jpg";
import dishPotato from "@/assets/dish-honey-potato.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hakka Express | Indo-Chinese Cuisine in Saskatoon" },
      { name: "description", content: "Hakka-style Indo-Chinese street food in Saskatoon. Chili chicken, hakka noodles, schezwan rice & more for dine-in, takeout or delivery." },
      { property: "og:title", content: "Hakka Express | Indo-Chinese Food in Saskatoon" },
      { property: "og:description", content: "Fiery, full-flavor Indo-Chinese cuisine at 3000 Diefenbaker Dr, Saskatoon." },
      { property: "og:image", content: heroFood },
      { name: "twitter:image", content: heroFood },
    ],
  }),
  component: Home,
});

const ORDER_URL = "https://orders.iorders.online/hakka-express-saskatoon";

const slides = [heroWok, heroFood, dishChili, dishNoodles, dishRice];

const popular = [
  { id: "p1", name: "Chili Chicken", price: "14.99", img: dishChili },
  { id: "p2", name: "Hakka Chow Mein", price: "13.99", img: dishNoodles },
  { id: "p3", name: "Schezwan Fried Rice", price: "13.99", img: dishRice },
  { id: "p4", name: "Chicken Lollipop", price: "14.99", img: dishLollipop },
  { id: "s1", name: "Hot & Sour Soup", price: "11.99", img: dishSoup },
  { id: "a1", name: "Honey Chilli Potato", price: "12.99", img: dishPotato },
];

const features = [
  { icon: Flame, title: "Cooked Fresh", desc: "Prepared hot to order for that smoky Hakka flavor." },
  { icon: Leaf, title: "Fresh Ingredients", desc: "Prepared with a clear focus on freshness and flavor." },
  { icon: Truck, title: "Pickup and Delivery", desc: "Order for pickup or delivery across Saskatoon." },
  { icon: UtensilsCrossed, title: "Indo-Chinese Favorites", desc: "Chinese cooking techniques with bold Indian spices." },
];

const navLinks = [
  { label: "Why", href: "#about" },
  { label: "Story", href: "#story" },
  { label: "Visit", href: "#visit" },
];

const testimonials = [
  { name: "Priya S.", text: "Best chili chicken in Saskatoon — hands down. The flavors are next level.", rating: 5 },
  { name: "Marcus T.", text: "Discovered this place by accident. Now it's our weekly Friday ritual.", rating: 5 },
  { name: "Aisha K.", text: "Finally an Indo-Chinese spot that actually nails the flavor. Obsessed.", rating: 5 },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { entries: cartEntries, totalItems, subtotal, add, dec, remove } = usePersistentCart();
  const deliveryFee = mode === "delivery" ? (subtotal > 0 ? (subtotal >= 30 ? 0 : 3.99) : 0) : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden text-foreground">
      {/* NAV */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-gradient-to-b from-black/40 to-transparent"}`}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-8 h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoColor} alt="Hakka Express" className="h-14 w-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]" />
          </Link>
          <ul className={`hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-semibold ${scrolled ? "text-foreground" : "text-white"}`}>
            <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label="Open navigation menu"
              className={`md:hidden h-11 w-11 rounded-full border flex items-center justify-center transition-all ${
                scrolled
                  ? "border-border bg-card text-foreground hover:text-primary"
                  : "border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary"
              }`}
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className={`relative h-11 w-11 rounded-full border flex items-center justify-center transition-all ${
                scrolled
                  ? "border-border bg-card text-foreground hover:text-primary"
                  : "border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
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
                <Link to="/menu" onClick={() => setMobileNavOpen(false)} className="hover:text-primary">Menu</Link>
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} onClick={() => setMobileNavOpen(false)} className="hover:text-primary">
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide}
            src={slides[slide]}
            alt="Hakka Express signature dishes"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 6, ease: "linear" } }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-10 bg-primary" : "w-5 bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 inset-x-0 border-y-2 border-primary bg-primary text-primary-foreground overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-3 font-display text-2xl tracking-widest">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0">
                {["HAKKA EXPRESS", "HOT & FRESH", "DINE IN", "TAKEOUT", "DELIVERY", "INDO-CHINESE", "SASKATOON, SK"].map((t, j) => (
                  <span key={j} className="px-8 flex items-center gap-8">
                    {t} <span className="text-accent">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DISHES */}
      <section id="popular" className="py-20 lg:py-28 relative bg-background">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
              <div className="inline-flex items-center gap-2 text-primary uppercase tracking-[0.3em] text-xs mb-3 font-bold">
                <Flame className="h-3.5 w-3.5" /> Popular
              </div>
              <h2 className="text-4xl md:text-5xl font-display leading-none">
                The dishes <span className="text-primary">everyone</span> orders.
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">Most ordered right now.</p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map((d, i) => (
              <motion.article key={d.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                whileHover={{ y: -3 }}
                className="group">
                <Link
                  to="/menu"
                  className="relative flex gap-3 bg-card border border-border hover:border-primary hover:shadow-lg rounded-2xl p-4 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground leading-tight mb-1 truncate">{d.name}</h3>
                    <div className="text-primary font-bold text-base">${d.price}</div>
                  </div>
                  <div className="relative shrink-0 h-24 w-24 rounded-xl overflow-hidden">
                    <img src={d.img} alt={d.name} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <span
                      aria-label={`View ${d.name}`}
                      className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-white text-primary border border-border flex items-center justify-center shadow-md group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/menu"
               className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-full uppercase tracking-wider text-sm transition-all hover:scale-[1.04] shadow-lg shadow-primary/30">
              Visit Our Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-24 lg:py-32 bg-ink text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-primary uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-bold">Word on the Street</div>
            <h2 className="text-6xl md:text-7xl font-display leading-none">What Saskatoon is saying.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/60 hover:bg-white/10 transition-all">
                <div className="absolute -top-4 left-7 text-7xl text-primary/30 font-display leading-none">"</div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-white/90 leading-relaxed mb-6">{t.text}</p>
                <div className="text-sm uppercase tracking-widest text-white/55 font-semibold">- {t.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="about" className="py-24 lg:py-32 relative bg-background">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fade}
            className="grid lg:grid-cols-12 gap-10 mb-16">
            <div className="lg:col-span-5">
              <div className="text-primary uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-bold">Why Hakka Express</div>
              <h2 className="text-5xl md:text-6xl font-display leading-none">
                Old-world technique. <span className="text-primary">New-world fire.</span>
              </h2>
            </div>
            <p className="lg:col-span-7 text-lg text-muted-foreground self-end max-w-2xl">
              Hakka cooking brings Chinese wok technique together with Indian spice. At Hakka Express,
              that means hot pans, bold sauces, and food made fresh when the order comes in.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative bg-card border border-border hover:border-primary/60 hover:shadow-xl rounded-2xl p-7 transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl mb-2 font-display tracking-wider text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="py-24 lg:py-32 bg-ink text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-accent/40 shadow-2xl">
              <img src={dishChili} alt="Hakka cooking" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-[0.3em] text-accent mb-1 font-bold">Est. 2019 - Saskatoon</div>
                <div className="font-display text-4xl">Hakka Express</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="lg:col-span-7">
            <div className="text-accent uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-bold">Our Story</div>
            <h2 className="text-5xl md:text-6xl font-display leading-[0.95] mb-6">
              From Kolkata's <span className="text-primary">Chinatown</span> to your table.
            </h2>
            <div className="space-y-5 text-white/70 text-lg leading-relaxed">
              <p>
                Hakka cooking grew from Chinese families cooking in India, where soy, garlic,
                chili, and wok heat came together in a way people still crave today.
              </p>
              <p>
                At Hakka Express, we keep that flavor close: fresh ingredients, fast wok work,
                and food with the heat and comfort people come back for.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "7", l: "Days a Week" },
                { n: "Fresh", l: "Made Daily" },
                { n: "4.8", l: "Rated" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-4xl md:text-5xl font-display gold-text">{s.n}</div>
                  <div className="text-xs uppercase tracking-widest text-white/50 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* VISIT */}
      <section
        id="visit"
        className="py-24 lg:py-32 relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(255, 194, 69, 0.16), transparent 32%), linear-gradient(135deg, #2a0305 0%, #5f0a11 52%, #160203 100%)",
        }}
      >

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="text-primary uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-bold">Visit Us</div>
            <h2 className="text-6xl md:text-7xl font-display leading-none mb-8">
              Come hungry. <span className="text-primary">Leave full.</span>
            </h2>
            <div className="space-y-6">
              <a href="https://maps.google.com/?q=3000+Diefenbaker+Drive+Saskatoon" target="_blank" rel="noreferrer"
                 className="flex gap-4 items-start group">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Address</div>
                  <div className="text-lg">3000 Diefenbaker Drive #13, Saskatoon, SK</div>
                </div>
              </a>
              <a href="tel:+13063438880" className="flex gap-4 items-start group">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Call</div>
                  <div className="text-lg">(306) 343-8880</div>
                </div>
              </a>
              <div className="flex gap-4 items-start">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Hours</div>
                  <div className="text-lg">Open 7 days · 11:30 AM — 10:00 PM</div>
                </div>
              </div>
              <a href="mailto:hakkaexpress13@gmail.com" className="flex gap-4 items-start group">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Email</div>
                  <div className="text-lg">hakkaexpress13@gmail.com</div>
                </div>
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={ORDER_URL} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-7 py-4 rounded-full uppercase tracking-wider text-sm transition-all hover:scale-[1.04] shadow-lg shadow-primary/30">
                Order Now <ArrowRight className="h-4 w-4" />
              </a>
              <a href="tel:+13063438880"
                 className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-primary hover:text-primary px-7 py-4 rounded-full uppercase tracking-wider text-sm font-semibold transition-all">
                <Phone className="h-4 w-4" /> Call to Reserve
              </a>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden border-2 border-border shadow-xl h-[500px] lg:h-auto min-h-[400px]">
            <iframe
              title="Hakka Express location"
              src="https://www.google.com/maps?q=3000+Diefenbaker+Drive,+Saskatoon,+SK&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-4">
              <img src={logoWhite} alt="Hakka Express" className="h-16 w-auto mb-6" />
              <p className="text-white/70 leading-relaxed max-w-sm">
                Indo-Chinese comfort food in the heart of Saskatoon. Cooked fresh and served with fire.
              </p>
              <div className="flex gap-3 mt-7">
                {[
                  { Icon: Instagram, href: "https://instagram.com" },
                  { Icon: Facebook, href: "https://facebook.com" },
                  { Icon: Mail, href: "mailto:hakkaexpress13@gmail.com" },
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noreferrer"
                     className="h-11 w-11 rounded-full border border-white/20 hover:border-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-bold">Explore</div>
              <ul className="space-y-3 text-sm">
                <li><Link to="/menu" className="text-white/70 hover:text-accent transition-colors">Menu</Link></li>
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/70 hover:text-accent transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-bold">Visit</div>
              <ul className="space-y-3 text-sm text-white/70">
                <li>3000 Diefenbaker Drive #13</li>
                <li>Saskatoon, SK · Canada</li>
                <li>Open 11:30 AM — 10:00 PM</li>
                <li>7 days a week</li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="text-xs uppercase tracking-[0.35em] text-accent mb-5 font-bold">Order Direct</div>
              <p className="text-sm md:text-[15px] text-white/75 leading-relaxed max-w-sm">
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
                <CartPanel
                  mode={mode} setMode={setMode}
                  entries={cartEntries} subtotal={subtotal}
                  deliveryFee={deliveryFee} tax={tax} total={total}
                  dec={dec} add={add} remove={remove}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

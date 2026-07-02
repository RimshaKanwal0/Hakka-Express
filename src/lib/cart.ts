import { useEffect, useMemo, useState } from "react";

import dishChili from "@/assets/dish-chili-chicken.jpg";
import dishNoodles from "@/assets/dish-noodles.jpg";
import dishRice from "@/assets/dish-rice.jpg";
import dishLollipop from "@/assets/dish-lollipop.jpg";
import dishSoup from "@/assets/dish-soup.jpg";
import dishPotato from "@/assets/dish-honey-potato.jpg";

export type CartItem = {
  id: string;
  name: string;
  desc?: string;
  price: number;
  img?: string;
  tag?: string;
  spicy?: boolean;
};

export type CartEntry = {
  item: CartItem;
  qty: number;
};

export type CartState = Record<string, number>;

export const CART_ITEMS: Record<string, CartItem> = {
  // Home-page featured items.
  p1: { id: "p1", name: "Chili Chicken", desc: "Crispy chicken tossed in a smoky sweet-spicy chili glaze.", price: 14.99, img: dishChili, spicy: true },
  p2: { id: "p2", name: "Hakka Chow Mein", desc: "Hand-pulled noodles wok-tossed with vegetables.", price: 13.99, img: dishNoodles },
  p3: { id: "p3", name: "Schezwan Fried Rice", desc: "Fiery schezwan-tossed rice with veggies.", price: 13.99, img: dishRice, spicy: true },
  p4: { id: "p4", name: "Chicken Lollipop", desc: "Marinated drumettes, golden fried.", price: 14.99, img: dishLollipop },

  lc1: { id: "lc1", name: "Steam Rice with Shrimp Str Fry", desc: "Monday to Saturday lunch combo - includes 355 ml pop", price: 10.99 },
  lc2: { id: "lc2", name: "Steam Rice with Veg Str Fry", desc: "Monday to Saturday lunch combo - includes 355 ml pop", price: 10.99 },
  lc3: { id: "lc3", name: "Steam Rice with Chicken Str Fry", desc: "Monday to Saturday lunch combo - includes 355 ml pop", price: 10.99 },
  lc4: { id: "lc4", name: "Steam Rice with Beef Str Fry", desc: "Monday to Saturday lunch combo - includes 355 ml pop", price: 10.99 },

  b1: { id: "b1", name: "Stuffed Kulcha With Cheese", desc: "Burger", price: 5.5 },
  b2: { id: "b2", name: "Vada Pav", desc: "Burger", price: 4.99 },
  b3: { id: "b3", name: "Vada Pav With Cheese", desc: "Burger", price: 6.99 },
  b4: { id: "b4", name: "Vada Pav (3 Pcs)", desc: "Burger", price: 12.99 },
  b5: { id: "b5", name: "Chicken Noodle Burger", desc: "Burger - noodle, chicken patti and burger", price: 9.99 },
  b6: { id: "b6", name: "Noodle Burger With Cheese", desc: "Burger - burger, potato patties, 2 cheese slices", price: 8.99 },
  b7: { id: "b7", name: "Noodle Burger With Paneer", desc: "Burger - noodle, potato patties, burger and two slices of grilled paneer", price: 8.99 },
  b8: { id: "b8", name: "Aloo Tikki Veg Burger", desc: "Burger", price: 7.99 },
  b9: { id: "b9", name: "Aloo Tikki Veg Noodle Burger", desc: "Burger", price: 9.99 },
  b10: { id: "b10", name: "Aloo Tikki Veg Noodle Burger With Cheese", desc: "Burger", price: 10.99 },
  b11: { id: "b11", name: "Aloo Tikki Veg Noodle Burger With Paneer", desc: "Burger", price: 10.99 },
  b12: { id: "b12", name: "Aloo Tikki Veg Noodle Burger With Cheese And Paneer", desc: "Burger", price: 12.99 },
  b13: { id: "b13", name: "Chicken Burger", desc: "Burger", price: 8.99 },
  b14: { id: "b14", name: "Stuffed Kulcha", desc: "Burger", price: 4.99 },
  b15: { id: "b15", name: "Stuffed Kulcha With Paneer", desc: "Burger", price: 5.5 },

  w1: { id: "w1", name: "Chicken Wings (10 Pcs)", desc: "Wings - 10 pcs chicken wings", price: 10.99 },
  d1: { id: "d1", name: "Gulab Jamun", desc: "Desserts", price: 3.99 },

  ch1: { id: "ch1", name: "Cashew Chicken", desc: "Chicken", price: 14.99 },
  ch2: { id: "ch2", name: "Chilli Chicken Gravy", desc: "Chicken", price: 14.99, spicy: true },
  ch3: { id: "ch3", name: "Manchurian Chicken Gravy", desc: "Chicken", price: 14.99 },
  ch4: { id: "ch4", name: "Schezwan Chicken", desc: "Chicken", price: 14.99, spicy: true },
  ch5: { id: "ch5", name: "Sweet N Sour Chicken", desc: "Chicken", price: 14.99 },
  ch6: { id: "ch6", name: "Chicken 65", desc: "Chicken", price: 14.99, spicy: true },
  ch7: { id: "ch7", name: "Lemon Chicken", desc: "Chicken", price: 13.99 },

  rice1: { id: "rice1", name: "Paneer Rajma Rice", desc: "Rice", price: 11.99 },
  rice2: { id: "rice2", name: "Vegetable Fried Rice", desc: "Rice", price: 14.99 },
  rice3: { id: "rice3", name: "Egg Fried Rice", desc: "Rice", price: 15.99 },
  rice4: { id: "rice4", name: "Paneer Fried Rice", desc: "Rice", price: 16.99 },
  rice5: { id: "rice5", name: "Chicken Fried Rice", desc: "Rice", price: 15.99 },
  rice6: { id: "rice6", name: "Beef Fried Rice", desc: "Rice", price: 15.99 },
  rice7: { id: "rice7", name: "Shrimp Fried Rice", desc: "Rice", price: 15.99 },
  rice8: { id: "rice8", name: "Schezwan Veg Fried Rice", desc: "Rice - spicy", price: 13.99, spicy: true },
  rice9: { id: "rice9", name: "Hakka Special Rice 2", desc: "Rice", price: 19.99 },
  rice10: { id: "rice10", name: "Rajma - Chaval", desc: "Rice", price: 12.99 },
  rice11: { id: "rice11", name: "Paneer Rajma - Chaval", desc: "Rice", price: 14.99 },
  rice12: { id: "rice12", name: "Steam Rice", desc: "Rice", price: 5.99 },
  rice13: { id: "rice13", name: "Schezwan Chicken Fried Rice", desc: "Rice - spicy", price: 15.99, spicy: true },
  rice14: { id: "rice14", name: "Rajma Rice", desc: "Rice", price: 8.99 },
  rice15: { id: "rice15", name: "Steam Rice With Cashew", desc: "Rice", price: 5.99 },
  rice16: { id: "rice16", name: "Hakka Special Rice 1", desc: "Rice - vegetable, egg, chicken, beef and shrimp", price: 19.99 },

  sd1: { id: "sd1", name: "Soft Drink (355 Ml)", desc: "Soft Drinks", price: 2.25 },

  soup1: { id: "soup1", name: "Chicken Manchow Soup (With Dry Noodles)", desc: "Soups - 32oz", price: 11.99 },
  soup2: { id: "soup2", name: "Beef Manchow Soup (With Dry Noodles)", desc: "Soups - 32oz", price: 11.99 },
  soup3: { id: "soup3", name: "Vegetable Sweet Corn Soup", desc: "Soups - 32oz", price: 11.99 },
  soup4: { id: "soup4", name: "Chicken Sweet Corn Soup", desc: "Soups - 32oz", price: 11.99 },
  soup5: { id: "soup5", name: "Veg Manchow Soup", desc: "Soups", price: 11.99 },
  soup6: { id: "soup6", name: "Veg Hot N Sour Soup", desc: "Soups - 32oz", price: 9.99 },
  soup7: { id: "soup7", name: "Chicken Hot N Sour Soup", desc: "Soups - 32oz", price: 11.99 },
  soup8: { id: "soup8", name: "Beef Hot N Sour Soup", desc: "Soups - 32oz", price: 11.99 },
  soup9: { id: "soup9", name: "Veg Manchow Soup (With Dry Noodles)", desc: "Soups - 32oz", price: 11.99 },

  sh1: { id: "sh1", name: "Sweet N Sour Shrimp", desc: "Shrimp", price: 14.99 },
  sh2: { id: "sh2", name: "Chilli Shrimp", desc: "Shrimp", price: 14.99 },
  sh3: { id: "sh3", name: "Schezwan Shrimp", desc: "Shrimp - spicy", price: 14.99, spicy: true },
  sh4: { id: "sh4", name: "Manchurian Shrimp", desc: "Shrimp", price: 14.99 },

  beef1: { id: "beef1", name: "Ginger Sesame Beef Gravy", desc: "Beef", price: 14.99 },
  beef2: { id: "beef2", name: "Chilli Beef Gravy", desc: "Beef", price: 14.99 },
  beef3: { id: "beef3", name: "Manchurian Beef Gravy", desc: "Beef", price: 14.99 },
  beef4: { id: "beef4", name: "Beef N Veg Stir Fry", desc: "Beef", price: 14.99 },

  fr1: { id: "fr1", name: "Paneer Frankie", desc: "Frankie - Roll", price: 14.99 },
  fr2: { id: "fr2", name: "Butter Chicken Frankie", desc: "Frankie - Roll", price: 14.99 },
  fr3: { id: "fr3", name: "Vegetable Noodle Frankie", desc: "Frankie - Roll", price: 12.99 },
  fr4: { id: "fr4", name: "Chicken Noodle Frankie", desc: "Frankie - Roll", price: 12.99 },
  fr5: { id: "fr5", name: "Veg Manchurian Frankie", desc: "Frankie - Roll", price: 13.99 },
  fr6: { id: "fr6", name: "Chilli Chicken Frankie", desc: "Frankie - Roll", price: 12.99 },
  fr7: { id: "fr7", name: "Frankie Sandwich", desc: "Frankie - Roll", price: 14.99 },
  fr8: { id: "fr8", name: "Schezwan Chicken Frankie", desc: "Frankie - Roll", price: 12.99, spicy: true },

  fish1: { id: "fish1", name: "Cashew Fish", desc: "Fish", price: 15.99 },
  fish2: { id: "fish2", name: "Schezwan Fish", desc: "Fish - spicy", price: 15.99, spicy: true },
  fish3: { id: "fish3", name: "Fish with Fries", desc: "Fish", price: 18.99 },
  fish4: { id: "fish4", name: "Manchurian Fish - Dry", desc: "Fish", price: 15.99 },
  fish5: { id: "fish5", name: "Sweet N Sour Fish", desc: "Fish", price: 15.99 },
  fish6: { id: "fish6", name: "Ginger Onion Fish", desc: "Fish", price: 15.99 },
  fish7: { id: "fish7", name: "Chilli Fish Dry", desc: "Fish", price: 15.99 },
  fish8: { id: "fish8", name: "Chilli Fish With Fries", desc: "Fish", price: 16.99 },

  side1: { id: "side1", name: "Boiled Egg (4 pcs)", desc: "Side - served with onion and green chutney", price: 8.99 },
  side2: { id: "side2", name: "Plain Onion (8 Oz)", desc: "Side", price: 3.5 },
  side3: { id: "side3", name: "Plain Curd (8 Oz)", desc: "Side", price: 3.5 },
  side4: { id: "side4", name: "Plain Curd (12 Oz)", desc: "Side", price: 4.99 },
  side5: { id: "side5", name: "Raita (8 Oz)", desc: "Side", price: 3.5 },
  side6: { id: "side6", name: "Extra Mayo On Side", desc: "Side", price: 0.75 },
  side7: { id: "side7", name: "Extra Red Chatani On Side", desc: "Side", price: 0.75 },
  side8: { id: "side8", name: "Raita (12 Oz)", desc: "Side", price: 4.99 },
  side9: { id: "side9", name: "Mint Chatani Extra On Side", desc: "Side", price: 0.75 },

  drink1: { id: "drink1", name: "Fresh Lemonade (16 oz)", desc: "Drinks / Shake", price: 5.5 },
  drink2: { id: "drink2", name: "Mango Lassi with Dry fruits (16 oz)", desc: "Drinks / Shake", price: 6 },
  drink3: { id: "drink3", name: "Vanilla Mango Lassi (16 oz)", desc: "Drinks / Shake", price: 7 },
  drink4: { id: "drink4", name: "Nutella Shake (16 oz)", desc: "Drinks / Shake", price: 7.75 },
  drink5: { id: "drink5", name: "Oreo Shake (16 oz)", desc: "Drinks / Shake", price: 7.75 },
  drink6: { id: "drink6", name: "Strawberry Shake (16 oz)", desc: "Drinks / Shake", price: 7.75 },
  drink7: { id: "drink7", name: "Masala tea (10 oz)", desc: "Drinks / Shake", price: 3.5 },
  drink8: { id: "drink8", name: "Mango Lassi", desc: "Drinks / Shake - 16 oz", price: 5.25 },
  drink9: { id: "drink9", name: "Salty Lassi (16 oz)", desc: "Drinks / Shake", price: 4.99 },
  drink10: { id: "drink10", name: "Sweet Lassi (16 oz)", desc: "Drinks / Shake", price: 4.99 },

  app1: { id: "app1", name: "Chicken Lollipop With Sauce (6-8 Pcs)", desc: "Appetizers", price: 22.99 },
  app2: { id: "app2", name: "Paneer Pakora (9 Pcs)", desc: "Appetizers", price: 14.99 },
  app3: { id: "app3", name: "Veg Samosa", desc: "Appetizers - 6 Pcs", price: 10.99 },
  app4: { id: "app4", name: "Mint Green Chutney", desc: "Appetizers", price: 1.5 },
  app5: { id: "app5", name: "Tamarind Chutney", desc: "Appetizers", price: 1.5 },
  app6: { id: "app6", name: "Chicken Pakora (12-14 pcs)", desc: "Appetizers", price: 14.99 },
  app7: { id: "app7", name: "Fish Pakora (12-14 pcs)", desc: "Appetizers", price: 14.99 },
  app8: { id: "app8", name: "Aloo Tikki Chana Chat", desc: "Appetizers", price: 9.99 },
  app9: { id: "app9", name: "Hakka Special Chat", desc: "Appetizers - aloo tikka and papdi mix with chana", price: 12.99 },
  app10: { id: "app10", name: "Chicken Fried Masala Momos (10-12 pcs)", desc: "Appetizers", price: 14.99 },
  app11: { id: "app11", name: "Vegetable Fried Momos (10-12 Pcs)", desc: "Appetizers", price: 14.99 },
  app12: { id: "app12", name: "Vegetable Steam Masala Momos (10-12 pcs)", desc: "Appetizers - Steam momo with chilli gravy with bell pepper", price: 15.99 },
  app13: { id: "app13", name: "Vegetable Fried Masala Momos (10-12 pcs)", desc: "Appetizers - Fried momo with chilli gravy with bell pepper", price: 15.99 },
  app14: { id: "app14", name: "Papdi Chana Chat", desc: "Appetizers", price: 9.99 },
  app15: { id: "app15", name: "Tikki Chat", desc: "Appetizers - Potato patties with salty yogurt, mint, tamarind sauce, onion, dry noodle", price: 9.99 },
  app16: { id: "app16", name: "Beef Steam Momos (10-12 pcs)", desc: "Appetizers", price: 14.99 },
  app17: { id: "app17", name: "Vadapav", desc: "Appetizers", price: 3.75 },
  app18: { id: "app18", name: "Dahi Bhalla", desc: "Appetizers", price: 9.99 },
  app19: { id: "app19", name: "Samosa Chatt", desc: "Appetizers", price: 6.99 },
  app20: { id: "app20", name: "Beef Fried Momos (10-12 pcs)", desc: "Appetizers", price: 14.99 },
  app21: { id: "app21", name: "Beef Steam Masala Momos (10-12 pcs)", desc: "Appetizers", price: 14.99 },
  app22: { id: "app22", name: "Beef Fried Masala Momos (10-12 pcs)", desc: "Appetizers", price: 14.99 },
  app23: { id: "app23", name: "Chicken Fried Momos (10-12 Pcs)", desc: "Appetizers", price: 14.99 },
  app24: { id: "app24", name: "Chicken Steam Masala Momos (10-12 pcs)", desc: "Appetizers", price: 14.99 },
  app25: { id: "app25", name: "Chicken Lollipop With Sauce (4-5 Pcs)", desc: "Appetizers", price: 13.99 },
  app26: { id: "app26", name: "Chicken Pakora (10-12 Pcs)", desc: "Appetizers", price: 15.99 },
  app27: { id: "app27", name: "Fish Pakora (10-12 Pcs)", desc: "Appetizers", price: 15.99 },
  app28: { id: "app28", name: "Vegetable Pakora (12-14 Pcs)", desc: "Appetizers", price: 10.99 },
  app29: { id: "app29", name: "Vegetable Springroll (2 Pcs)", desc: "Appetizers", price: 2.49 },
  app30: { id: "app30", name: "Vegetable Steam Momos (10-12 Pcs)", desc: "Appetizers", price: 14.99 },
  app31: { id: "app31", name: "Chicken Steam Momos (10-12 Pcs)", desc: "Appetizers", price: 14.99 },
  app32: { id: "app32", name: "Chilli Potato", desc: "Appetizers", price: 11.99 },
  app33: { id: "app33", name: "Honey Chilli Potato", desc: "Appetizers", price: 12.99 },
  app34: { id: "app34", name: "Chilli Cauliflower", desc: "Appetizers", price: 13.99 },
  app35: { id: "app35", name: "Cauliflower Honey Chilli", desc: "Appetizers", price: 14.99 },

  veg1: { id: "veg1", name: "Veg Manchurian Gravy", desc: "Vegetarian", price: 15.99 },
  veg2: { id: "veg2", name: "Soya Manchurian", desc: "Vegetarian", price: 14.99 },
  veg3: { id: "veg3", name: "Chilli Paneer Gravy", desc: "Vegetarian", price: 15.99 },
  veg4: { id: "veg4", name: "Chilli Cauliflower Dry", desc: "Vegetarian", price: 15.99 },
  veg5: { id: "veg5", name: "Soya Chilli", desc: "Vegetarian", price: 14.99 },
  veg6: { id: "veg6", name: "Soya Malai", desc: "Vegetarian", price: 14.99 },
  veg7: { id: "veg7", name: "Cauliflower [Gobi] Manchurian", desc: "Vegetarian", price: 15.99 },

  cm1: { id: "cm1", name: "Vegetable Chowmein", desc: "Chowmein (Noodle) - vegetable = Cabbage + carrot + bell pepper", price: 13.99 },
  cm2: { id: "cm2", name: "Egg Chowmein", desc: "Chowmein (Noodle) - vegetable + Egg", price: 13.99 },
  cm3: { id: "cm3", name: "Paneer Chowmein", desc: "Chowmein (Noodle) - vegetable + paneer", price: 15.99 },
  cm4: { id: "cm4", name: "Chicken Chowmein", desc: "Chowmein (Noodle) - vegetable + Chicken", price: 15.99 },
  cm5: { id: "cm5", name: "Beef Chowmein", desc: "Chowmein (Noodle) - Vegetable + Beef", price: 15.99 },
  cm6: { id: "cm6", name: "Shrimp Chowmein", desc: "Chowmein (Noodle) - Vegetable + Shrimp", price: 15.99 },
  cm7: { id: "cm7", name: "Hakka Special Chowmein 1", desc: "Chowmein (Noodle) - vegetable+Egg+Chicken+beef+shrimp", price: 19.99 },
  cm8: { id: "cm8", name: "Chicken Beef Chowmein", desc: "Chowmein (Noodle) - vegetable + Chicken + Beef", price: 17.99 },
  cm9: { id: "cm9", name: "Shrimp with Beef Chowmein", desc: "Chowmein (Noodle)", price: 16.99 },
  cm10: { id: "cm10", name: "Hakka Special Chowmein 2", desc: "Chowmein (Noodle) - choose any three - vegetable+Egg+Chicken+beef+shrimp", price: 17.99 },

  a1: { id: "a1", name: "Honey Chilli Potato", desc: "Crispy potato batons in honey-chilli glaze.", price: 12.99, img: dishPotato },
  a2: { id: "a2", name: "Veg Spring Rolls", desc: "Crispy rolls stuffed with seasoned vegetables.", price: 9.99 },
  s1: { id: "s1", name: "Hot & Sour Soup", desc: "Tangy peppery broth with chicken or veg.", price: 11.99, img: dishSoup },
  s2: { id: "s2", name: "Manchow Soup", desc: "Spicy Indo-Chinese soup with crispy noodles.", price: 11.99, spicy: true },
  n1: { id: "n1", name: "Hakka Chow Mein", desc: "Classic wok-tossed noodles.", price: 13.99, img: dishNoodles },
  n2: { id: "n2", name: "Schezwan Chow Mein", desc: "Noodles fired with schezwan sauce.", price: 14.49, spicy: true },
  r1: { id: "r1", name: "Chicken Fried Rice", desc: "Wok-tossed rice with chicken & veggies.", price: 13.49, img: dishRice },
  r2: { id: "r2", name: "Schezwan Fried Rice", desc: "Spicy schezwan-style rice.", price: 13.99, spicy: true },
  c1: { id: "c1", name: "Chili Chicken", desc: "Crispy chicken, smoky chili glaze.", price: 14.99, img: dishChili, spicy: true },
  v1: { id: "v1", name: "Honey Chilli Potato", desc: "Glossy honey-chilli glaze.", price: 12.99, img: dishPotato },
};

const CART_STORAGE_KEY = "hakka-express-cart";

function readSavedCart(): CartState {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CartState;
    return Object.fromEntries(
      Object.entries(parsed).filter(([id, qty]) => CART_ITEMS[id] && Number.isFinite(qty) && qty > 0),
    );
  } catch {
    return {};
  }
}

export function usePersistentCart() {
  const [cart, setCart] = useState<CartState>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(readSavedCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, loaded]);

  const add = (id: string) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  const dec = (id: string) => setCart((current) => {
    const nextQty = (current[id] ?? 0) - 1;
    const next = { ...current };
    if (nextQty <= 0) delete next[id];
    else next[id] = nextQty;
    return next;
  });
  const remove = (id: string) => setCart((current) => {
    const next = { ...current };
    delete next[id];
    return next;
  });

  const entries = useMemo<CartEntry[]>(
    () => Object.entries(cart)
      .map(([id, qty]) => ({ item: CART_ITEMS[id], qty }))
      .filter((entry): entry is CartEntry => Boolean(entry.item)),
    [cart],
  );

  const totalItems = entries.reduce((sum, entry) => sum + entry.qty, 0);
  const subtotal = entries.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);

  return { cart, entries, totalItems, subtotal, add, dec, remove };
}

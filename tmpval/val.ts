import { CATEGORIES, ROOMS, AVAILABLE_PRODUCTS, PRODUCTS, AVAILABLE_CATEGORIES, AVAILABLE_ROOMS, productsByCategory, productsByRoom, isAvailableProduct } from "../src/lib/products";
console.log("total", PRODUCTS.length, "available", AVAILABLE_PRODUCTS.length);
console.log("invalid:", PRODUCTS.filter(p=>!isAvailableProduct(p)).map(p=>p.id+":"+p.category).join(", "));
for (const c of CATEGORIES) console.log("CAT", c.slug, productsByCategory(c.slug).length);
for (const r of ROOMS) console.log("ROOM", r.slug, productsByRoom(r.slug).length);
console.log("shown cats", AVAILABLE_CATEGORIES.length, "shown rooms", AVAILABLE_ROOMS.length);
const ids=new Set(), names=new Set();
for(const p of PRODUCTS){ if(ids.has(p.id))console.log("DUP ID",p.id); ids.add(p.id); if(names.has(p.name))console.log("DUP NAME",p.name); names.add(p.name);}

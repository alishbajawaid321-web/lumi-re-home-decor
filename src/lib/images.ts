import heroLiving from "@/assets/hero-living.jpg";
import shopTheLook from "@/assets/shop-the-look.jpg";
import catWallDecor from "@/assets/cat-wall-decor.jpg";
import catShowpieces from "@/assets/cat-showpieces.jpg";
import catPlants from "@/assets/cat-plants.jpg";
import catLighting from "@/assets/cat-lighting.jpg";
import catCandles from "@/assets/cat-candles.jpg";
import catMirrors from "@/assets/cat-mirrors.jpg";
import catRugs from "@/assets/cat-rugs.jpg";
import catSoftDecor from "@/assets/cat-soft-decor.jpg";
import catCurtains from "@/assets/cat-curtains.jpg";
import catVases from "@/assets/cat-vases.jpg";
import catStorage from "@/assets/cat-storage.jpg";
import catTabletop from "@/assets/cat-tabletop.jpg";
import catEntryway from "@/assets/cat-entryway.jpg";
import catKids from "@/assets/cat-kids.jpg";
import catOutdoor from "@/assets/cat-outdoor.jpg";
import catPersonalized from "@/assets/cat-personalized.jpg";
import catIslamic from "@/assets/cat-islamic.jpg";
import catHandmade from "@/assets/cat-handmade.jpg";
import catFestive from "@/assets/cat-festive.jpg";
import roomBedroom from "@/assets/room-bedroom.jpg";
import roomDining from "@/assets/room-dining.jpg";
import roomBathroom from "@/assets/room-bathroom.jpg";
import roomOffice from "@/assets/room-office.jpg";
import roomEntrance from "@/assets/room-entrance.jpg";
import roomKids from "@/assets/room-kids.jpg";

/** Single registry: every image key used by product / category / room data. */
export const IMAGES = {
  "hero-living": heroLiving,
  "shop-the-look": shopTheLook,
  "wall-decor": catWallDecor,
  showpieces: catShowpieces,
  plants: catPlants,
  lighting: catLighting,
  candles: catCandles,
  mirrors: catMirrors,
  rugs: catRugs,
  "soft-decor": catSoftDecor,
  curtains: catCurtains,
  vases: catVases,
  storage: catStorage,
  tabletop: catTabletop,
  entryway: catEntryway,
  kids: catKids,
  outdoor: catOutdoor,
  personalized: catPersonalized,
  islamic: catIslamic,
  handmade: catHandmade,
  festive: catFestive,
  diy: catHandmade,
  "room-living": heroLiving,
  "room-bedroom": roomBedroom,
  "room-dining": roomDining,
  "room-bathroom": roomBathroom,
  "room-office": roomOffice,
  "room-entrance": roomEntrance,
  "room-kids": roomKids,
  "room-balcony": catOutdoor,
} as const;

export type ImageKey = keyof typeof IMAGES;

export const img = (key: string): string =>
  IMAGES[key as ImageKey] ?? IMAGES["shop-the-look"];

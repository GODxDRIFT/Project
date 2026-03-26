// import express, { Request, Response } from "express";
// import fetch, { RequestInit } from "node-fetch";
// import dotenv from "dotenv";

// interface AddressComponent {
//   long_name: string;
//   short_name: string;
//   types: string[];
// }

// dotenv.config();
// const router = express.Router();

// const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
// if (!GOOGLE_API_KEY) {
//   throw new Error("Missing GOOGLE_API_KEY in environment variables");
// }

// // Fetch with timeout
// async function fetchWithTimeout(url: string, ms = 4000, init: RequestInit = {}) {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), ms);
//   try {
//     const options: RequestInit = { ...init, signal: controller.signal };
//     return await fetch(url, options);
//   } finally {
//     clearTimeout(timeout);
//   }
// }

// router.get("/reverse-geocode", async (req: Request, res: Response) => {
//   const lat = Number(req.query.lat);
//   const lon = Number(req.query.lon);

//   if (Number.isNaN(lat) || Number.isNaN(lon)) {
//     return res.status(400).json({ status: false, message: "Latitude and longitude must be valid numbers." });
//   }

//   try {
//     /** ---------- 1. Nominatim ---------- */
//     const nomURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
//     const nomRes = await fetchWithTimeout(nomURL, 4000, {
//       headers: { "User-Agent": "Biziffy/1.0 (support@biziffy.com)" },
//     });
//     const nomJSON = await nomRes.json() as any;
//     const address = nomJSON.address || {};

//     const city = address.city || address.town || address.village || "";
//     const pincode = address.postcode || "";
//     const area = address.city_district || address.county || "";
//     const state = address.state || "";

//     if (city && pincode) {
//       return res.json({ status: true, source: "nominatim", area, city, state, pincode });
//     }

//     /** ---------- 2. Google Fallback ---------- */
//     const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`;
//     const googleRes = await fetchWithTimeout(googleURL, 4000);
//     const googleJSON = await googleRes.json() as any;

//     console.log("Google API JSON Response1 =>", googleJSON);

//     if (googleJSON.status !== "OK" || !googleJSON.results?.length) {
//       return res.status(400).json({
//         status: false,
//         message: "Google fallback failed",
//         error: googleJSON.error_message || googleJSON.status,
//       });
//     }

//     const comps = googleJSON.results[0].address_components as AddressComponent[];

//     const get = (...types: string[]) =>
//       comps.find((c: AddressComponent) => types.every(t => c.types.includes(t)))?.long_name || "";

//     const areaG =
//       get("sublocality_level_1") ||
//       get("sublocality") ||
//       get("neighborhood") ||
//       get("route");

//     const cityG = get("locality") || get("administrative_area_level_2");
//     const stateG = get("administrative_area_level_1");
//     const pinG = get("postal_code");

//     return res.json({
//       status: true,
//       source: "google",
//       area: areaG,
//       city: cityG,
//       state: stateG,
//       pincode: pinG,
//     });
//   } catch (e: any) {
//     if (e.name === "AbortError") {
//       return res.status(504).json({ status: false, message: "Upstream geocoder timed out." });
//     }
//     console.error("Reverse geocode error:", e);
//     return res.status(500).json({ status: false, message: "Internal server error" });
//   }
// });

// export default router;


import express, { Request, Response } from "express";
import { request } from "undici"; // Fast HTTP client
import dotenv from "dotenv";
import {LRUCache} from "lru-cache";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

dotenv.config();
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
if (!GOOGLE_API_KEY) throw new Error("Missing GOOGLE_API_KEY in environment variables");

// 🧠 LRU Cache to store results temporarily (5 min, 100 entries)
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// ⚡ Fast fetch with timeout using undici
async function fetchWithTimeout(url: string, timeoutMs = 3000): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await request(url, {
      method: "GET",
      headers: { "User-Agent": "Biziffy/1.0 (support@biziffy.com)" },
      signal: controller.signal,
    });
    return await res.body.json();
  } finally {
    clearTimeout(timeout);
  }
}

router.get("/reverse-geocode", async (req: Request, res: Response) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ status: false, message: "Latitude and longitude must be valid numbers." });
  }

  const cacheKey = `${lat.toFixed(4)}-${lon.toFixed(4)}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ ...cached, source: "cache" });

  try {
    // 🌐 1. Nominatim
    // const nomURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    // const nomJSON = await fetchWithTimeout(nomURL);

    // const address = nomJSON?.address || {};
    // const city = address.city || address.town || address.village || "";
    // const pincode = address.postcode || "";
    // const area = address.city_district || address.county || "";
    // const state = address.state || "";

    // if (city && pincode) {
    //   const result = { status: true, area, city, state, pincode };
    //   cache.set(cacheKey, result);
    //   return res.json({ ...result, source: "nominatim" });
    // }

    // 📍 2. Google Geocoding fallback
    const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`;
    const googleJSON = await fetchWithTimeout(googleURL);

    if (googleJSON.status !== "OK" || !googleJSON.results?.length) {
      return res.status(400).json({
        status: false,
        message: "Google fallback failed",
        error: googleJSON.error_message || googleJSON.status,
      });
    }

    const comps = googleJSON.results[0].address_components as AddressComponent[];
    const get = (...types: string[]) =>
      comps.find((c) => types.every((t) => c.types.includes(t)))?.long_name || "";
    console.log("Google API JSON Response =>", googleJSON);
    
    const result = {
      status: true,
      area: get("sublocality_level_1") || get("sublocality") || get("neighborhood") || get("route"),
      city: get("locality") || get("administrative_area_level_2"),
      state: get("administrative_area_level_1"),
      pincode: get("postal_code"),
    };

    cache.set(cacheKey, result);
    return res.json({ ...result, source: "google" });
  } catch (e: any) {
    if (e.name === "AbortError") {
      return res.status(504).json({ status: false, message: "Geocoder timeout." });
    }
    console.error("Reverse geocode error:", e);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
});

export default router;

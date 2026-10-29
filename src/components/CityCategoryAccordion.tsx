"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface CityCategoryAccordionProps {
  currentCity?: string;
  currentState?: string;
  onSelectArea: (area: string, tag?: string) => void;
  selectedArea?: string;
  selectedTag?: string;
  onSelectCity?: (city: string) => void;
  onSelectState?: (state: string) => void;
  locationTree?: any[];
}

export const ALL_INDIAN_STATES = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Goa",
  "Telangana",
  "West Bengal",
  "Rajasthan",
  "Gujarat",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "Kerala",
  "Andhra Pradesh",
  "Madhya Pradesh",
  "Bihar",
  "Odisha",
  "Assam",
  "Himachal Pradesh",
  "Uttarakhand",
  "Jammu & Kashmir",
  "Jharkhand",
  "Chhattisgarh",
  "Chandigarh",
  "Puducherry",
  "Tripura",
  "Meghalaya",
  "Manipur",
  "Nagaland",
  "Arunachal Pradesh",
  "Mizoram",
  "Sikkim",
];

export const STATE_CITIES_MAP: Record<string, string[]> = {
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
    "Gandhinagar",
    "Anand",
    "Navsari",
    "Morbi",
    "Nadiad",
    "Surendranagar",
    "Bharuch",
    "Porbandar",
    "Mehsana",
    "Bhuj",
    "Valsad",
    "Vapi",
    "Gondal",
    "Veraval",
    "Godhra",
    "Patan",
    "Palanpur",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Navi Mumbai",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Amravati",
    "Nanded",
    "Sangli",
    "Jalgaon",
    "Akola",
    "Latur",
    "Dhule",
    "Ahmednagar",
    "Chandrapur",
  ],
  Karnataka: [
    "Bangalore",
    "Bengaluru",
    "Mysore",
    "Mysuru",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Gulbarga",
    "Davanagere",
    "Bellary",
    "Shimoga",
    "Tumkur",
    "Udupi",
    "Hassan",
    "Bidar",
  ],
  Delhi: [
    "Central Delhi",
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "East Delhi",
    "Rohini",
    "Dwarka",
    "Saket",
    "Connaught Place",
    "Karol Bagh",
    "Lajpat Nagar",
    "Pitampura",
    "Janakpuri",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Bharatpur",
    "Sikar",
    "Pali",
    "Sri Ganganagar",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Agra",
    "Meerut",
    "Varanasi",
    "Prayagraj",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Noida",
    "Saharanpur",
    "Gorakhpur",
    "Firozabad",
    "Jhansi",
    "Mathura",
    "Ayodhya",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Bardhaman",
    "Malda",
    "Kharagpur",
    "Haldia",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tiruppur",
    "Erode",
    "Vellore",
    "Thoothukudi",
    "Dindigul",
    "Thanjavur",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Khammam",
    "Karimnagar",
    "Ramagundam",
    "Secunderabad",
    "Mahbubnagar",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Hoshiarpur",
    "Pathankot",
    "Moga",
  ],
  Haryana: [
    "Gurgaon",
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
    "Sonipat",
    "Panchkula",
  ],
  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Purnia",
    "Darbhanga",
    "Bihar Sharif",
    "Arrah",
    "Begusarai",
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
  ],
  Kerala: [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Kollam",
    "Thrissur",
    "Alappuzha",
    "Palakkad",
    "Kannur",
    "Kottayam",
  ],
  Goa: [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
    "Ponda",
    "Calangute",
    "Candolim",
    "Baga",
    "Anjuna",
    "Colva",
  ],
  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Rishikesh",
    "Haldwani",
    "Roorkee",
    "Nainital",
    "Rudrapur",
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Manali",
    "Mandi",
    "Solan",
    "Kullu",
    "Kasauli",
  ],
  "Jammu & Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Udhampur",
    "Kathua",
  ],
  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
    "Hazaribagh",
  ],
  Chhattisgarh: [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Durg",
    "Rajnandgaon",
  ],
  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Berhampur",
    "Sambalpur",
    "Puri",
  ],
  Assam: [
    "Guwahati",
    "Silchar",
    "Dibrugarh",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
  ],
  Chandigarh: [
    "Sector 17",
    "Sector 22",
    "Sector 35",
    "Sector 43",
    "Manimajra",
    "Industrial Area",
  ],
};

export const CITY_AREAS_MAP: Record<string, string[]> = {
  Bangalore: [
    "Banaswadi",
    "Bellandur",
    "BTM",
    "BTM Layout",
    "Electronic City",
    "Hebbal",
    "HSR",
    "HSR Layout",
    "Indiranagar",
    "Jayanagar",
    "JP Nagar",
    "Kammanahalli",
    "Koramangala",
    "Madiwala",
    "Marathahalli",
    "MG Road",
    "RT Nagar",
    "Whitefield",
    "Yelahanka",
    "Rajajinagar",
    "Malleshwaram",
    "Bannerghatta Road",
    "Richmond Town",
    "Ulsoor",
    "Domlur",
  ],
  Chennai: [
    "T Nagar",
    "Anna Nagar",
    "Adyar",
    "Velachery",
    "Nungambakkam",
    "Mylapore",
    "Alwarpet",
    "Guindy",
    "Besant Nagar",
    "Egmore",
    "Kilpauk",
    "Kodambakkam",
    "Vadapalani",
    "Porur",
    "Thiruvanmiyur",
    "Sholinganallur",
    "OMR",
    "Tambaram",
    "Chromepet",
    "Pallavaram",
    "Perambur",
    "Ashok Nagar",
    "Koyambedu",
    "KK Nagar",
    "Medavakkam",
    "Mount Road",
    "Madipakkam",
    "Mogappair",
    "Adambakkam",
    "Alandur",
    "Alapakkam",
    "Ambattur",
    "Avadi",
    "Chepauk",
  ],
  Jaipur: [
    "Bani Park",
    "Malviya Nagar",
    "Vaishali Nagar",
    "Raja Park",
    "C-Scheme",
    "Mansarovar",
    "Tonk Road",
    "Sodala",
    "Gopalpura",
    "Ajmer Road",
    "Jagatpura",
    "Vidhyadhar Nagar",
    "MI Road",
    "Pratap Nagar",
    "Civil Lines",
  ],
  Delhi: [
    "Connaught Place",
    "South Extension",
    "Vasant Kunj",
    "Rohini",
    "Dwarka",
    "Saket",
    "Hauz Khas",
    "Karol Bagh",
    "Laxmi Nagar",
    "Janakpuri",
    "Aerocity",
    "Nehru Place",
    "Rajouri Garden",
    "Pitampura",
    "Greater Kailash",
    "Green Park",
    "Lajpat Nagar",
    "Paschim Vihar",
  ],
  Mumbai: [
    "Bandra",
    "Andheri",
    "Juhu",
    "Colaba",
    "Powai",
    "Borivali",
    "Dadar",
    "Thane",
    "Navi Mumbai",
    "Worli",
    "Malad",
    "Santacruz",
    "Kandivali",
    "Goregaon",
    "Ghatkopar",
    "Kurla",
    "Vashi",
  ],
  Goa: [
    "Calangute",
    "Baga",
    "Panjim",
    "Candolim",
    "Anjuna",
    "Arpora",
    "Morjim",
    "Porvorim",
    "Vagator",
    "Margao",
    "Colva",
    "Arambol",
  ],
  Pune: [
    "Koregaon Park",
    "Viman Nagar",
    "Kalyani Nagar",
    "Hinjewadi",
    "Baner",
    "Kothrud",
    "Aundh",
    "Wakad",
    "Magarpatta",
    "Hadapsar",
    "Shivaji Nagar",
    "Pimple Saudagar",
  ],
  Hyderabad: [
    "Banjara Hills",
    "Jubilee Hills",
    "Gachibowli",
    "HITECH City",
    "Madhapur",
    "Kondapur",
    "Begumpet",
    "Abids",
    "Ameerpet",
    "Kukatpally",
    "Secunderabad",
    "Manikonda",
    "Somajiguda",
  ],
  Kolkata: [
    "Park Street",
    "Salt Lake",
    "New Town",
    "Ballygunge",
    "Alipore",
    "Rajarhat",
    "Dum Dum",
    "Howrah",
    "Gariahat",
    "Jadavpur",
    "Esplanade",
    "Behala",
  ],
  Ahmedabad: [
    "SG Highway",
    "Satellite",
    "CG Road",
    "Bodakdev",
    "Vastrapur",
    "Prahlad Nagar",
    "Navrangpura",
    "Thaltej",
    "Maninagar",
    "Bopal",
    "Paldi",
  ],
  Chandigarh: [
    "Sector 17",
    "Sector 35",
    "Sector 22",
    "Sector 8",
    "Sector 9",
    "Mohali",
    "Zirakpur",
    "Panchkula",
    "Sector 43",
    "Sector 70 Mohali",
  ],
  Lucknow: [
    "Gomti Nagar",
    "Hazratganj",
    "Aliganj",
    "Indira Nagar",
    "Mahanagar",
    "Alambagh",
    "Ashiyana",
    "Vikas Nagar",
    "Jankipuram",
  ],
  Patna: [
    "Boring Road",
    "Kankarbagh",
    "Bailey Road",
    "Fraser Road",
    "Rajendra Nagar",
    "Danapur",
    "Patliputra Colony",
  ],
  Surat: [
    "Athwa",
    "Vesu",
    "Adajan",
    "Varachha",
    "Piplod",
    "City Light",
    "Ghod Dod Road",
  ],
  Indore: [
    "Vijay Nagar",
    "Palasia",
    "Bhawarkua",
    "Rajwada",
    "Annapurna",
    "Sapna Sangeeta",
    "AB Road",
  ],
  Bhopal: [
    "MP Nagar",
    "Arera Colony",
    "New Market",
    "Kolar Road",
    "Hoshangabad Road",
    "Shahpura",
  ],
  Coimbatore: [
    "RS Puram",
    "Gandhipuram",
    "Peelamedu",
    "Saibaba Colony",
    "Saravanampatti",
    "Race Course",
  ],
  Kochi: [
    "Marine Drive",
    "MG Road",
    "Kaloor",
    "Edapally",
    "Kakkanad",
    "Fort Kochi",
    "Palarivattom",
  ],
  Nagpur: [
    "Dharampeth",
    "Ramdaspeth",
    "Sitabuldi",
    "Civil Lines",
    "Wardha Road",
    "Manish Nagar",
  ],
  Vadodara: [
    "Alkapuri",
    "Sayajigunj",
    "Fatehgunj",
    "Gotri",
    "Manjalpur",
    "Vasna",
  ],
  Ludhiana: [
    "Model Town",
    "Sarabha Nagar",
    "BRS Nagar",
    "Ferozepur Road",
    "Civil Lines",
  ],
  Agra: [
    "Tajganj",
    "Sanjay Place",
    "Fatehabad Road",
    "Dayalbagh",
    "Kamla Nagar",
  ],
  Nashik: [
    "College Road",
    "Gangapur Road",
    "Indira Nagar",
    "Panchavati",
    "CIDCO",
  ],
  Varanasi: [
    "Cantt",
    "Sigra",
    "Lanka",
    "Godowlia",
    "Bhelupur",
    "Shivpur",
  ],
  Gurgaon: [
    "Cyber City",
    "Sector 29",
    "Golf Course Road",
    "Sohna Road",
    "DLF Phase 1",
    "DLF Phase 2",
    "DLF Phase 3",
    "MG Road",
  ],
  Noida: [
    "Sector 18",
    "Sector 62",
    "Sector 50",
    "Sector 137",
    "Greater Noida",
    "Sector 76",
    "Sector 15",
  ],
  Ghaziabad: [
    "Indirapuram",
    "Vaishali",
    "Kaushambi",
    "Raj Nagar",
    "Vasundhara",
    "Crossings Republik",
  ],
  Faridabad: [
    "Sector 15",
    "Sector 16",
    "NIT Faridabad",
    "Greenfield",
    "Surajkund",
  ],
  Amritsar: [
    "Ranjit Avenue",
    "Mall Road",
    "Lawrence Road",
    "Majitha Road",
  ],
  Udaipur: [
    "Fateh Sagar",
    "Sukhadia Circle",
    "Hiran Magri",
    "Panchwati",
    "City Palace Area",
  ],
  Ranchi: [
    "Lalpur",
    "Doranda",
    "Harmu",
    "Kanke Road",
    "Main Road",
  ],
  Dehradun: [
    "Rajpur Road",
    "Clock Tower",
    "Jakhan",
    "Dharampur",
    "Vasant Vihar",
  ],
  Visakhapatnam: [
    "MVP Colony",
    "Gajuwaka",
    "Siripuram",
    "Dwaraka Nagar",
    "Rushikonda",
  ],
  Kanpur: [
    "Civil Lines",
    "Swaroop Nagar",
    "Kakadeo",
    "Mall Road",
    "Kidwai Nagar",
  ],
  Meerut: [
    "Shastri Nagar",
    "Civil Lines",
    "Modipuram",
    "Ganga Nagar",
  ],
  Rajkot: [
    "Kalawad Road",
    "Yagnik Road",
    "150 Feet Ring Road",
    "University Road",
  ],
  Bhubaneswar: [
    "Nayapalli",
    "Saheed Nagar",
    "Jaydev Vihar",
    "Patia",
    "Khandagiri",
  ],
};

/**
 * Case-insensitive & alias-aware helper to get static base areas for any Indian city.
 */
export const getCityBaseAreas = (cityName: string): string[] => {
  if (!cityName || cityName === "All Cities") return CITY_AREAS_MAP["Bangalore"] || [];
  const lower = cityName.trim().toLowerCase();

  // Known city name aliases
  if (lower === "bengaluru") return CITY_AREAS_MAP["Bangalore"] || [];
  if (lower === "gurugram") return CITY_AREAS_MAP["Gurgaon"] || [];
  if (lower === "prayagraj" || lower.includes("allahabad")) return CITY_AREAS_MAP["Allahabad"] || [];

  const foundKey = Object.keys(CITY_AREAS_MAP).find(
    (k) => k.toLowerCase() === lower
  );
  return foundKey ? CITY_AREAS_MAP[foundKey] : [];
};

export function CityCategoryAccordion({
  currentCity,
  currentState,
  onSelectArea,
  selectedArea = "",
  selectedTag = "Call Girls",
  onSelectCity,
  onSelectState,
  locationTree = [],
}: CityCategoryAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dynamicAreas, setDynamicAreas] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [internalTree, setInternalTree] = useState<any[]>(locationTree);

  // Fetch locationTree if not passed down
  useEffect(() => {
    if (locationTree && locationTree.length > 0) {
      setInternalTree(locationTree);
      return;
    }
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
    fetch(`${BACKEND_URL}/locations/tree?includeDeleted=false`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.tree)) {
          setInternalTree(data.tree);
        }
      })
      .catch(() => {});
  }, [locationTree]);

  // Extract all states from tree + fallback
  const treeStates = (internalTree || []).map((s: any) => s.name).filter(Boolean);
  const availableStates = Array.from(new Set([...treeStates, ...ALL_INDIAN_STATES]));

  const isStateName = (name?: string) => {
    if (!name || name === "All States" || name === "All Cities") return false;
    const clean = name.trim().toLowerCase();
    return (
      availableStates.some((s) => s.toLowerCase() === clean) ||
      (internalTree || []).some(
        (st: any) =>
          st.name?.toLowerCase() === clean || st.slug?.toLowerCase() === clean
      )
    );
  };

  const hasExplicitState = Boolean(
    currentState &&
      currentState !== "All States" &&
      currentState.toLowerCase() !== "india" &&
      currentState.toLowerCase() !== "pan-india"
  );

  const hasCity = Boolean(
    currentCity &&
      currentCity !== "All Cities" &&
      currentCity.toLowerCase() !== "india" &&
      currentCity.toLowerCase() !== "pan-india"
  );

  // If currentCity is actually a state name (e.g. "Gujarat") and no explicit state was given
  const isCityActuallyState = hasCity && !hasExplicitState && isStateName(currentCity);

  const activeStateName = hasExplicitState
    ? currentState!
    : isCityActuallyState
    ? currentCity!
    : "";

  const activeCityName =
    hasCity && !isCityActuallyState && (!activeStateName || currentCity!.toLowerCase() !== activeStateName.toLowerCase())
      ? currentCity!
      : "";

  const isPanIndia = !activeStateName && !activeCityName;
  const isStateOnly = Boolean(activeStateName && !activeCityName);

  const displayLocation = activeCityName || activeStateName || "India";
  const displayCity = displayLocation;

  const fetchCityAreas = async () => {
    if (isPanIndia || isStateOnly || !activeCityName) return;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

    try {
      const normCity = activeCityName.trim().toLowerCase();

      // 1. Fetch from /locations/areas
      const res = await fetch(`${BACKEND_URL}/locations/areas?includeDeleted=false`);
      const data = await res.json();

      let dbAreaNames: string[] = [];
      if (data && data.success && Array.isArray(data.areas)) {
        dbAreaNames = data.areas
          .filter((a: any) => {
            const cName = (
              a.cityId?.name ||
              a.cityName ||
              a.city ||
              (typeof a.cityId === "string" ? a.cityId : "")
            )
              .toString()
              .trim()
              .toLowerCase();

            return (
              cName === normCity ||
              (normCity === "bangalore" && cName === "bengaluru") ||
              (normCity === "bengaluru" && cName === "bangalore") ||
              (normCity === "gurgaon" && cName === "gurugram") ||
              (normCity === "gurugram" && cName === "gurgaon")
            );
          })
          .map((a: any) => a.name || a.areaName)
          .filter(Boolean);
      }

      // 2. If nothing found in /locations/areas, also check /locations/tree
      if (dbAreaNames.length === 0 && internalTree.length > 0) {
        const cityObj = internalTree
          .flatMap((st: any) => st.cities || [])
          .find((c: any) => {
            const cName = (c.name || "").toString().trim().toLowerCase();
            return (
              cName === normCity ||
              (normCity === "bangalore" && cName === "bengaluru") ||
              (normCity === "bengaluru" && cName === "bangalore")
            );
          });
        if (cityObj && Array.isArray(cityObj.areas)) {
          dbAreaNames = cityObj.areas.map((a: any) => a.name).filter(Boolean);
        }
      }

      setDynamicAreas(dbAreaNames);
    } catch {
      // Gracefully fall back to baseList if network is unavailable
    }
  };

  useEffect(() => {
    setDynamicAreas([]);
    if (!isPanIndia && !isStateOnly) {
      fetchCityAreas();
    }

    if (typeof window !== "undefined") {
      const handler = () => {
        if (!isPanIndia && !isStateOnly) fetchCityAreas();
      };
      window.addEventListener("skokka_locations_updated", handler);
      return () => {
        window.removeEventListener("skokka_locations_updated", handler);
      };
    }
  }, [displayLocation, isPanIndia, isStateOnly]);

  // Base list specifically for this city
  const baseList = isPanIndia || isStateOnly ? [] : getCityBaseAreas(activeCityName);

  // Combine static and dynamic areas
  const combinedRaw = [...baseList, ...dynamicAreas];
  const seenLower = new Set<string>();
  const allAreas: string[] = [];

  for (const item of combinedRaw) {
    if (!item || typeof item !== "string") continue;
    const clean = item.trim();
    if (!clean) continue;
    const lower = clean.toLowerCase();
    if (!seenLower.has(lower)) {
      seenLower.add(lower);
      allAreas.push(clean);
    }
  }

  // Find cities under active state (combining tree + static fallback)
  let stateCities: string[] = [];
  if (activeStateName) {
    const matchedStateObj = (internalTree || []).find(
      (s: any) =>
        s.name?.toLowerCase() === activeStateName.toLowerCase() ||
        s.slug?.toLowerCase() === activeStateName.toLowerCase()
    );
    const treeCities: string[] =
      matchedStateObj?.cities?.map((c: any) => c.name).filter(Boolean) || [];

    const fallbackKey = Object.keys(STATE_CITIES_MAP).find(
      (k) => k.toLowerCase() === activeStateName.toLowerCase()
    );
    const fallbackCities: string[] = fallbackKey ? STATE_CITIES_MAP[fallbackKey] : [];

    const seenCities = new Set<string>();
    for (const c of [...treeCities, ...fallbackCities]) {
      if (c && typeof c === "string") {
        const clean = c.trim();
        if (clean && !seenCities.has(clean.toLowerCase())) {
          seenCities.add(clean.toLowerCase());
          stateCities.push(clean);
        }
      }
    }
  }

  // Check sister cities if city has no areas
  const parentState =
    !isPanIndia && !isStateOnly && allAreas.length === 0
      ? (internalTree || []).find((s: any) =>
          s.cities?.some((c: any) => c.name?.toLowerCase() === activeCityName.toLowerCase())
        )
      : null;
  const sisterCities =
    parentState?.cities
      ?.map((c: any) => c.name)
      .filter((n: string) => n.toLowerCase() !== activeCityName.toLowerCase())
      .slice(0, 24) || [];

  const categories = isPanIndia
    ? [
        { title: "Call Girls in India", emoji: "👄", tag: "Call Girls" },
        { title: "Massages in India", emoji: "💆‍♀️", tag: "Massages" },
        { title: "VIP Escorts in India", emoji: "⭐", tag: "VIP Escorts" },
        { title: "Male Escorts in India", emoji: "🧔", tag: "Male Escorts" },
        { title: "Transsexual in India", emoji: "👠", tag: "Transsexual" },
        { title: "Adult Meetings in India", emoji: "🍸", tag: "Adult Meetings" },
      ]
    : [
        { title: `Call Girls in ${displayLocation}`, emoji: "👄", tag: "Call Girls" },
        { title: `Massages in ${displayLocation}`, emoji: "💆‍♀️", tag: "Massages" },
        { title: `VIP Escorts in ${displayLocation}`, emoji: "⭐", tag: "VIP Escorts" },
        { title: `Male Escorts in ${displayLocation}`, emoji: "🧔", tag: "Male Escorts" },
        { title: `Transsexual in ${displayLocation}`, emoji: "👠", tag: "Transsexual" },
        { title: `Adult Meetings in ${displayLocation}`, emoji: "🍸", tag: "Adult Meetings" },
      ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 space-y-4 font-sans px-2 sm:px-0">
      {/* Category Accordions Container */}
      <div className="bg-[#090E24] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3">
        {categories.map((cat, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={cat.title}
              className="rounded-2xl border border-slate-800 bg-[#0c1330] overflow-hidden transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full py-4 px-6 flex items-center justify-between hover:bg-slate-900/60 transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition">
                    {cat.emoji}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-pink-500 group-hover:text-rose-400 tracking-tight">
                    {cat.title}
                  </h3>
                </div>

                <span className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700/60 text-slate-400 group-hover:text-white flex items-center justify-center transition">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-rose-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 bg-[#090E24]/60">
                  {/* CASE 1: PAN-INDIA (SHOW ALL INDIAN STATES) */}
                  {isPanIndia ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800/80 pb-2">
                        <span className="flex items-center gap-1.5 text-pink-400">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" />
                          Browse {cat.tag} across Indian States &amp; Territories ({availableStates.length}):
                        </span>
                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                          Select a state to browse local companions
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {availableStates.map((stateName) => (
                          <button
                            key={stateName}
                            type="button"
                            onClick={() => {
                              if (onSelectState) onSelectState(stateName);
                              else if (onSelectCity) onSelectCity(stateName);
                              if (onSelectArea) onSelectArea("", cat.tag);
                            }}
                            className="px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer border shadow-sm flex items-center gap-1.5 bg-slate-900/90 text-pink-300 hover:text-white hover:bg-rose-600/30 border-pink-500/30 hover:border-rose-400"
                          >
                            <MapPin className="h-3 w-3 shrink-0 text-rose-400" />
                            <span>{stateName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : isStateOnly || (stateCities.length > 0 && !activeCityName) ? (
                    /* CASE 2: STATE SELECTED (SHOW ALL CITIES UNDER THIS STATE) */
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800/80 pb-2">
                        <span className="flex items-center gap-1.5 text-pink-400">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" />
                          Browse {cat.tag} across {displayLocation} Cities ({stateCities.length}):
                        </span>
                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                          Select a city to browse local companions
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {stateCities.map((cityName: string) => (
                          <button
                            key={cityName}
                            type="button"
                            onClick={() => {
                              if (onSelectCity) onSelectCity(cityName);
                              if (onSelectArea) onSelectArea("", cat.tag);
                            }}
                            className="px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer border shadow-sm flex items-center gap-1.5 bg-slate-900/90 text-pink-300 hover:text-white hover:bg-rose-600/30 border-pink-500/30 hover:border-rose-400"
                          >
                            <MapPin className="h-3 w-3 shrink-0 text-rose-400" />
                            <span>{cityName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : allAreas.length > 0 ? (
                    /* CASE 3: CITY WITH REGISTERED AREAS */
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {allAreas.map((area) => {
                        const isSelected =
                          selectedArea.toLowerCase() === area.toLowerCase();

                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => onSelectArea(isSelected ? "" : area, cat.tag)}
                            className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer border shadow-sm flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-rose-600 text-white border-rose-400 shadow-rose-600/40"
                                : "bg-slate-900/90 text-pink-400 hover:text-white hover:bg-rose-600/20 border-pink-500/40 hover:border-rose-400"
                            }`}
                          >
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{area}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : sisterCities.length > 0 ? (
                    /* CASE 4: CITY WITHOUT DIRECT AREAS YET (SHOW SISTER CITIES IN SAME STATE) */
                    <div className="space-y-3 pt-2">
                      <p className="text-xs text-slate-300 font-medium">
                        Showing verified {cat.tag} companions in <strong className="text-white">{displayCity}</strong> and nearby {parentState?.name || "regional"} hubs:
                      </p>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {sisterCities.map((cityName: string) => (
                          <button
                            key={cityName}
                            type="button"
                            onClick={() => {
                              if (onSelectCity) onSelectCity(cityName);
                              if (onSelectArea) onSelectArea("", cat.tag);
                            }}
                            className="px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer border shadow-sm flex items-center gap-1.5 bg-slate-900/90 text-pink-300 hover:text-white hover:bg-rose-600/20 border-pink-500/30 hover:border-rose-400"
                          >
                            <MapPin className="h-3 w-3 shrink-0 text-rose-400" />
                            <span>{cityName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      Verified {cat.tag} companionship services active in {displayCity}. Contact directly via phone or WhatsApp.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Expandable SEO Description Section */}
        <div className="pt-6 border-t border-slate-800/80 px-4 sm:px-6 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
          {/* Paragraph 1 */}
          <p>
            <strong className="text-white font-bold">MyCityQueen</strong> is India&apos;s largest adult classifieds site, offering a premier space for those seeking elite companionship. Find your next date on the top adult site in{" "}
            <span className="text-rose-400 font-bold">{displayCity}</span>, where we host the best ads for independent call girls and professional escorts in{" "}
            <span className="text-rose-400 font-bold">{displayCity}</span> right here. If you are searching for a high-end escort near me, our platform is the most efficient way to browse local options instantly.
          </p>

          {/* Expanded Paragraphs 2 & 3 */}
          {isExpanded && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              <p>
                Whether you are looking for a sophisticated companion for a social event or a more intimate private encounter, our platform provides a diverse range of choices tailored to your preferences. Scroll through real photos of stunning girls and exotic companions, ensuring you find exactly what you are looking for.
              </p>
              <p>
                At MyCityQueen, we prioritize your privacy and ease of use. Pick a profile you like and get in touch directly to set something up in{" "}
                <span className="text-rose-400 font-bold">{displayCity}</span>. From local favorites to high-end independent providers, your perfect adult experience is just a few clicks away on the most reliable platform in the country. Explore the best full-service listings and connect with the most beautiful companions in the city today.
              </p>
            </div>
          )}

          {/* Expand / Collapse Button (Pink Text) */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-rose-400 hover:text-pink-300 font-bold text-xs sm:text-sm transition cursor-pointer underline underline-offset-4 flex items-center justify-center gap-1 mx-auto"
            >
              <span>{isExpanded ? "Show less" : "Show more"}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-800/80 px-4 sm:px-6 space-y-3 text-slate-400 text-xs leading-relaxed font-normal">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            Mycityqueen.com does not intervene in relationships between end users and advertisers
          </h4>
          <p>
            By accessing our website and using our services, the User is accepting our Terms and Conditions of use, and the commitment of getting informed about any change.
          </p>
          <p>
            The present ads in MyCityQueen have been published by own initiative of the Advertiser under their complete responsibility. The publishing of such ads is not subjected to any type of prior verification by Mycityqueen.com. Mycityqueen.com will not be responsible about the veracity, legality, respect to the property right and possible displeasure with the public or moral order of the online contents entered by the user under any condition.
          </p>
          <p>
            Mycityqueen.com offers publication and website navigation services of free Internet Ads. Mycityqueen.com does not interpose or mediate between the User who navigates the website, the User who publishes the contents and the User who replies to adverts.
          </p>
        </div>
      </div>
    </div>
  );
}

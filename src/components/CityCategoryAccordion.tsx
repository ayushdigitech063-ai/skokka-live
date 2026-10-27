"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface CityCategoryAccordionProps {
  currentCity: string;
  onSelectArea: (area: string, tag?: string) => void;
  selectedArea?: string;
}

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
  onSelectArea,
  selectedArea = "",
}: CityCategoryAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dynamicAreas, setDynamicAreas] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // If no specific city is selected (e.g. All Cities / Pan-India), do NOT render local city accordion
  if (!currentCity || currentCity === "All Cities") {
    return null;
  }

  // Normalize city name for display and data lookup
  const displayCity = currentCity;

  const fetchCityAreas = async () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

    try {
      const normCity = displayCity.trim().toLowerCase();

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
      if (dbAreaNames.length === 0) {
        const treeRes = await fetch(`${BACKEND_URL}/locations/tree?includeDeleted=false`);
        const treeData = await treeRes.json();
        if (treeData && treeData.success && Array.isArray(treeData.tree)) {
          const cityObj = treeData.tree
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
      }

      setDynamicAreas(dbAreaNames);
    } catch {
      // Gracefully fall back to baseList if network is unavailable
    }
  };

  useEffect(() => {
    // Reset dynamic areas when city changes to prevent showing old city's areas
    setDynamicAreas([]);
    fetchCityAreas();

    if (typeof window !== "undefined") {
      const handler = () => fetchCityAreas();
      window.addEventListener("skokka_locations_updated", handler);
      return () => {
        window.removeEventListener("skokka_locations_updated", handler);
      };
    }
  }, [displayCity]);

  // Base list specifically for this city (NO fallback to Bangalore when currentCity is different!)
  const baseList = getCityBaseAreas(displayCity);

  // Combine static and dynamic areas, deduplicating case-insensitively
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

  const categories = [
    { title: `Call Girls ${displayCity}`, emoji: "👄", tag: "Call Girls" },
    { title: `Massages ${displayCity}`, emoji: "💆‍♀️", tag: "Massages" },
    { title: `Male Escorts ${displayCity}`, emoji: "🧔", tag: "Male Escorts" },
    { title: `Transsexual ${displayCity}`, emoji: "👠", tag: "Transsexual" },
    { title: `Adult Meetings ${displayCity}`, emoji: "🍸", tag: "Adult Meetings" },
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
                  {allAreas.length > 0 ? (
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
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No specific areas found for {displayCity}. Select another city or browse all {displayCity} escorts.
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

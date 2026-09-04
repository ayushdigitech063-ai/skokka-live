"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface CityCategoryAccordionProps {
  currentCity: string;
  onSelectArea: (area: string) => void;
  selectedArea?: string;
}

const CITY_AREAS_MAP: Record<string, string[]> = {
  Bangalore: [
    "Banaswadi",
    "Bellandur",
    "Btm",
    "Btm Layout",
    "Electronic City",
    "Hebbal",
    "Hsr",
    "Hsr Layout",
    "Indiranagar",
    "Jayanagar",
    "Jp Nagar",
    "Kammanahalli",
    "Koramangala",
    "Madiwala",
    "Marathahalli",
    "Mg Road",
    "Rt Nagar",
    "Whitefield",
    "Yelahanka",
    "Rajajinagar",
    "Malleshwaram",
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
  ],
  Pune: [
    "Koregaon Park",
    "Viman Nagar",
    "Kalyani Nagar",
    "Hinjewadi",
    "Baner",
    "Kothrud",
    "Aundh",
  ],
  Hyderabad: [
    "Banjara Hills",
    "Jubilee Hills",
    "Gachibowli",
    "HITECH City",
    "Madhapur",
    "Kondapur",
    "Begumpet",
  ],
  Kolkata: [
    "Park Street",
    "Salt Lake",
    "New Town",
    "Ballygunge",
    "Alipore",
    "Rajarhat",
    "Dum Dum",
  ],
  Ahmedabad: [
    "SG Highway",
    "Satellite",
    "CG Road",
    "Bodakdev",
    "Vastrapur",
    "Prahlad Nagar",
    "Navrangpura",
  ],
  Chandigarh: [
    "Sector 17",
    "Sector 35",
    "Sector 22",
    "Sector 8",
    "Mohali",
    "Zirakpur",
    "Panchkula",
  ],
};

export function CityCategoryAccordion({
  currentCity,
  onSelectArea,
  selectedArea = "",
}: CityCategoryAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dynamicAreas, setDynamicAreas] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const displayCity =
    currentCity && currentCity !== "All Cities" ? currentCity : "Bangalore";

  const fetchCityAreas = () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

    fetch(`${BACKEND_URL}/locations/areas?includeDeleted=false`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.areas)) {
          const normCity = displayCity.trim().toLowerCase();
          const dbAreaNames = data.areas
            .filter((a: any) => {
              const cName = (a.cityName || a.city || "").toString().trim().toLowerCase();
              return (
                cName === normCity ||
                (normCity === "bangalore" && cName === "bengaluru") ||
                (normCity === "bengaluru" && cName === "bangalore")
              );
            })
            .map((a: any) => a.name || a.areaName)
            .filter(Boolean);

          setDynamicAreas(dbAreaNames);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCityAreas();
    if (typeof window !== "undefined") {
      window.addEventListener("skokka_locations_updated", fetchCityAreas);
      return () => {
        window.removeEventListener("skokka_locations_updated", fetchCityAreas);
      };
    }
  }, [displayCity]);

  const baseList = CITY_AREAS_MAP[displayCity] || CITY_AREAS_MAP["Bangalore"] || [];
  const allAreas = Array.from(new Set([...baseList, ...dynamicAreas]));

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
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {allAreas.map((area) => {
                      const isSelected =
                        selectedArea.toLowerCase() === area.toLowerCase();

                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => onSelectArea(area)}
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

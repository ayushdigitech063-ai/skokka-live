/**
 * SEO Engine Fallback Template Generators
 */
import { capitalizeWords, SITE_NAME } from "./seoHelpers";

export const getHomeTemplates = () => {
  const title = `MyCityQueen | Verified Profiles & Services in India`;
  const description = `Discover top-rated verified escort profiles, call girls, independent companions, and VIP adult meeting services across major Indian cities on MyCityQueen.`;
  const shortDescription = `Browse verified adult escort profiles, independent companions, and VIP meeting services in top Indian cities on MyCityQueen.`;
  return { title, description, shortDescription };
};

export const getStateTemplates = (stateName: string) => {
  const cleanState = capitalizeWords(stateName);
  const title = `Verified Escorts in ${cleanState} | ${SITE_NAME}`;
  const description = `Find verified high-class escort profiles, independent models, and call girls across all major cities in ${cleanState}. Photos, rates and direct contact.`;
  const shortDescription = `Explore verified escort profiles and independent companions in ${cleanState}.`;
  return { title, description, shortDescription };
};

export const getCityTemplates = (cityName: string, stateName?: string) => {
  const cleanCity = capitalizeWords(cityName);
  const cleanState = stateName ? `, ${capitalizeWords(stateName)}` : "";
  const title = `Verified Escorts in ${cleanCity} | ${SITE_NAME}`;
  const description = `Browse verified escort profiles in ${cleanCity}${cleanState} with photos and contact details. High class VIP companions available 24/7.`;
  const shortDescription = `Browse verified escort profiles in ${cleanCity} with photos and direct contact details.`;
  return { title, description, shortDescription };
};

export const getAreaTemplates = (areaName: string, cityName: string) => {
  const cleanArea = capitalizeWords(areaName);
  const cleanCity = capitalizeWords(cityName);
  const title = `VIP Escorts in ${cleanArea}, ${cleanCity} | ${SITE_NAME}`;
  const description = `Discover verified VIP escort profiles in ${cleanArea}, ${cleanCity}. Independent companions and top rated adult call girl services with photos.`;
  const shortDescription = `Discover verified VIP escort profiles and independent models in ${cleanArea}, ${cleanCity}.`;
  return { title, description, shortDescription };
};

export const getCategoryTemplates = (categoryName: string, locationName?: string) => {
  const cleanCategory = capitalizeWords(categoryName);
  const cleanLocation = locationName ? ` in ${capitalizeWords(locationName)}` : "";
  const title = `${cleanCategory}${cleanLocation} | ${SITE_NAME}`;
  const description = `Browse top-rated ${cleanCategory} companions${cleanLocation}. Verified selfie profiles, genuine photos, and direct WhatsApp contact.`;
  const shortDescription = `Find top-rated ${cleanCategory} companions${cleanLocation} with verified photos.`;
  return { title, description, shortDescription };
};

export const getProfileTemplates = (
  name: string,
  cityName?: string,
  category?: string
) => {
  const cleanName = capitalizeWords(name);
  const cleanCity = cityName ? capitalizeWords(cityName) : "India";
  const cleanCat = category ? capitalizeWords(category) : "Verified Escort";
  const title = `${cleanName} | ${cleanCat} in ${cleanCity} | ${SITE_NAME}`;
  const description = `View ${cleanName}'s verified profile, gallery, rates, and services in ${cleanCity}. Independent ${cleanCat} companion available for Incall & Outcall.`;
  const shortDescription = `View ${cleanName}'s verified profile, photo gallery, rates and adult meeting services in ${cleanCity}.`;
  return { title, description, shortDescription };
};

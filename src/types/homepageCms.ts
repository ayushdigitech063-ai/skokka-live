export interface HeroSectionConfig {
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  bgImage: string;
  floatingModelName: string;
  floatingModelRate: string;
  floatingModelBadge: string;
}

export interface SectionHeaderConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
}

export interface CategoryCardConfig {
  id: string;
  label: string;
  emoji: string;
  image: string;
  accent: string;
  border: string;
  glow: string;
  cities: string[];
}

export interface CategorySectionConfig extends SectionHeaderConfig {
  categories: CategoryCardConfig[];
}

export interface CityDirectoryCardConfig {
  name: string;
  count: string;
  highlight: string;
}

export interface TopCitiesSectionConfig extends SectionHeaderConfig {
  buttonText: string;
  cities: CityDirectoryCardConfig[];
}

export interface AdvantageStatConfig {
  label: string;
  value: string;
  color: string;
}

export interface PremierNetworkSectionConfig extends SectionHeaderConfig {
  buttonText: string;
  stats: AdvantageStatConfig[];
}

export interface FooterLinkItem {
  id: string;
  emoji: string;
  label: string;
  url: string;
}

export interface FooterSectionConfig {
  brandName: string;
  brandLogoUrl?: string;
  brandBadgeText?: string;
  brandTagline: string;
  sslBadgeText: string;

  col2Heading: string;
  col2Links: FooterLinkItem[];

  col3Heading: string;
  col3Links: FooterLinkItem[];

  col4Heading: string;
  col4Desc: string;
  newsletterButtonText: string;

  supportEmail: string;
  whatsappNumber: string;
  telegramHandle: string;
  disclaimerText: string;
  copyrightText: string;
}

export interface SearchModalFilterItem {
  id: string;
  label: string;
}

export interface SearchModalFiltersConfig {
  nationalities: SearchModalFilterItem[];
  breasts: SearchModalFilterItem[];
  hairs: SearchModalFilterItem[];
  bodyTypes: SearchModalFilterItem[];
  services: SearchModalFilterItem[];
  attentionTo: SearchModalFilterItem[];
  placesOfService: SearchModalFilterItem[];
}

export interface HomePageCmsConfig {
  hero: HeroSectionConfig;
  verifiedProfiles: SectionHeaderConfig;
  vipEscorts: SectionHeaderConfig;
  categories: CategorySectionConfig;
  topCities: TopCitiesSectionConfig;
  premierNetwork: PremierNetworkSectionConfig;
  footer: FooterSectionConfig;
  searchModalFilters?: SearchModalFiltersConfig;
}

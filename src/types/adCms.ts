export interface AdPackageConfig {
  id: string; // e.g. "STANDARD", "VIP_SLOT", "HERO_BANNER"
  title: string;
  price: number;
  badge: string;
  description: string;
  enabled: boolean;
}

export interface CreditPackageConfig {
  id: string;
  price: number;
  credits: number;
  bonusText: string;
  enabled: boolean;
}

export interface CouponConfig {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  enabled: boolean;
}

export interface AdCategoryOptionConfig {
  id: string;
  label: string;
  iconEmoji: string;
  enabled: boolean;
}

export interface AdCmsConfig {
  superAdminUpiId: string;
  upiHolderName: string;
  packages: AdPackageConfig[];
  creditPackages: CreditPackageConfig[];
  coupons: CouponConfig[];
  categories: AdCategoryOptionConfig[];
  verificationRequired: boolean;
  documentTypes: string[];
}

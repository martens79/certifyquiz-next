export type RewardedPlacement = "locked_wrong_explanation";
export type RewardedUserType = "free_authenticated" | "premium" | "trial";
export type RewardType = "single_explanation";

export type RewardedAdsConfig = {
  enabled: boolean;
  dailyCap: number;
  weeklyCap: number;
  eligibleUserTypes: RewardedUserType[];
  excludedUserTypes: RewardedUserType[];
  rewardType: RewardType;
  rolloutPercentage: number;
  holdoutPercentage: number;
};

export type RewardEligibilityResult = {
  eligible: boolean;
  reason: "eligible" | "disabled" | "excluded_user" | "cap_reached" | "holdout";
  placement: RewardedPlacement;
};

export type RewardIntent = { id: string; placement: RewardedPlacement; rewardType: RewardType; expiresAt: string };
export type RewardGrant = { intentId: string; grantedAt: string; rewardType: RewardType };
export type RewardConsumption = { grantId: string; contentId: string; consumedAt: string };
export type RewardCapStatus = { dailyUsed: number; dailyCap: number; weeklyUsed: number; weeklyCap: number };

/** Preparazione soltanto: non legge SDK, non effettua richieste e resta sempre off di default. */
export const REWARDED_ADS_CONFIG: Readonly<RewardedAdsConfig> = Object.freeze({
  // Il client non può abilitare Rewarded Ads. In futuro riceverà una decisione
  // firmata/autorevole dal backend; per questa fase resta invariabilmente false.
  enabled: false,
  dailyCap: 2,
  weeklyCap: 6,
  eligibleUserTypes: ["free_authenticated"] as RewardedUserType[],
  excludedUserTypes: ["premium", "trial"] as RewardedUserType[],
  rewardType: "single_explanation",
  rolloutPercentage: 0,
  holdoutPercentage: 0,
});

export const shouldRenderRewardedPlaceholder = () =>
  REWARDED_ADS_CONFIG.enabled && REWARDED_ADS_CONFIG.rolloutPercentage > 0;

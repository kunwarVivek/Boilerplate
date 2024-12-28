const PLAN_LIMITS = {
  starter: {
    teamMembers: 5,
    storageGB: 10,
    apiRequestsPerMonth: 10000,
  },
  professional: {
    teamMembers: 20,
    storageGB: 50,
    apiRequestsPerMonth: 100000,
  },
  enterprise: {
    teamMembers: Infinity,
    storageGB: 500,
    apiRequestsPerMonth: 1000000,
  },
} as const;

export function checkUsageLimit(plan: keyof typeof PLAN_LIMITS, feature: keyof (typeof PLAN_LIMITS)['starter'], currentUsage: number): boolean {
  return currentUsage <= PLAN_LIMITS[plan][feature];
}

export function getUsagePercentage(plan: keyof typeof PLAN_LIMITS, feature: keyof (typeof PLAN_LIMITS)['starter'], currentUsage: number): number {
  const limit = PLAN_LIMITS[plan][feature];
  return limit === Infinity ? 0 : (currentUsage / limit) * 100;
}

export function getPlanLimits(plan: keyof typeof PLAN_LIMITS) {
  return PLAN_LIMITS[plan];
}
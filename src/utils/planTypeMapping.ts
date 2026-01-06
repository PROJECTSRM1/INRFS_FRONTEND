

export interface PlanTypeDetails {
    id: number;
    plan_type: string;
    percentage: number;
    duration: string;
    duration_months: number;
    is_active: boolean;
}

export const PLAN_TYPE_MAPPING: Record<number, PlanTypeDetails> = {
    1: {
        id: 1,
        plan_type: 'Short-Term Starter',
        percentage: 10,
        duration: '1 month',
        duration_months: 1,
        is_active: true
    },
    2: {
        id: 2,
        plan_type: 'Quarterly Builder',
        percentage: 14,
        duration: '3 Months',
        duration_months: 3,
        is_active: true
    },
    3: {
        id: 3,
        plan_type: 'Growth Accelerate',
        percentage: 18,
        duration: '6 Months',
        duration_months: 6,
        is_active: true
    },
    4: {
        id: 4,
        plan_type: 'Wealth Multiplier',
        percentage: 25,
        duration: '12 Months',
        duration_months: 12,
        is_active: true
    }
};

/**
 * Get plan details by plan_type_id
 */
export const getPlanTypeById = (planTypeId: number): PlanTypeDetails | null => {
    return PLAN_TYPE_MAPPING[planTypeId] || null;
};

/**
 * Get plan name by plan_type_id
 */
export const getPlanNameById = (planTypeId: number): string => {
    const plan = getPlanTypeById(planTypeId);
    return plan ? plan.plan_type : `Plan Type ${planTypeId}`;
};

/**
 * Get plan duration in months by plan_type_id
 */
export const getPlanDurationById = (planTypeId: number): number => {
    const plan = getPlanTypeById(planTypeId);
    return plan ? plan.duration_months : 0;
};

/**
 * Get plan interest rate by plan_type_id
 */
export const getPlanInterestRateById = (planTypeId: number): number => {
    const plan = getPlanTypeById(planTypeId);
    return plan ? plan.percentage : 0;
};

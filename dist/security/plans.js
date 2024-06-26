"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
class Plans {
    static get values() {
        return {
            free: 'free',
            growth: 'growth',
            premium: 'premium',
        };
    }
    static selectPlanByStripePriceId(stripePriceId) {
        const growthStripePriceId = config_1.getConfig()
            .PLAN_STRIPE_PRICES_GROWTH;
        const premiumStripePriceId = config_1.getConfig()
            .PLAN_STRIPE_PRICES_PREMIUM;
        if (growthStripePriceId === stripePriceId) {
            return Plans.values.growth;
        }
        if (premiumStripePriceId === stripePriceId) {
            return Plans.values.premium;
        }
        return Plans.values.free;
    }
    static selectStripePriceIdByPlan(plan) {
        if (plan === Plans.values.growth) {
            return config_1.getConfig().PLAN_STRIPE_PRICES_GROWTH;
        }
        if (plan === Plans.values.premium) {
            return config_1.getConfig().PLAN_STRIPE_PRICES_PREMIUM;
        }
        return null;
    }
    /**
     * When the plan is:
     * - active: The plan will be active.
     * - cancel_at_period_end: The plan will remain active until the end of the period.
     * - error: The plan will remain active, but a warning message will be displayed to the user.
     * - canceled: The workspace plan will change to Free.
     */
    static selectPlanStatus(stripePlan) {
        if (!stripePlan) {
            return 'canceled';
        }
        const { status, cancel_at_period_end } = stripePlan;
        if (status === 'active') {
            if (cancel_at_period_end) {
                return 'cancel_at_period_end';
            }
            return 'active';
        }
        if (status === 'canceled' || status === 'incomplete_expired') {
            return 'canceled';
        }
        return 'error';
    }
    /**
     * If the plan exists and it is not marked
     * to cancel, the tenant can't be destroyed,
     * because future charges might occur
     */
    static allowTenantDestroy(plan, planStatus) {
        if (plan === Plans.values.free) {
            return true;
        }
        return planStatus === 'cancel_at_period_end';
    }
}
exports.default = Plans;
//# sourceMappingURL=plans.js.map
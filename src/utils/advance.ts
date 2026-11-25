/** Orders are confirmed once this share of the total is paid in advance. */
export const ADVANCE_PERCENT = 50;

/** Advance amount in rupees (rounded up to a whole rupee). */
export const advanceOf = (total: number) => Math.ceil((total * ADVANCE_PERCENT) / 100);

interface BeverageWaterRatio {
  [key: string]: number;
}

export const BEVERAGE_WATER_RATIOS: BeverageWaterRatio = {
  Coffee: 200,   // +200ml per 50ml step
  Tea: 20,       // +20ml per 50ml step
  Soda: 25,      // +25ml per 50ml step
  Beer: 50,      // +50ml per 50ml step
  Wine: 50,      // +50ml per 50ml step
  Spirits: 200,  // +200ml per 50ml step
  Juice: 50,     // +50ml per 50ml step
  Milk: 25,       // +25ml per 50ml step
  Water: 50,      // +50ml per 50ml step
};

/**
 * Calculates the extra water needed for one 50ml step of a beverage
 * @param beverageType - Type of beverage (Coffee, Tea, etc.)
 * @returns Extra water needed in ml for one 50ml step
 */
export const getExtraWaterPerStep = (beverageType: string): number => {
  const ratio = BEVERAGE_WATER_RATIOS[beverageType];
  if (!ratio) {
    throw new Error(`Unknown beverage type: ${beverageType}`);
  }
  return ratio;
};

/**
 * Example:
 * const extraWaterForOneCoffeeStep = getExtraWaterPerStep('Coffee');
 * // Result: 200ml (one 50ml step of coffee requires 200ml water)
 */

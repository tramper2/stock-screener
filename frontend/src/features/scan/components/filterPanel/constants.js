import { UNIVERSE_GEOGRAPHIC_MARKETS } from '../../constants';

export const STAGE_OPTIONS = [
  { value: 1, label: '1단계 - 바닥다지기 (Basing)' },
  { value: 2, label: '2단계 - 상승기 (Advancing)' },
  { value: 3, label: '3단계 - 천장형성 (Topping)' },
  { value: 4, label: '4단계 - 하락기 (Declining)' },
];

export const VOLUME_OPTIONS = [
  { value: 10000000, label: '1천만 달러 ($10M) 초과' },
  { value: 50000000, label: '5천만 달러 ($50M) 초과' },
  { value: 100000000, label: '1억 달러 ($100M) 초과' },
  { value: 500000000, label: '5억 달러 ($500M) 초과' },
  { value: 1000000000, label: '10억 달러 ($1B) 초과' },
  { value: 5000000000, label: '50억 달러 ($5B) 초과' },
  { value: 10000000000, label: '100억 달러 ($10B) 초과' },
];

export const MARKET_CAP_OPTIONS = [
  { value: 100000000, label: '1억 달러 초과' },
  { value: 200000000, label: '2억 달러 초과' },
  { value: 500000000, label: '5억 달러 초과' },
  { value: 1000000000, label: '10억 달러 초과' },
  { value: 2000000000, label: '20억 달러 초과' },
  { value: 5000000000, label: '50억 달러 초과' },
  { value: 10000000000, label: '100억 달러 초과' },
];

export const FUNDAMENTAL_KEYS = [
  'symbolSearch', 'minMarketCap', 'minVolume', 'price',
  'epsGrowth', 'salesGrowth', 'epsRating', 'ibdIndustries', 'gicsSectors', 'ipoAfter',
  'markets', 'marketCapUsd', 'advUsd',
];

// Derived from the canonical geographic-markets list so adding a new market
// (e.g. KR) only requires an update in one place.
export const MARKET_OPTIONS = UNIVERSE_GEOGRAPHIC_MARKETS.map((code) => ({
  value: code,
  label: code,
}));

// Setup Engine pattern identifiers (must match backend detector `pattern` ids).
export const SE_PATTERN_OPTIONS = [
  'cup_with_handle',
  'double_bottom',
  'high_tight_flag',
  'first_pullback',
  'vcp',
  'three_weeks_tight',
  'nr7_inside_day',
];

export const TECHNICAL_KEYS = [
  'stage', 'rsRating', 'rs1m', 'rs3m', 'rs12m', 'maAlignment',
  'adrPercent', 'perfDay', 'perfWeek', 'perfMonth',
  'perf3m', 'perf6m', 'gapPercent', 'volumeSurge',
  'ema10Distance', 'ema20Distance', 'ema50Distance',
  'week52HighDistance', 'week52LowDistance',
  'beta', 'betaAdjRs', 'pocketPivot', 'powerTrend',
];

export const RATING_KEYS = [
  'compositeScore', 'minerviniScore', 'canslimScore', 'ipoScore',
  'customScore', 'volBreakthroughScore',
  'seSetupScore', 'seDistanceToPivot', 'seBbSqueeze', 'seVolumeVs50d',
  'seUpDownVolume', 'sePatternPrimary', 'seSetupReady', 'seRsLineNewHigh',
  'vcpScore', 'vcpDetected', 'vcpReady', 'passesTemplate',
];

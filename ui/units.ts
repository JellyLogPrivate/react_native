import { Dimensions, PixelRatio } from 'react-native';

type DesignSize = {
  designW: number;
  designH: number;
};

const DEFAULT_DESIGN: DesignSize = { designW: 402, designH: 874 };
const BASE_FONT_PX = 16;

function getWindowScale({ designW, designH }: DesignSize) {
  const { width, height } = Dimensions.get('window');
  return Math.min(width / designW, height / designH);
}

/**
 * Scale dp-like numbers based on current window size.
 * Use this for spacing, sizes, radii, icon sizes, etc.
 */
export function s(n: number, design: DesignSize = DEFAULT_DESIGN) {
  return Math.round(n * getWindowScale(design));
}

/**
 * rem-like unit for font sizes that respects OS font scale.
 * `rem(1)` ~= 16px at default font scale.
 */
export function rem(n: number) {
  return Math.round(n * BASE_FONT_PX * PixelRatio.getFontScale());
}


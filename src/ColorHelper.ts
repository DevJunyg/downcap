// input: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]


/** @see https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript */
export default class ColorHelper {
  static rgb2hsv(r: number, g: number, b: number) {
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    // eslint-disable-next-line
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return {
      h: 60 * (h < 0 ? h + 6 : h),
      s: v && c / v,
      v: v
    }
  }
}
import { IRGBA } from "models";

export class Color {
  static get black(): Readonly<IRGBA> {
    return {
      a: 0,
      r: 0,
      g: 0,
      b: 0
    }
  }
}
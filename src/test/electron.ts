import { App } from "electron";

export const app: App = {
   getPath: (name) => {
      if (name === "userData") {
         return 'C:/Users/f/AppData/Roaming/downcap';
      }
   }
} as App;
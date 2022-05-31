import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import IpcSender from "./IpcSender";

const logger = ReactLoggerFactoryHelper.build('ReactFontManager');
class ReactFontManagerSingleTone {
  private taskGetFonts: Promise<void>;
  private fonts: readonly string[] | undefined;

  constructor() {
    this.taskGetFonts = IpcSender.invokeGetFonts()
      .then(fonts => { this.fonts = JSON.parse(fonts) as string[] })
      .catch(logger.logWarning);
  }

  async getFontsAsync() {
    await this.taskGetFonts;
    return this.fonts;
  }
}

const ReactFontManager = new ReactFontManagerSingleTone();
export default ReactFontManager;

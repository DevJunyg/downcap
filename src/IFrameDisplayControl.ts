import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
export default class IFrameDisplayControl {
  logger = ReactLoggerFactoryHelper.build(IFrameDisplayControl.name);
  iframes: NodeListOf<HTMLIFrameElement> | undefined;
  iframeEventPropertis: Array<{ parent: HTMLElement, rect: HTMLDivElement }> | undefined;
  disabled = false;

  disable() {
    if (this.disabled) {
      return;
    }

    this.iframes = document.querySelectorAll("iframe");
    this.iframeEventPropertis = [];
    this.iframes.forEach((item, index) => {
      const rect = document.createElement("div");
      rect.style.position = "absolute";
      rect.style.width = "100%";
      rect.style.height = "100%";
      rect.style.top = '0px';
      rect.style.left = '0px';
      const parent = item.parentElement!;
      parent.appendChild(rect);
      this.iframeEventPropertis![index] = { parent: parent, rect: rect };
    });
    this.disabled = true;
  }

  enable() {
    if (!this.disabled) {
      return;
    }

    this.iframeEventPropertis?.forEach(item => {
      const { parent, rect } = item;
      try {
        parent.removeChild(rect);
      } catch (e) { e instanceof Error && this.logger.logWarning(e); }
    });

    this.iframeEventPropertis = undefined;
    this.iframes = undefined;
    this.disabled = false;
  }
}
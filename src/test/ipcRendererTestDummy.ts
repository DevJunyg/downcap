import { IpcRenderer } from "electron";
import IpcChannels from "IpcChannels";

class IpcRendererDummy implements IpcRenderer {
  invoke(channel: string, ...args: any[]): Promise<any> {
    switch (channel) {
      case IpcChannels.invokeGetFonts:
        return Promise.resolve('["fontStartingWithString","123fontStartingWithNumber", "1"]');
      default:
        return Promise.resolve("1.2.3");
    }
  }
  on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): this {
    return this;
  }
  once(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): this {
    return this;
  }
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void {
    throw new Error("Method not implemented.");
  }
  removeAllListeners(channel: string): this {
    return this;
  }
  removeListener(channel: string, listener: (...args: any[]) => void): this {
    return this;
  }
  send(channel: string, ...args: any[]): void {
    return;
  }
  sendSync(channel: string, ...args: any[]) {
    throw new Error("Method not implemented.");
  }
  sendTo(webContentsId: number, channel: string, ...args: any[]): void {
    throw new Error("Method not implemented.");
  }
  sendToHost(channel: string, ...args: any[]): void {
    throw new Error("Method not implemented.");
  }
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  off(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  setMaxListeners(n: number): this {
    throw new Error("Method not implemented.");
  }
  getMaxListeners(): number {
    throw new Error("Method not implemented.");
  }
  listeners(eventName: string | symbol): Function[] {
    throw new Error("Method not implemented.");
  }
  rawListeners(eventName: string | symbol): Function[] {
    throw new Error("Method not implemented.");
  }
  emit(eventName: string | symbol, ...args: any[]): boolean {
    throw new Error("Method not implemented.");
  }
  listenerCount(eventName: string | symbol): number {
    throw new Error("Method not implemented.");
  }
  prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Method not implemented.");
  }
  eventNames(): (string | symbol)[] {
    throw new Error("Method not implemented.");
  }
}

export default IpcRendererDummy;
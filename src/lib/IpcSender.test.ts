import "test/testPreload";
import IpcSender from './IpcSender';

it('checkes invokeYouTubeVideoSearch should return empty array when gets a null value', async () => {
  const invoke = window.ipcRenderer.invoke;
  window.ipcRenderer.invoke = jest.fn(() => Promise.resolve(null));
  const result = await IpcSender.invokeYouTubeVideoSearch('123');
  expect(result).toStrictEqual([]);
  window.ipcRenderer.invoke = invoke
});

it('check fileExistkAsync return true when passed file path is exist', async () => {
  const invoke = window.ipcRenderer.invoke;
  window.ipcRenderer.invoke = jest.fn((_e, path: string): Promise<boolean> => {
    return path === 'C:/Users/k/Desktop/다운캡/[오늘의 라이브] 송하예와의 짧은 인터뷰.mp4' ?
      Promise.resolve(true) : Promise.resolve(false);
  });
  const result = await IpcSender.invokeFileExistkAsync('C:/Users/k/Desktop/다운캡/[오늘의 라이브] 송하예와의 짧은 인터뷰.mp4');
  expect(result).toBeTruthy();
  window.ipcRenderer.invoke = invoke
});
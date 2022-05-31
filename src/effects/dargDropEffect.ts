import IpcSender from "lib/IpcSender";

export default function dargDropEffect() {
  _documentIncrease();
  return _documentDecrease;

  function _onDrop(evt: DragEvent) {
    const file = evt.dataTransfer?.files[0];
    if (file?.path) {
      IpcSender.sendDragDrop(file?.path);
      evt.preventDefault();
    }
  }

  function _onDragover(evt: DragEvent) {
    evt.preventDefault();
  }

  function _documentIncrease() {
    document.body.addEventListener('drop', _onDrop);
    document.body.addEventListener('dragover', _onDragover);
  }

  function _documentDecrease() {
    document.body.removeEventListener('drop', _onDrop);
    document.body.removeEventListener('dragover', _onDragover);
  }
}

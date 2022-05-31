export class CursorHelper {
  static isSelectionNone(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    return evt.currentTarget.selectionStart === evt.currentTarget.selectionEnd;
  }

  static isCursorStart(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    return evt.currentTarget.selectionStart === 0;
  }

  static isCursorStartWithoutSelection(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    return evt.currentTarget.selectionEnd === 0;
  }

  static isCursorEnd(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    return evt.currentTarget.selectionEnd === evt.currentTarget.value.length;
  }

  static isCursorEndWithoutSelection(evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    return evt.currentTarget.selectionStart === evt.currentTarget.value.length;
  }
}
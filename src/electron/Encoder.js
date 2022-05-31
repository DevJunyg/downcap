Object.defineProperty(exports, "__esModule", {
  value: true
});

const CP949 = 949;
const UTF_8 = 65001;

function getWindowDefualtCodePage() {
  const command = '[System.Text.Encoding]::Default.WindowsCodePage';
  const { spawnSync } = require("child_process");
  return Number.parseInt(spawnSync('powershell', [command]).output[1]);
}

const defulatCodePage = require('os').type() === "Windows_NT"
  ? getWindowDefualtCodePage()
  : UTF_8;


class Encoder {
  /**
   * @param {string} src 
   * @param {string} dist 
   * @param {string} str 
   */
  static convert(src, dist, str) {
    const Iconv = require('iconv').Iconv;
    return new Iconv(src, dist).convert(str);
  }

  static cp949ToUtf8(str) {
    return Encoder.convert('CP949', 'UTF-8', str);
  }

  static utf8ToCp949(str) {
    return Encoder.convert('UTF-8', 'CP949', str);
  }

  static utf8ToDefault(str) {
    if (defulatCodePage === UTF_8) {
      return str;
    }

    if (defulatCodePage === CP949) {
      return Encoder.utf8ToCp949(str);
    }

    return str;
  }

  static defaultToUTF8(str) {
    if (defulatCodePage === UTF_8) {
      return str;
    }

    if (defulatCodePage === CP949) {
      return Encoder.cp949ToUtf8(str);
    }

    return str;
  }
}

exports.default = Encoder;
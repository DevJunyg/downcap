class IconPathHelper {
  private static _fileOpenIconPath = "https://downcap.net/client/svg/file_open.svg";
  private static _koToEnIconPath = "https://downcap.net/client/svg/trans/KoToEn.svg";
  private static _EnToKoIconPath = "https://downcap.net/client/svg/trans/EnToKo.svg";

  static get fileOpenIconPath() {
    return IconPathHelper._fileOpenIconPath;
  }

  static get koToEnIconPath() {
    return IconPathHelper._koToEnIconPath;
  }

  static get enToKoIconPath() {
    return IconPathHelper._EnToKoIconPath;
  }
}

export default IconPathHelper;
const baseUrl = "https://downcap.net";

const ImgUrls = {
  subCategoryMenuDividingLine: `${baseUrl}/client/svg/소분류메뉴구분선.svg`,
  largeCategoryMenuDividingLine: `${baseUrl}/client/svg/대분류메뉴구분선.svg`,
  youtTubeLogLight: `${baseUrl}/client/img/yt_logo_rgb_light.png`,
  translateByKo: `${baseUrl}/client/img/translate_by_ko.png`,
  letter: `${baseUrl}/client/img/letter.png`
}

Object.freeze(ImgUrls);

export default ImgUrls as Readonly<typeof ImgUrls>;
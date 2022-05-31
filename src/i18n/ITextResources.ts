import { ResourceLanguage } from 'i18next';

interface ITextResources extends ResourceLanguage {
  translation: {
    Cancel: string;
    CreateSubtitles: string;
    FormatControlTitle_Title: string;
    DualCaption_Sequence: string;
    DualCaption_Sequence_Up: string;
    DualCaption_Sequence_Down: string;
    FileOpen: string;
    Load: string;
    Ok: string;
    Or: string;
    Style: string;
    Export: string;
    SubtitlesExport: string;
    VideoExport: string;
    VideoSubutitlesTitle: string;
    NoFileHasBeenSelected: string;
    Subtitles: string;
    GetChanges: string;
    File: string;
    NewProject: string;
    Open: string;
    SaveProject: string;
    SaveAsProject: string;
    YoutubeUpload: string;
    YoutubeVideoUpload: string;
    YoutubeCaptionsUpload: string;
    HelpMenu: string;
    Info: string;
    Shortcut: string;
    Notice: string;
    Inquiry: string;
    HelpImg: string;
    MultiLineEditTile_Title_Html: string;
    MultLineCreateNewLine: string;
    RealTimeTranslation: string;
    Retranslate_Button_Text: string;
    TranslateMultiLine_Translate_Pending_Description: string;
    TranslateMultiLine_Translate_Failed_Description: string;
    Loading_Pending_Comments: string;
    progressBar_Text: string
  };
  TranslateProgressbar: {
    Trnaslate_Complate_Text: string;
    Translate_Progress_Text: string;
    Translate_Un_Start_Text: string
  };
  StyleEditSelector: {
    LineButton_Content: string;
    WordButton_Content: string
  };
  ShortcutPopup: {
    Shortcut: string;
    KeyboardShortcut: {
      playPause: string;
      MoveCaption: string;
      breakSentence: string;
      combineSentences: string;
      unDo: string;
      reDo: string;
      projectSave: string;
      projectSaveAs: string;
      newProject: string;
      openFile: string
    }
  };
  Login: {
    email: string;
    password: string;
    capslock_ErrorMessage: string;
    stayLogin: string;
    login: string;
    signup: string;
    forgotPassword: string;
  };
  LoginContainer: {
    ErrorDescription_EmaliEmpty: string;
    ErrorDescription_PasswordEmpty: string;
    ErrorDescription_Server: string;
    ErrorDescription_LoginFailed: string;
    ErrorDescription_Unkown: string
  };
  YoutubeSearchBox: {
    placeholder_Text: string
  };
  FileOpenArea: {
    localFile: string;
    fileType: string;
    click: string;
    or: string;
    dragAndDrop: string
  };
  UserInfo: {
    userInfoChange: string;
    letterPurchase: string;
    logout: string
  };
  CaptionsExportPopupContainer_handleOkClickAsync: {
    exportSuccess_Title: string
  };
  CaptionsExportSuccessPopup: {
    title: string;
    confirmContent: string;
    Captions_Export_Success_Message: string
  };
  FileOpenPopupContainer_openSrtAsync: {
    srtPath_NotExist: string
  };
  FileOpenPopup: {
    fileOpiton_stc: string;
    fileOpiton_video: string;
    fileOpiton_srt: string;
    stcDetail_expectedTime: string;
    stcDetail_about: string;
    stcDetail_minute: string;
    stcDetail_hour: string;
    stcDetail_letterUsing: string;
    stcDetail_notice: string;
    captionDetail_error: string;
    captionDetail_title: string;
    captionDetail_selectCaption: string;
    closeContent: string;
    acceptContent: string;
    filePath: string;
    fileOpen: string;
  };
  NewProjectPopup: {
    title: string;
    closeContent: string;
    acceptContent: string;
    popupMessage: string;
  };
  YouTubeVideoOpenPopupContainer: {
    youtube_CaptionLoad_HelpMessage: string
  };
  YouTubeVideoOpenPopup: {
    SttRequestInfo_About: string;
    SttRequestInfo_AboutTime: string;
    SttRequestInfo_DefulatPredictionValue: string;
    SttRequestInfo_Minute: string;
    SttRequestInfo_LetterUsing: string;
    SttInfo_Notice: string;
    CaptionOptions_Default: string;
    LocalCaptionLoadInfo_StrSelectError: string;
    LocalCaptionLoadInfo_ConttnesTitle: string;
    LocalCaptionLoadInfo_AttachFileButton_Text: string;
    CaptionLoadHelpMessage_Notice: string;
    CaptionLoadHelpMessage_NoticeLink: string;
    CaptionLoadHelpMessage_NoticeLink_Sub: string;
    CaptionNotFound_Notice_CaptionNullError: string;
    youtubeCaption: string;
    title: string;
    closeContent: string;
    acceptContent: string;
    loadVideo_Title: string;
    loadVideo_Option_Stt: string;
    loadVideo_Option_Video: string;
    loadVideo_Option_Caption: string
  };
  YoutubeCaptionsUploadPopupContainer: {
    handleOk_invaildFont: string
  };
  YoutubeCaptionsUploadPopup: {
    title: string;
    acceptContent: string;
    closeContent: string;
    captionLanguage: string;
    uploadToKo: string;
    uploadToEn: string;
    koCaption: string;
    enCaption: string;
    koEnCaption: string;
    EnKoCaption: string;
    file: string;
    overWrite: string;
    insert: string;
    optoin: string;
    cc_Option: string;
    address: string
  };
  YoutubeCaptionUploadSuccessPopup: {
    title: string;
    confirmContent: string;
    uploadSuccessMessage: string;
    uploadSuccessMessage_Info: string
  };
  YoutubeVideoUploadPopupContainer: {
    embeddableMessage: string;
    handleOk_invaildFont: string
  };
  YoutubeVideoUploadSuccessPopup: {
    title: string;
    confirmContent: string;
    uploadSuccessMessage: string;
    uploadSuccessMessage_Info: string
  };
  YoutubeVideoUploadPopup: {
    title: string;
    closeContent: string;
    acceptContent: string
  };
  YoutubeVideoUploadPopupVideoPathContents: {
    file: string
  };
  YoutubeVideoUploadPopupVideoTitleContents: {
    title: string;
    title_Placehloder: string;
    error_TitleNull: string;
    error_TitleExceed: string;
    error_TitleAngleBrackets: string;
  };
  YoutubeVideoUploadPopupDescriptionContents: {
    description: string;
    description_Placeholder: string;
    error_DescriptionExceed: string;
    error_DescriptionAngleBrackets: string
  };
  YoutubeVideoUploadPopupLicenseContents: {
    title: string;
    license_Youtube: string;
    license_CreativeCommon: string
  };
  YoutubeVideoUploadPopupTagsContents: {
    title: string;
    tags_Placeholder: string;
    errorMessage_TagIsTooLong: string;
    errorMessage_TagsExceed: string;
    errorMessage_TagAngleBrackets: string;
  };
  YoutubeVideoUploadPopupKidLanguageContents: {
    kidOption_title: string;
    kidOption_false: string;
    kidOption_ture: string;
    languageOption_Title: string;
    languageOption_Korean: string;
    languageOption_English: string;
  };
  YoutubeVideoUploadPopupCategoryContents: {
    title: string;
    category_1: string;
    category_2: string;
    category_3: string;
    category_4: string;
    category_5: string;
    category_6: string;
    category_7: string;
    category_8: string;
    category_9: string;
    category_10: string;
    category_11: string;
    category_12: string;
    category_13: string;
    category_14: string;
    category_15: string
  };
  YoutubeVideoUploadPopupEmbeddableContents: {
    title: string;
    embeddable_Permit: string;
    embeddable_Forbid: string;
  };
  YoutubeVideoUploadPopupCaptionsContents: {
    title: string;
    ccOption_None: string;
    ccOption_Origin: string;
    ccOption_Translated: string
  };
  YoutubeVideoUploadPopupPrivacyContents: {
    title: string;
    privacyOption_public: string;
    privacyOption_unlisted: string;
    privacyOption_private: string;
  };
  SelectLanguage: {
    ko: string;
    en: string;
    dual: string
  };
  AppInfoPopup: {
    Info_Information: string;
    Info_Version: string;
    Info_Policy: string;
    Info_Privacy_Policy: string;
    Info_Google_Privacy_Policy: string;
    Info_Youtube_Terms_Of_Service: string;
    Info_Contact: string;
    Info_Business_Email: string;
    Info_Technical_Inquiry_Email: string
  };
  SavePopup: {
    SavePopup_Title: string;
    SavePopup_Cotent: string
  };
  InquiryPopupContainer: {
    TITLTE_IS_EMPTY_ERROR: string;
    TITLTE_MAXIMUME_CHARACTER_EXCEEDE_ERROR: string
  };
  InquiryPopup: {
    title: string;
    acceptContent: string;
    closeContent: string;
    inquryTitle: string;
    inquryContents: string;
    inqurySub: string;
    mail_Title: string;
    mail_Contents: string;
    kakao_Title: string;
    kakao_Contents: string;
    call_Title: string;
    call_Contents: string
  };
  InquirySuccessPopup: {
    title: string;
    confirmContent: string;
    succes_Message: string;
  };
  InquiryFailedPopup: {
    title: string;
    confirmContent: string;
    failed_Message: string
  };
  InvalidFontCheckPopup: {
    title: string;
    invaildFont_Message: string;
    invaildFont_ChangeTo: string;
    invaildFont_Change: string;
    fontMenu: string;
    invaildFont_time: string;
    invaildFont_sub: string;
    invaildFont_type: string;
    invaildFont_move: string;
    closeButton_Text: string
  };
  InvalidFontCheckLine: {
    move: string;
    ko: string;
    en: string;
    line: string;
    multi: string
  };
  LetterCheckPopup: {
    title: string;
    letter_Lack_title: string;
    letter_Lack_About: string;
    letter_Lack: string;
    closeButton_Text: string
  };
  WordSplit: {
    wordLength: string
  };
  PresetStyle: {
    recommendedStyle: string;
    userStyle: string;
    saveStyle: string
  };
  TranslationPopup: {
    title: string;
    acceptContent: string;
    closeContent: string;
    full_Translate_About: string;
    aboutLetter: string;
    usingLetter: string;
    translation_Notice: string;
    translation_Edit_Notice: string
  };
  RetranslatePopup: {
    title: string;
    acceptContent: string;
    closeContent: string;
    retranslation_About: string;
    aboutLetter: string;
    usingLetter: string;
    translation_Notice: string;
    translation_Edit_Notice: string
  };
  CaptionsExportPopup: {
    title: string;
    closeContent: string;
    acceptContent: string;
    lnguage_Type_Select_Title: string;
    lnguage_Type_Select_Ko: string;
    lnguage_Type_Select_En: string;
    lnguage_Type_Select_KoEn: string;
    lnguage_Type_Select_EnKo: string;
    export_Type_Select_Title: string;
    export_Type_Select_Xml_Xmeml: string;
    export_Type_Select_Xml_Fcpxml: string;
    export_Type_Select_Xml_Resolve: string;
    export_Notice: string
  };
  VideoExportSettingPopupContainer: {
    invalidFontType_LocalFont: string
  };
  VideoExportSettingPopup: {
    title: string;
    closeContent: string;
    acceptContent: string;
    selectCaptionLanguage: string;
    ko: string;
    en: string;
    dual: string
  };
  VideoExportPendingPopup: {
    title: string;
    progressBar_Text: string;
    progress: string;
    cancelButton_Text: string
  };
  VideoExportFailedPopupContainer: {
    unavailable_FileName_Message: string
    ErrorGuidance_Invalid_Url_PathContent: string;
    ErrorGuidance_Invalid_Url_PathContent_Confirm: string;
    defaultErrorContent: string;
    defaultErrorContent_Inquiry: string;
    defaultError_Unknown: string
  };
  VideoExportFailedPopup: {
    title: string;
    closeButton_Text: string
  };
  YoutubeOutlineStylesSelector: {
    none: string;
    shadow: string;
    upper: string;
    lower: string;
    outLine: string
  };
  FontListTitle: {
    LocalOptions_Title: string;
    YoutubeOptions_Title: string
  };
  YoutubeFontsToOptions: {
    Monospaced_Serif: string;
    Proportional_Serif: string;
    Monospaced_Sans_Serif: string;
    Proportional_Sans_Serif: string;
    Casual: string;
    Cursive: string;
    Small_Capitals: string
  };
  DetailHelpMessage: {
    PreviewTypeDetail: string
  };
  PresetItem: {
    downcap: string
  };
  ApplyAllStylesButton: {
    applyAll: string
  };
  ApplyAllStylesWarningPopup: {
    title: string;
    closeContent: string;
    acceptContent: string;
    apply_All_Styles_Questions_Message: string;
  };
  TranslatedInformationBoard: {
    Help: string
  }
}

export default ITextResources;
import ITextResources from './ITextResources';

const TextResources: ITextResources = {
  translation: {
    Cancel: 'cancel',
    CreateSubtitles: 'Create Subtitles',
    FormatControlTitle_Title: 'Caption style',
    DualCaption_Sequence: 'Dual Caption Sequence',
    DualCaption_Sequence_Up: 'Up',
    DualCaption_Sequence_Down: 'Dn',
    FileOpen: 'Open file',
    Load: 'Load',
    Ok: 'Ok',
    Or: 'or',
    Style: 'Style',
    Export: 'Export',
    SubtitlesExport: 'Export caption',
    VideoExport: 'Export video',
    VideoSubutitlesTitle: 'video caption',
    NoFileHasBeenSelected: 'no file  has been selected',
    Subtitles: 'subtitles',
    GetChanges: 'get changes',
    File: 'File',
    NewProject: 'New Project',
    Open: 'Open',
    SaveProject: 'Save Project',
    SaveAsProject: 'Save As Project',
    YoutubeUpload: 'Youtube upload',
    YoutubeVideoUpload: 'Youtube video upload',
    YoutubeCaptionsUpload: 'Youtube caption upload',
    HelpMenu: 'Help menu',
    Info: 'infomation',
    Shortcut: 'shortcut',
    Notice: 'notice',
    Inquiry: 'inquiry',
    HelpImg: 'help tip',
    MultiLineEditTile_Title_Html: 'multiline',
    MultLineCreateNewLine: 'new line',
    RealTimeTranslation: 'real time translation',
    Retranslate_Button_Text: 'Re-Translation',
    TranslateMultiLine_Translate_Pending_Description: 'Translating...',
    TranslateMultiLine_Translate_Failed_Description: 'Translation failed.',
    Loading_Pending_Comments: 'Loading...',
    progressBar_Text: 'voice Analyzing...'
  },
  TranslateProgressbar: {
    Trnaslate_Complate_Text: 'translation complete',
    Translate_Progress_Text: 'Translating',
    Translate_Un_Start_Text: 'Waiting for translation'
  },
  StyleEditSelector: {
    LineButton_Content: 'line',
    WordButton_Content: 'word'
  },
  ShortcutPopup: {
    Shortcut: 'Shortcut',
    KeyboardShortcut: {
      playPause: 'Play/Pause',
      MoveCaption: 'Move subtitles',
      breakSentence: 'break a sentence',
      combineSentences: 'Combine sentences',
      unDo: 'undo',
      reDo: 'redo',
      projectSave: 'Save project',
      projectSaveAs: 'Save As',
      newProject: 'New Project',
      openFile: 'Open File'
    },
  },
  Login: {
    email: 'Email',
    password: 'Password',
    capslock_ErrorMessage: 'Capslock is on',
    stayLogin: 'Stay signed in',
    login: 'Signin',
    signup: 'Signup',
    forgotPassword: 'forgot Password',
  },
  LoginContainer: {
    ErrorDescription_EmaliEmpty: 'Please enter your e-mail.',
    ErrorDescription_PasswordEmpty: 'Please enter your password',
    ErrorDescription_Server: 'Login failed due to server error.',
    ErrorDescription_LoginFailed: 'Wrong email or password.',
    ErrorDescription_Unkown: 'Login failed with an unknown error.'
  },
  YoutubeSearchBox: {
    placeholder_Text: 'Search video link or YouTube'
  },
  FileOpenArea: {
    localFile: 'My computer file',
    fileType: '(video/recording/subtitle/downcap save file)',
    click: 'click',
    or: 'or',
    dragAndDrop: 'dragAndDrop'
  },
  UserInfo: {
    userInfoChange: 'Edit my info',
    letterPurchase: 'Buy',
    logout: 'Logout'
  },
  CaptionsExportPopupContainer_handleOkClickAsync: {
    exportSuccess_Title: 'Export'
  },
  CaptionsExportSuccessPopup: {
    title: 'Export',
    confirmContent: 'Confirm',
    Captions_Export_Success_Message: 'Export was successful.'
  },
  FileOpenPopupContainer_openSrtAsync: {
    srtPath_NotExist: 'Please select a subtitle'
  },
  FileOpenPopup: {
    fileOpiton_stc: 'Video + Subtitle (Audio Analysis)',
    fileOpiton_video: 'video file',
    fileOpiton_srt: 'Subtitle file',
    stcDetail_expectedTime: 'expected time',
    stcDetail_about: 'about',
    stcDetail_minute: 'minute',
    stcDetail_hour: 'hour',
    stcDetail_letterUsing: 'consumed',
    stcDetail_notice: '※ Voice analysis is available only in Korean.',
    captionDetail_error: 'Please select a subtitle',
    captionDetail_title: 'Subtitle',
    captionDetail_selectCaption: 'Select subtitle',
    closeContent: 'Cancel',
    acceptContent: 'OK',
    filePath: 'My Computer',
    fileOpen: 'Load',
  },
  NewProjectPopup: {
    title: 'open new project',
    closeContent: 'cancel',
    acceptContent: 'ok',
    popupMessage: 'Would you like to open a new project?',
  },
  YouTubeVideoOpenPopupContainer: {
    youtube_CaptionLoad_HelpMessage: 'You need to link your Google account to get YouTube subtitles'
  },
  YouTubeVideoOpenPopup: {
    SttRequestInfo_About: 'about',
    SttRequestInfo_AboutTime: 'Estimated time',
    SttRequestInfo_DefulatPredictionValue: 'Unknown',
    SttRequestInfo_Minute: 'minute',
    SttRequestInfo_LetterUsing: 'consumed',
    SttInfo_Notice: 'Loading video...',
    CaptionOptions_Default: 'No subtitles.',
    LocalCaptionLoadInfo_StrSelectError: 'Please select a subtitle',
    LocalCaptionLoadInfo_ConttnesTitle: 'Subtitles',
    LocalCaptionLoadInfo_AttachFileButton_Text: 'Select subtitle',
    CaptionLoadHelpMessage_Notice: '* To get YouTube subtitles',
    CaptionLoadHelpMessage_NoticeLink: 'Link to video account',
    CaptionLoadHelpMessage_NoticeLink_Sub: 'Required.',
    CaptionNotFound_Notice_CaptionNullError: 'Youtube subtitles do not exist.',
    youtubeCaption: 'YouTube subtitles',
    title: 'Youtube video',
    closeContent: 'Cancel',
    acceptContent: 'OK',
    loadVideo_Title: 'Load',
    loadVideo_Option_Stt: 'Video + Subtitle (Voice Analysis)',
    loadVideo_Option_Video: 'video file',
    loadVideo_Option_Caption: 'Subtitle file'
  },
  YoutubeCaptionsUploadPopupContainer: {
    handleOk_invaildFont: 'YouTube CC Subtitle Font'
  },
  YoutubeCaptionsUploadPopup: {
    title: 'Upload to YouTube',
    acceptContent: 'Upload',
    closeContent: 'Cancel',
    captionLanguage: 'Subtitle language',
    uploadToKo: 'Upload with Korean CC',
    uploadToEn: 'Upload with English CC',
    koCaption: 'Korean',
    enCaption: 'English',
    koEnCaption: 'Ko-En CC',
    EnKoCaption: 'En-Ko CC',
    file: 'file',
    overWrite: 'Overwrite existing CC',
    insert: 'Save as new CC',
    optoin: 'option',
    cc_Option: 'Auto show CC',
    address: 'link'
  },
  YoutubeCaptionUploadSuccessPopup: {
    title: 'Upload successful',
    confirmContent: 'confirm',
    uploadSuccessMessage: 'Upload was successful',
    uploadSuccessMessage_Info: `If you can't see the uploaded subtitles, please refresh it`
  },
  YoutubeVideoUploadPopupContainer: {
    embeddableMessage: '*Videos set to not allow embedding cannot be imported as downcaps.',
    handleOk_invaildFont: 'YouTube CC Subtitle Font'
  },
  YoutubeVideoUploadSuccessPopup: {
    title: 'Upload successful',
    confirmContent: 'confirm',
    uploadSuccessMessage: 'Upload was successful',
    uploadSuccessMessage_Info: `If an 'An error has occurred' window appears, please log in to YouTube with the account you uploaded.`
  },
  YoutubeVideoUploadPopup: {
    title: 'upload youtube video',
    closeContent: 'cancel',
    acceptContent: 'upload'
  },
  YoutubeVideoUploadPopupVideoPathContents: {
    file: 'File'
  },
  YoutubeVideoUploadPopupVideoTitleContents: {
    title: 'Title',
    title_Placehloder: 'Please write the title. (within 100 required characters)',
    error_TitleNull: 'Title is required.',
    error_TitleExceed: 'Title is too long.',
    error_TitleAngleBrackets: 'Angle brackets are not allowed.',
  },
  YoutubeVideoUploadPopupDescriptionContents: {
    description: 'Explain',
    description_Placeholder: 'Tell me about the video (up to 5000 characters)',
    error_DescriptionExceed: 'Video description too long (5000 characters limit)',
    error_DescriptionAngleBrackets: 'Video description too long (5000 characters limit)'
  },
  YoutubeVideoUploadPopupLicenseContents: {
    title: 'License',
    license_Youtube: 'Standard Youtube license',
    license_CreativeCommon: 'Creative Commons - Attribution'
  },
  YoutubeVideoUploadPopupTagsContents: {
    title: 'Tag',
    tags_Placeholder: 'Please enter a comma after each tag (500 characters or less)',
    errorMessage_TagIsTooLong: '* One tag is too long (100 characters limit)',
    errorMessage_TagsExceed: '* Too many tags (500 characters limit)',
    errorMessage_TagAngleBrackets: '* angle brackets not allowed',
  },
  YoutubeVideoUploadPopupKidLanguageContents: {
    kidOption_title: 'Viewer base',
    kidOption_false: 'Not for kids.',
    kidOption_ture: 'This is for children.',
    languageOption_Title: 'language',
    languageOption_Korean: 'Korean',
    languageOption_English: 'English',
  },
  YoutubeVideoUploadPopupCategoryContents: {
    title: 'Category',
    category_1: 'Movie / Animation',
    category_2: 'vehicles / transportation',
    category_3: 'music',
    category_4: 'pets / Animals',
    category_5: 'sports',
    category_6: 'travel / event',
    category_7: 'games',
    category_8: 'person/blog',
    category_9: 'comedy',
    category_10: 'entertainment',
    category_11: 'News / Politics',
    category_12: 'know-how / style',
    category_13: 'education',
    category_14: 'science and technology',
    category_15: 'non-profit / social movement'
  },
  YoutubeVideoUploadPopupEmbeddableContents: {
    title: 'Embed',
    embeddable_Permit: 'allow',
    embeddable_Forbid: 'disallow',
  },
  YoutubeVideoUploadPopupCaptionsContents: {
    title: 'CC',
    ccOption_None: 'none',
    ccOption_Origin: 'Korean',
    ccOption_Translated: 'English'
  },
  YoutubeVideoUploadPopupPrivacyContents: {
    title: 'Status',
    privacyOption_public: 'public',
    privacyOption_unlisted: 'unlisted',
    privacyOption_private: 'private',
  },
  SelectLanguage: {
    ko: 'ko',
    en: 'en',
    dual: 'dual'
  },
  AppInfoPopup: {
    Info_Information: 'Info',
    Info_Version: 'Version ',
    Info_Policy: 'Policy',
    Info_Privacy_Policy: 'Privacy Policy',
    Info_Google_Privacy_Policy: 'Google Privacy Policy',
    Info_Youtube_Terms_Of_Service: 'Youtube Terms of Service',
    Info_Contact: 'Contact',
    Info_Business_Email: 'Business: yes@mnutube.com',
    Info_Technical_Inquiry_Email: 'Technical: black@coderabbits.com'
  },
  SavePopup: {
    SavePopup_Title: 'save notice',
    SavePopup_Cotent: 'saved successfully'
  },
  InquiryPopupContainer: {
    TITLTE_IS_EMPTY_ERROR: 'Title must not be empty',
    TITLTE_MAXIMUME_CHARACTER_EXCEEDE_ERROR: 'The title can be up to 100 characters long.'
  },
  InquiryPopup: {
    title: 'Contact Us',
    acceptContent: 'Send',
    closeContent: 'Cancel',
    inquryTitle: 'Title',
    inquryContents: 'Contents',
    inqurySub: 'Other inquiries',
    mail_Title: 'Mail: ',
    mail_Contents: 'cap@downcap.net',
    kakao_Title: 'Kakao: ',
    kakao_Contents: 'https://open.kakao.com/o/gFVYT8Gc',
    call_Title: 'Phone: ',
    call_Contents: '010-6724-1227'
  },
  InquirySuccessPopup: {
    title: 'Contact Us',
    confirmContent: 'confirm',
    succes_Message: 'Your inquiry has been sent successfully.',
  },
  InquiryFailedPopup: {
    title: 'Contact Us',
    confirmContent: 'Confirm',
    failed_Message: 'Failed to send inquiry. Please call 010-6724-1227.'
  },
  InvalidFontCheckPopup: {
    title: 'Wait a minute',
    invaildFont_Message: 'This feature contains a font that cannot be used.',
    invaildFont_ChangeTo: 'Please change via above path',
    invaildFont_Change: '*Please change the subtitles below.',
    fontMenu: 'Style Tab > Font Settings >',
    invaildFont_time: 'time',
    invaildFont_sub: 'work contents',
    invaildFont_type: 'distinct',
    invaildFont_move: 'Move edit window',
    closeButton_Text: 'OK'
  },
  InvalidFontCheckLine: {
    move: 'Move',
    ko: 'KO',
    en: 'EN',
    line: 'Line',
    multi: 'Multi'
  },
  LetterCheckPopup: {
    title: 'Lack of Letters',
    letter_Lack_title: 'to use this feature',
    letter_Lack_About: 'about',
    letter_Lack: 'is Lack',
    closeButton_Text: 'OK'
  },
  WordSplit: {
    wordLength: 'Word Length'
  },
  PresetStyle: {
    recommendedStyle: 'Recommended Style',
    userStyle: 'User Style',
    saveStyle: 'Save'
  },
  TranslationPopup: {
    title: 'English Translation',
    acceptContent: 'OK',
    closeContent: 'Cancel',
    full_Translate_About: 'About full translation ',
    aboutLetter: ' Letter is',
    usingLetter: 'to be consumed.',
    translation_Notice: '* Only Korean/English translations are available.',
    translation_Edit_Notice: '* Additional letters may be consumed when editing the translation.'
  },
  RetranslatePopup: {
    title: 'retranslation',
    acceptContent: 'OK',
    closeContent: 'Cancel',
    retranslation_About: 'About retranslation ',
    aboutLetter: ' Letter is',
    usingLetter: 'to be consumed.',
    translation_Notice: '* Only Korean/English translations are available.',
    translation_Edit_Notice: '* Additional letters may be consumed when editing the translation.'
  },
  CaptionsExportPopup: {
    title: 'Export',
    closeContent: 'Cancel',
    acceptContent: 'Export',
    lnguage_Type_Select_Title: 'Subtitle Language',
    lnguage_Type_Select_Ko: 'Korean',
    lnguage_Type_Select_En: 'English',
    lnguage_Type_Select_KoEn: 'Ko + En',
    lnguage_Type_Select_EnKo: 'En + Ko',
    export_Type_Select_Title: 'File',
    export_Type_Select_Xml_Xmeml: 'Premier Pro',
    export_Type_Select_Xml_Fcpxml: 'Final Cut',
    export_Type_Select_Xml_Resolve: 'DaVinci Resolve',
    export_Notice: '※ This function cannot be used for multi-line.'
  },
  VideoExportSettingPopupContainer: {
    invalidFontType_LocalFont: 'Local Font'
  },
  VideoExportSettingPopup: {
    title: 'Export video',
    closeContent: 'Cancel',
    acceptContent: 'OK',
    selectCaptionLanguage: 'Select subtitle',
    ko: 'Korean',
    en: 'English',
    dual: 'dual'
  },
  VideoExportPendingPopup: {
    title: 'Progress of merging video and subtitles',
    progressBar_Text: 'Merge video and subtitles...',
    progress: 'progress',
    cancelButton_Text: 'Cancel'
  },
  VideoExportFailedPopupContainer: {
    unavailable_FileName_Message: `The file name may contain the following characters: (\ / : * < > |)`,
    ErrorGuidance_Invalid_Url_PathContent: 'There was a problem with the invalid export path.',
    ErrorGuidance_Invalid_Url_PathContent_Confirm: 'There was a problem because the export path is invalid.',
    defaultErrorContent: 'Something went wrong with the wrong export path.',
    defaultErrorContent_Inquiry: 'Something went wrong with the wrong export path.',
    defaultError_Unknown: 'Unknown error.'
  },
  VideoExportFailedPopup: {
    title: 'Video export failed',
    closeButton_Text: 'OK'
  },
  YoutubeOutlineStylesSelector: {
    none: 'None',
    shadow: 'Shadow',
    upper: 'Upper',
    lower: 'Lower',
    outLine: 'Out Line'
  },
  FontListTitle: {
    LocalOptions_Title: 'My Local Font',
    YoutubeOptions_Title: 'Youtube Font'
  },
  YoutubeFontsToOptions: {
    Monospaced_Serif: 'Monospaced Serif',
    Proportional_Serif: 'Proportional Serif',
    Monospaced_Sans_Serif: 'Monospaced Sans-Serif',
    Proportional_Sans_Serif: 'Proportional Sans-Serif',
    Casual: 'Casual',
    Cursive: 'Cursive',
    Small_Capitals: 'Small Capitals'
  },
  DetailHelpMessage: {
    PreviewTypeDetail: ' Screen Preview'
  },
  PresetItem: {
    downcap: 'DownCap'
  },
  ApplyAllStylesButton: {
    applyAll: 'applyAll'
  },
  ApplyAllStylesWarningPopup: {
    title: 'Apply all styles',
    closeContent: 'Cancel',
    acceptContent: 'OK',
    apply_All_Styles_Questions_Message: 'Apply the style as a whole?',
  },
  TranslatedInformationBoard: {
    Help: 'Help'
  }
};

export default TextResources;
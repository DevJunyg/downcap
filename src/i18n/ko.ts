import ITextResources from './ITextResources';

const TextResources: ITextResources = {
  translation: {
    Cancel: '취소',
    CreateSubtitles: '자막 생성',
    FormatControlTitle_Title: '자막 스타일',
    DualCaption_Sequence: '이중 자막 순서',
    DualCaption_Sequence_Up: '상',
    DualCaption_Sequence_Down: '하',
    FileOpen: '파일 열기',
    Load: '불러오기',
    Ok: '확인',
    Or: '또는',
    Style: '스타일',
    Export: '내보내기',
    SubtitlesExport: '자막 내보내기',
    VideoExport: '영상 내보내기',
    VideoSubutitlesTitle: '영상 자막',
    NoFileHasBeenSelected: '파일이 선택되지 않았습니다.',
    Subtitles: '자막',
    GetChanges: '변경 내용 가져오기',
    File: '파일',
    NewProject: '새프로젝트',
    Open: '열기',
    SaveProject: '프로젝트 저장',
    SaveAsProject: '다른 이름으로 프로젝트 저장',
    YoutubeUpload: '유튜브 업로드',
    YoutubeVideoUpload: '영상 업로드',
    YoutubeCaptionsUpload: '자막 업로드',
    HelpMenu: '도움말',
    Info: '정보',
    Shortcut: '단축키',
    Notice: '공지사항',
    Inquiry: '문의하기',
    HelpImg: '사용 Tip',
    MultiLineEditTile_Title_Html: '추가 자막',
    MultLineCreateNewLine: '추가 생성',
    RealTimeTranslation: '실시간 번역',
    Retranslate_Button_Text: '재번역',
    TranslateMultiLine_Translate_Pending_Description: '번역 중입니다...',
    TranslateMultiLine_Translate_Failed_Description: '번역에 실패 하였습니다.',
    Loading_Pending_Comments: '로딩 중입니다...',
    progressBar_Text: '음성 분석중입니다.'
  },
  TranslateProgressbar: {
    Trnaslate_Complate_Text: '번역완료',
    Translate_Progress_Text: '번역중',
    Translate_Un_Start_Text: '번역대기'
  },
  StyleEditSelector: {
    LineButton_Content: '라인',
    WordButton_Content: '단어'
  },
  ShortcutPopup: {
    Shortcut: '단축키',
    KeyboardShortcut: {
      playPause: '재생/멈춤',
      MoveCaption: '자막 이동',
      breakSentence: '문장나누기',
      combineSentences: '문장합치기',
      unDo: '실행취소',
      reDo: '다시실행',
      projectSave: '프로젝트저장',
      projectSaveAs: '다른이름으로 저장',
      newProject: '새프로젝트',
      openFile: '파일열기'
    }
  },
  Login: {
    email: '이메일',
    password: '비밀번호',
    capslock_ErrorMessage: '* CapsLock이 켜져 있습니다.',
    stayLogin: '로그인 상태 유지',
    login: '로그인',
    signup: '회원가입',
    forgotPassword: '비밀번호 찾기',
  },
  LoginContainer: {
    ErrorDescription_EmaliEmpty: '이메일을 입력해 주세요.',
    ErrorDescription_PasswordEmpty: '비밀번호를 입력해 주세요.',
    ErrorDescription_Server: '서버 오류로 인해 로그인에 실패 했습니다.',
    ErrorDescription_LoginFailed: '이메일 또는 비밀번호가 잘못되었습니다.',
    ErrorDescription_Unkown: '알지 못하는 오류로 로그인에 실패 했습니다.'
  },
  YoutubeSearchBox: {
    placeholder_Text: '동영상 링크 또는 유튜브 검색'
  },
  FileOpenArea: {
    localFile: '내 컴퓨터 파일',
    fileType: '(영상/녹음/자막/다운캡저장파일)',
    click: '클릭',
    or: '또는',
    dragAndDrop: '드래그 드롭'
  },
  UserInfo: {
    userInfoChange: '내 정보 수정',
    letterPurchase: '구매',
    logout: '로그아웃'
  },
  CaptionsExportPopupContainer_handleOkClickAsync: {
    exportSuccess_Title: '내보내기'
  },
  CaptionsExportSuccessPopup: {
    title: '내보내기',
    confirmContent: '확인',
    Captions_Export_Success_Message: '내보내기에 성공하였습니다.'
  },
  FileOpenPopupContainer_openSrtAsync: {
    srtPath_NotExist: '자막을 선택 해 주세요'
  },
  FileOpenPopup: {
    fileOpiton_stc: '영상 + 자막 (음성분석)',
    fileOpiton_video: '영상 파일',
    fileOpiton_srt: '자막 파일',
    stcDetail_expectedTime: '예상 시간',
    stcDetail_about: '약',
    stcDetail_minute: '분',
    stcDetail_hour: '시간',
    stcDetail_letterUsing: '소모',
    stcDetail_notice: '※ 한국어만 음성분석이 가능합니다.',
    captionDetail_error: '자막을 선택해주세요',
    captionDetail_title: '자막',
    captionDetail_selectCaption: '자막 선택',
    closeContent: '취소',
    acceptContent: '확인',
    filePath: '내 컴퓨터',
    fileOpen: '불러오기',
  },
  NewProjectPopup: {
    title: '새 프로젝트 열기',
    closeContent: '취소',
    acceptContent: '확인',
    popupMessage: '새 프로젝트를 여시겠습니까?',
  },
  YouTubeVideoOpenPopupContainer: {
    youtube_CaptionLoad_HelpMessage: '유튜브 자막을 가져오기 위해서는 구글 계정 연동이 필요합니다'
  },
  YouTubeVideoOpenPopup: {
    SttRequestInfo_About: '약',
    SttRequestInfo_AboutTime: '예상시간',
    SttRequestInfo_DefulatPredictionValue: '알 수 없음',
    SttRequestInfo_Minute: '분',
    SttRequestInfo_LetterUsing: '소모',
    SttInfo_Notice: '영상을 불러오는 중입니다...',
    CaptionOptions_Default: '자막이 없습니다.',
    LocalCaptionLoadInfo_StrSelectError: '자막을 선택해주세요',
    LocalCaptionLoadInfo_ConttnesTitle: '자막',
    LocalCaptionLoadInfo_AttachFileButton_Text: '자막 선택',
    CaptionLoadHelpMessage_Notice: '* 유튜브 자막을 가져오기 위해서는',
    CaptionLoadHelpMessage_NoticeLink: '영상계정과의 연결',
    CaptionLoadHelpMessage_NoticeLink_Sub: '이 필요합니다.',
    CaptionNotFound_Notice_CaptionNullError: '유튜브 자막이 존재하지 않습니다.',
    youtubeCaption: '유튜브 자막',
    title: '유튜브 영상',
    closeContent: '취소',
    acceptContent: '확인',
    loadVideo_Title: '불러오기',
    loadVideo_Option_Stt: '영상 + 자막 (음성분석)',
    loadVideo_Option_Video: '영상 파일',
    loadVideo_Option_Caption: '자막 파일'
  },
  YoutubeCaptionsUploadPopupContainer: {
    handleOk_invaildFont: '유튜브 CC자막 폰트'
  },
  YoutubeCaptionsUploadPopup: {
    title: '유튜브로 업로드',
    acceptContent: '업로드',
    closeContent: '취소',
    captionLanguage: '자막 언어',
    uploadToKo: '한글 자막으로 업로드',
    uploadToEn: '영어 자막으로 업로드',
    koCaption: '한글',
    enCaption: '영어',
    koEnCaption: '한영자막',
    EnKoCaption: '영한자막',
    file: '파일',
    overWrite: '기존 자막 덮어쓰기',
    insert: '새로운 자막으로 저장하기',
    optoin: '옵션',
    cc_Option: 'CC 자막 자동 표시',
    address: '주소'
  },
  YoutubeCaptionUploadSuccessPopup: {
    title: '업로드 성공',
    confirmContent: '확인',
    uploadSuccessMessage: '업로드에 성공했습니다',
    uploadSuccessMessage_Info: '만약, 업로드한 자막이 보이지 않는다면 새로 고침을 해주세요'
  },
  YoutubeVideoUploadPopupContainer: {
    embeddableMessage: '*퍼가기 비허용으로 설정된 영상은 다운캡으로 가져오실 수 없습니다.',
    handleOk_invaildFont: '유튜브 CC자막 폰트'
  },
  YoutubeVideoUploadSuccessPopup: {
    title: '업로드 성공',
    confirmContent: '확인',
    uploadSuccessMessage: '업로드에 성공했습니다',
    uploadSuccessMessage_Info: `만약, '오류가 발생했습니다.'라는 창이 뜬다면 업로드한 계정으로 YouTube에 로그인해 주세요`
  },
  YoutubeVideoUploadPopup: {
    title: '유튜브 영상 업로드',
    closeContent: '취소',
    acceptContent: '업로드'
  },
  YoutubeVideoUploadPopupVideoPathContents: {
    file: '파일'
  },
  YoutubeVideoUploadPopupVideoTitleContents: {
    title: '제목',
    title_Placehloder: '제목을 적어주세요. (필수 100자 이내)',
    error_TitleNull: '제목은 필수 입력입니다.',
    error_TitleExceed: '제목이 너무 깁니다.',
    error_TitleAngleBrackets: '꺽쇠괄호는 허용되지 않습니다.',
  },
  YoutubeVideoUploadPopupDescriptionContents: {
    description: '설명',
    description_Placeholder: '동영상에 대해 알려주세요 (5000자 이내)',
    error_DescriptionExceed: '동영상 설명이 너무 깁니다 (5000자 제한)',
    error_DescriptionAngleBrackets: '동영상 설명이 너무 깁니다 (5000자 제한)'
  },
  YoutubeVideoUploadPopupLicenseContents: {
    title: '라이선스',
    license_Youtube: '표준 Youtube 라이선스',
    license_CreativeCommon: '크리에이티브 커먼즈 - 저작자 표시'
  },
  YoutubeVideoUploadPopupTagsContents: {
    title: '태그',
    tags_Placeholder: '각 태그 뒤에 쉼표를 입력하여 작성해주세요 (500자 이내)',
    errorMessage_TagIsTooLong: '* 하나의 태그가 너무 깁니다 (100자 제한)',
    errorMessage_TagsExceed: '* 태그가 너무 많습니다 (500자 제한)',
    errorMessage_TagAngleBrackets: '* 꺽쇠괄호는 허용되지 않습니다',
  },
  YoutubeVideoUploadPopupKidLanguageContents: {
    kidOption_title: '시청자층',
    kidOption_false: '아동용이 아닙니다.',
    kidOption_ture: '아동용 입니다.',
    languageOption_Title: '언어',
    languageOption_Korean: '한국어',
    languageOption_English: '영어',
  },
  YoutubeVideoUploadPopupCategoryContents: {
    title: '카테고리',
    category_1: '영화/애니메이션',
    category_2: '자동차/교통',
    category_3: '음악',
    category_4: '애완동물/동물',
    category_5: '스포츠',
    category_6: '여행/이벤트',
    category_7: '게임',
    category_8: '인물/블로그',
    category_9: '코미디',
    category_10: '엔터테인먼트',
    category_11: '뉴스/정치',
    category_12: '노하우/스타일',
    category_13: '교육',
    category_14: '과학기술',
    category_15: '비영리/사회운동'
  },
  YoutubeVideoUploadPopupEmbeddableContents: {
    title: '퍼가기',
    embeddable_Permit: '허용',
    embeddable_Forbid: '비허용',
  },
  YoutubeVideoUploadPopupCaptionsContents: {
    title: 'CC자막',
    ccOption_None: '안함',
    ccOption_Origin: '한글',
    ccOption_Translated: '영어'
  },
  YoutubeVideoUploadPopupPrivacyContents: {
    title: '공개상태',
    privacyOption_public: '공개',
    privacyOption_unlisted: '일부 공개',
    privacyOption_private: '비공개',
  },
  SelectLanguage: {
    ko: '한글',
    en: '영어',
    dual: '이중'
  },
  AppInfoPopup: {
    Info_Information: '정보',
    Info_Version: '버전',
    Info_Policy: '정책',
    Info_Privacy_Policy: '개인정보처리방침',
    Info_Google_Privacy_Policy: 'Google 개인정보처리방침',
    Info_Youtube_Terms_Of_Service: 'Youtube Terms Of Service',
    Info_Contact: '연락처',
    Info_Business_Email: '비즈니스: yes@mnutube.com',
    Info_Technical_Inquiry_Email: '기술관련: black@coderabbits.com'
  },
  SavePopup: {
    SavePopup_Title: '저장 알림',
    SavePopup_Cotent: '성공적으로 저장 되었습니다'
  },
  InquiryPopupContainer: {
    TITLTE_IS_EMPTY_ERROR: '제목은 비어 있으면 안됩니다.',
    TITLTE_MAXIMUME_CHARACTER_EXCEEDE_ERROR: '제목은 최대 100글자까지 가능합니다.'
  },
  InquiryPopup: {
    title: '문의하기',
    acceptContent: '보내기',
    closeContent: '취소',
    inquryTitle: '제목',
    inquryContents: '내용',
    inqurySub: '※그 외 문의하기',
    mail_Title: '메일: ',
    mail_Contents: 'cap@downcap.net',
    kakao_Title: '카톡: ',
    kakao_Contents: 'https://open.kakao.com/o/gFVYT8Gc',
    call_Title: '전화: ',
    call_Contents: '010-6724-1227'
  },
  InquirySuccessPopup: {
    title: '문의하기',
    confirmContent: '확인',
    succes_Message: '문의가 성공적으로 전송 되었습니다.',
  },
  InquiryFailedPopup: {
    title: '문의하기',
    confirmContent: '확인',
    failed_Message: '문의 전송에 실패 했습니다. 010-6724-1227로 전화 부탁 드립니다.'
  },
  InvalidFontCheckPopup: {
    title: '잠깐만요',
    invaildFont_Message: '해당 기능에 사용할 수 없는 폰트가 포함되어 있습니다.',
    invaildFont_ChangeTo: '를 통해 변경해 주세요.',
    invaildFont_Change: '* 아래의 자막을 변경해 주세요.',
    fontMenu: '스타일탭 > 폰트설정 >',
    invaildFont_time: '시간',
    invaildFont_sub: '작업내용',
    invaildFont_type: '구분',
    invaildFont_move: '편집창 이동',
    closeButton_Text: '확인'
  },
  InvalidFontCheckLine: {
    move: '이동',
    ko: '한글',
    en: '영어',
    line: '라인',
    multi: '멀티'
  },
  LetterCheckPopup: {
    title: 'Letter 부족',
    letter_Lack_title: '이 기능을 사용하기엔',
    letter_Lack_About: '약',
    letter_Lack: '가 부족합니다.',
    closeButton_Text: '확인'
  },
  WordSplit: {
    wordLength: '글자수'
  },
  PresetStyle: {
    recommendedStyle: '추천 스타일',
    userStyle: '사용자 스타일',
    saveStyle: '저장'
  },
  TranslationPopup: {
    title: '영어번역',
    acceptContent: '확인',
    closeContent: '취소',
    full_Translate_About: '전체번역시 약 ',
    aboutLetter: ' Letter가',
    usingLetter: '소모될 예정입니다.',
    translation_Notice: '* 한/영 번역만 가능합니다.',
    translation_Edit_Notice: '* 번역 내용 수정 시 Letter가 추가적으로 소모될 수 있습니다.'
  },
  RetranslatePopup: {
    title: '재번역',
    acceptContent: '확인',
    closeContent: '취소',
    retranslation_About: '재번역시 약 ',
    aboutLetter: ' Letter가',
    usingLetter: '소모될 예정입니다.',
    translation_Notice: '* 한/영 번역만 가능합니다.',
    translation_Edit_Notice: '* 번역 내용 수정 시 Letter가 추가적으로 소모될 수 있습니다.'
  },
  CaptionsExportPopup: {
    title: '내보내기',
    closeContent: '취소',
    acceptContent: '내보내기',
    lnguage_Type_Select_Title: '자막 언어',
    lnguage_Type_Select_Ko: '한글',
    lnguage_Type_Select_En: '영어',
    lnguage_Type_Select_KoEn: '한글 + 영어',
    lnguage_Type_Select_EnKo: '영어 + 한글',
    export_Type_Select_Title: '파일',
    export_Type_Select_Xml_Xmeml: '프리미어 프로',
    export_Type_Select_Xml_Fcpxml: '파이널컷',
    export_Type_Select_Xml_Resolve: '다빈치 리졸브',
    export_Notice: '※ 멀티라인은 해당 기능을 이용할 수 없습니다.'
  },
  VideoExportSettingPopupContainer: {
    invalidFontType_LocalFont: '로컬 폰트'
  },
  VideoExportSettingPopup: {
    title: '영상 내보내기',
    closeContent: '취소',
    acceptContent: '확인',
    selectCaptionLanguage: '자막 선택',
    ko: '한글',
    en: '영어',
    dual: '이중'
  },
  VideoExportPendingPopup: {
    title: '영상과 자막 합치기 진행상황',
    progressBar_Text: '영상과 자막을 합치는 중입니다...',
    progress: '진행률',
    cancelButton_Text: '취소'
  },
  VideoExportFailedPopupContainer: {
    unavailable_FileName_Message: `파일 이름에 다음 문자가 포함되어 있을 수 있습니다.(￦ / : * < > |)`,
    ErrorGuidance_Invalid_Url_PathContent: '내보내기 경로가 잘못되어 문제가 발생했습니다.',
    ErrorGuidance_Invalid_Url_PathContent_Confirm: '내보내기 경로가 잘못되어 문제가 발생했습니다.',
    defaultErrorContent: '내보내기 경로가 잘못되어 문제가 발생했습니다.',
    defaultErrorContent_Inquiry: '내보내기 경로가 잘못되어 문제가 발생했습니다.',
    defaultError_Unknown: '알 수 없는 에러입니다.'
  },
  VideoExportFailedPopup: {
    title: '영상 내보내기 실패',
    closeButton_Text: '확인'
  },
  YoutubeOutlineStylesSelector: {
    none: '없음',
    shadow: '그림자',
    upper: '높임',
    lower: '낮춤',
    outLine: '윤곽선'
  },
  FontListTitle: {
    LocalOptions_Title: '내 컴퓨터 폰트',
    YoutubeOptions_Title: '유튜브 폰트'
  },
  YoutubeFontsToOptions: {
    Monospaced_Serif: '고정 너비 Serif',
    Proportional_Serif: '비례 너비 Serif',
    Monospaced_Sans_Serif: '고정 너비 Sans-Serif',
    Proportional_Sans_Serif: '비례 너비 Sans-Serif',
    Casual: '캐주얼',
    Cursive: '필기체',
    Small_Capitals: '작은 대문자'
  },
  DetailHelpMessage: {
    PreviewTypeDetail: '에서 보여지는 화면입니다.'
  },
  PresetItem: {
    downcap: '다운캡'
  },
  ApplyAllStylesButton: {
    applyAll: '전체 적용'
  },
  ApplyAllStylesWarningPopup: {
    title: '스타일 전체 적용',
    closeContent: '취소',
    acceptContent: '확인',
    apply_All_Styles_Questions_Message: '스타일을 전체 적용 하시겠습니까?',
  },
  TranslatedInformationBoard: {
    Help: '도움말'
  }
};

export default TextResources;
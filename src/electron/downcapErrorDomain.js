Object.defineProperty(exports, "__esModule", {
  value: true
});

const downcapErrorDomain = {
  Downcap_Auth: 'Downcap.Auth',
  Downcap_Auth_AccessTokenNotFound: 'Downcap.Auth.AccessTokenNotFound',
  Downcap_Auth_ExpiredSecurityStamp: 'Downcap.Auth.ExpiredSecurityStamp',
  Downcap_Auth_ExpiredTokenTime: 'Downcap.Auth.ExpiredTokenTime',
  Downcap_Auth_UserNotFound: 'Downcap.Auth.UserNotFound',
  Downcap_Letter_LowLetter: 'Downcap.Letter.LowLetter',
  Downcap_Login_GoogleLoginNotProvided: 'Downcap.Login.GoogleLoginNotProvided',
  Google_OAuth_InvalidGrant: 'Google.OAuth.InvalidGrant',
  Goolge_OAuth_InvalodAuthenticationCredentials: 'Goolge.OAuth.InvalodAuthenticationCredentials',
  Youtube_UnauthorizedForceSSL: 'Youtube.UnauthorizedForceSSL',
  Youtube_Caption_Exists: 'Youtube.Caption.Exists',
  Youtube_Caption_InvalidMetadata: 'Youtube.Caption.InvalidMetadata',
  Youtube_Video_NotFound: 'Youtube.Video.NotFound',
  Youtube_Forbidden: 'Youtube.Forbidden'
};

Object.freeze(downcapErrorDomain);
exports.default = downcapErrorDomain;

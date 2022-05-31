import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as mulitilineActions from 'storeV2/modules/multiline';
import * as translatedCaptionActions from 'storeV2/modules/translatedCaption';
import * as translatedMultilineActions from 'storeV2/modules/translatedMultiline';

const captionActionsDictractory = ({
  "originCaption": originCaptionActions,
  "multiline": mulitilineActions,
  "translatedCaption": translatedCaptionActions,
  "translatedMultiline": translatedMultilineActions
});

export default Object.freeze(captionActionsDictractory);
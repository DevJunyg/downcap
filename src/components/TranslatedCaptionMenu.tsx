import RealTimeTranslationButtonContainer from "containers/RealTimeTranslationButtonContainer";
import React from "react";

function TranslatedCaptionMenu() {
  return (
    <div className='d-flex'>
      <RealTimeTranslationButtonContainer />
    </div>
  )
}

export default React.memo(TranslatedCaptionMenu);
import TranslateProgressbar from "components/TranslateProgressbar";
import React from "react";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';


export default function TranslateProgressbarCotainer() {
  const nowTranslateTaskLength = ReactRedux.useSelector<
    store.RootState,
    number | undefined
  >(state => state.present.project.nowTranslateTaskLength);

  const totalTranslateTaskLength = ReactRedux.useSelector<
    store.RootState,
    number | undefined
  >(state => state.present.project.totalTranslateTaskLength);

  const [rendered, setRendered] = React.useState(false);

  React.useEffect(() => {
    if (!rendered && nowTranslateTaskLength !== totalTranslateTaskLength) {
      setRendered(true);
    }
  }, [rendered, nowTranslateTaskLength, totalTranslateTaskLength]);

  let percent: number | undefined;
  if (totalTranslateTaskLength !== undefined) {
    percent = (nowTranslateTaskLength ?? 0) / totalTranslateTaskLength;
  }

  return (
    rendered ? <TranslateProgressbar percent={percent} /> : null
  )
}
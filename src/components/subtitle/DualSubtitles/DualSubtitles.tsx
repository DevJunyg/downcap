//@ts-check
import React from 'react';
import './DualSubtitles.scss';
import ClassNameHelper from 'ClassNameHelper';
import { IEventParagraph } from 'storeV2';
import { ReadOnlyTimeBox } from 'components/common/captionsTimeBox';

interface IDoubleSubtitlesProps extends React.HTMLAttributes<HTMLDivElement> {
  paragraph: IEventParagraph
  autoScroll?: boolean
}

function DualSubtitles(
  props: React.PropsWithChildren<IDoubleSubtitlesProps>,
) {
  const divEl = React.useRef<HTMLDivElement>(null);
  const { paragraph, className, autoScroll, ...rest } = props;
  const cName = ClassNameHelper.concat('double-subtitles outline-none', className);
  const firstText = paragraph.lines[0]?.words.map(word => word.text).join(' ');
  const secondText = paragraph.lines[1]?.words.map(word => word.text).join(' ');

  React.useEffect(_autoScrollEffect, [props.autoScroll])
  return (
    <div ref={divEl}
      {...rest}
      className={cName}
      tabIndex={0}
    >
      <ReadOnlyTimeBox
        start={paragraph.start}
        end={paragraph.end}
      />
      <div className="words-box">
        <div className="first-subtitle">
          <label>{firstText}</label>
        </div>
        <div className="second-subtitle">
          <label>{secondText}</label>
        </div>
      </div>
    </div>
  )

  function _autoScrollEffect() {
    const div = divEl.current;
    if (!props.autoScroll || !div) {
      return;
    }

    let timeoutId = setTimeout(() => {
      div.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    }
  }
}

export default DualSubtitles;

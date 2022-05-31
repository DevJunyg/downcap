import React from 'react';
import { YoutubeFonts } from 'youtube/YoutubeFonts';
import ReactFontManager from 'lib/ReactFontManager';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import LocalOption from './FontOptions/LocalOption';
import YoutubeOption from './FontOptions/YoutubeOption';
import { useTranslation } from 'react-i18next';

const fontSelecterStyle = { border: '0', backgroundColor: 'transparent', cursor: 'pointer' };
const disabledStyle = { backgroundColor: '#dedede' }
interface IYoutubeFontSelectProps {
  value?: string | number,
  disabled?: boolean,
  fonts?: Array<string | number>,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

function FontOption(props: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return (
    <option value={props.value}>{props.value}</option>
  )
}

function FontsToOptions(fonts: readonly string[]) {
  return fonts.map(font => <FontOption key={font} value={font} />);
}

function YoutubeFontsToOptions() {
  const { t } = useTranslation('YoutubeFontsToOptions');
  return Object.keys(YoutubeFonts).map(fontId => <option key={fontId} value={fontId}>{t(YoutubeFonts[fontId])}</option>);
}

function YoutubeFontOptions() {
  return (
    <>
      <YoutubeOption />
      {YoutubeFontsToOptions()}
    </>
  )
}

function LocalFontOptions(props: { fonts: readonly string[] }) {
  return (
    <>
      <LocalOption />
      {FontsToOptions(props.fonts)}
    </>
  )
}

function FontOptions(props: { fonts?: readonly string[] }) {
  return (
    <>
      <YoutubeFontOptions />
      {props.fonts && <LocalFontOptions fonts={props.fonts} />}
    </>
  )
}

const logger = ReactLoggerFactoryHelper.build('YoutubeFontSelect');
const YoutubeFontSelect = (props: IYoutubeFontSelectProps) => {
  const [fonts, setFonts] = React.useState<readonly string[]>();

  React.useEffect(() => {
    ReactFontManager.getFontsAsync()
      .then(loadedFonts => setFonts(loadedFonts))
      .catch(logger.logWarning)
      .finally(() => logger.logInformation('The font list read.'));
  }, []);

  const options = React.useMemo(() => <FontOptions fonts={fonts} />, [fonts]);
  return (
    <select style={{ ...fontSelecterStyle, color: props.disabled ? 'darkgray' : undefined }}
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange}
    >
      {fonts ? options : '글꼴을 불러오는 중입니다'}
    </select>
  )
};

export default React.memo<IYoutubeFontSelectProps>(YoutubeFontSelect,
  (prevProps, nextProps) => {
    return prevProps.disabled !== nextProps.disabled
      && prevProps.value !== nextProps.value
      && prevProps.onChange !== nextProps.onChange
  }
);

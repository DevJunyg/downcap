import React from 'react';
import * as store from "storeV2";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import PreviewWebIcon from 'components/icons/PreviewWebIcon'
import PreviewIosIcon from 'components/icons/PreviewIosIcon'
import PreviewAndroidIcon from 'components/icons/PreviewAndroidIcon'
import { useTranslation } from 'react-i18next';

interface PreviewButtonProps {
  selectedPreviewName: store.PreviewType;
  onChange: (event: React.MouseEvent, value: store.PreviewType) => void;
}

const buttonStyle = { backgroundColor: '#7d1ed8' };

interface IPreviewHelpMessageProps {
  previewName: store.PreviewType;
}

function HelpMessage(props: IPreviewHelpMessageProps) {
  return (
    <div className="no-drag">※ <span>{props.previewName}</span></div>
  )
}

function DetailHelpMessage(props: IPreviewHelpMessageProps) {
  const { t } = useTranslation('DetailHelpMessage');
  return (
    <div className="no-drag">※ <span>{props.previewName}</span>{t('PreviewTypeDetail')}</div>
  )
}

export default function PreviewButton(props: PreviewButtonProps) {
  const previewButtonRef = React.useRef<HTMLDivElement>(null);
  const [displayedDetaileHelpMessage, setDisplayedDetaileHelpMessage] = React.useState<boolean>(false);
  React.useEffect(() => {
    const previewButtonArea = previewButtonRef.current?.parentElement;
    if (!previewButtonArea) {
      return;
    }

    const width = previewButtonArea.clientWidth;
    setDisplayedDetaileHelpMessage(width > 440);
  }, [previewButtonRef?.current?.parentElement?.clientWidth])

  const previewSelect = {
    'web': false,
    'android': false,
    'ios': false
  }

  previewSelect[props.selectedPreviewName] = true;

  const PreviewIcons = {
    'web': (iconProps: React.SVGProps<SVGSVGElement>) => <PreviewWebIcon {...iconProps} />,
    'android': (iconProps: React.SVGProps<SVGSVGElement>) => <PreviewAndroidIcon {...iconProps} />,
    'ios': (iconProps: React.SVGProps<SVGSVGElement>) => <PreviewIosIcon {...iconProps} />
  }

  const previewButtons = (Object.keys(previewSelect) as Array<store.PreviewType>).map(select => {
    const Icon = PreviewIcons[select];
    return (
      <ToggleButton key={select}
        value={select}
        disabled={previewSelect[select]}
        style={previewSelect[select] ? buttonStyle : undefined}
      >
        <Icon style={previewSelect[select] ? { fill: 'white' } : undefined} />
      </ToggleButton>
    )
  });

  const HelpMessageComponent = displayedDetaileHelpMessage ? DetailHelpMessage : HelpMessage;

  return (
    <div ref={previewButtonRef} className="left-bottom-tab-toggle d-flex align-items-center h-100">
      <HelpMessageComponent previewName={props.selectedPreviewName} />
      <ToggleButtonGroup exclusive
        onChange={(_evt, value) => props.onChange(_evt, value)}
        className="toggle-group"
        style={{ height: '28px' }}
      >
        {previewButtons}
      </ToggleButtonGroup>
    </div>
  )
}
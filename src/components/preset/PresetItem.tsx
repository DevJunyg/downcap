import React from 'react';
import { rgbaToString } from 'lib/utils';
import PresetRemoveButton from './PresetRemoveButton';
import StyleParser from 'StyleParser';
import IIdPreset from 'IIdPreset';
import { useTranslation } from 'react-i18next';

interface IPresetItemProps {
  preset: IIdPreset;
  readonly?: boolean;
  index: number;
  onClick?: (evt: React.MouseEvent<HTMLDivElement>, preset: IIdPreset) => void;
  onRemoveClick?: (evt: React.MouseEvent<HTMLDivElement>, index: number) => void;
}

const PresetItem = (props: IPresetItemProps) => {
  const backgroundColor = props.preset.background && rgbaToString(props.preset.background);

  const { preset, index, onClick, onRemoveClick } = props;
  const onRemoveClickCallback = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
    evt => onRemoveClick && onRemoveClick(evt, index), [onRemoveClick, index]
  )

  const onClickCallback = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
    evt => onClick && onClick(evt, preset), [onClick, preset]
  )
  const { t } = useTranslation('PresetItem');

  return (
    <div className='position-relative'>
      <div
        className='preset-item text-center'
        onClick={onClickCallback}
        style={{
          ...StyleParser.wordStyleParse(props.preset),
          fontSize: '1rem'
        }}>
        <div className="background-color-view-port" style={{ backgroundColor: backgroundColor }}>
          <label
            className='pointer no-drag'
            style={{ fontFamily: 'inherit' }}>
            {t('downcap')}
          </label>
        </div>

      </div>
      {!props.readonly &&
        <PresetRemoveButton
          onClick={onRemoveClickCallback}
        />
      }
    </div>
  )
}

function areEqual(prevProps: IPresetItemProps, nextProps: IPresetItemProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.preset === nextProps.preset
    && prevProps.readonly === nextProps.readonly
    && prevProps.index === nextProps.index
    && prevProps.onClick === nextProps.onClick
    && prevProps.onRemoveClick === nextProps.onRemoveClick;
}

export default React.memo<IPresetItemProps>(PresetItem, areEqual);

import IArea from 'IArea';
import OriginOverlayProviderCotainer from './OriginOverlayProviderContainer';
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import TranslatedOverlayProviderCotainer from './TranslatedOverlayProviderCotainer';
import MultilineOverlayProviderContainer from './MultilineOverlayProviderContainer';
import TranslatedMultilineOverlayProviderContainer from './TranslatedMultilineOverlayProviderContainer';
import DualCaptionOverlayContainer from './DualCaptionOverlayContainer';
import DualMultilineOverlayProviderContainer from './DualMultilineOverlayProviderContainer';
interface IOverlayProviderContainerProps {
  area?: IArea
  fontUnitSize?: number;
}

function OriginOvelraysProvider(props: IOverlayProviderContainerProps) {
  return (
    <>
      <OriginOverlayProviderCotainer
        area={props.area}
        fontUnitSize={props.fontUnitSize}
      />
      <MultilineOverlayProviderContainer
        area={props.area}
        fontUnitSize={props.fontUnitSize}
      />
    </>
  )
}

function TranslatedOverlaysProvider(props: IOverlayProviderContainerProps) {
  return (
    <>
      <TranslatedOverlayProviderCotainer
        area={props.area}
        fontUnitSize={props.fontUnitSize}
      />
      <TranslatedMultilineOverlayProviderContainer
        area={props.area}
        fontUnitSize={props.fontUnitSize}
      />
    </>
  )
}


function DualOvelraysProvider(props: IOverlayProviderContainerProps) {
  return (
    <>
      <DualCaptionOverlayContainer
        area={props.area}
        fontUnitSize={props.fontUnitSize}
      />
      <DualMultilineOverlayProviderContainer
        area={props.area}
        fontUnitSize={props.fontUnitSize}
      />
    </>
  )
}

function OverlayProviderContainer(props: IOverlayProviderContainerProps) {
  const selectedEditType = ReactRedux.useSelector<
    store.RootState, store.EditType
  >(state => state.present.project.selectedEditType);

  const areaMergin = 48;
  const playerWidth = props.area?.width ?? document.body.clientWidth / 2 - areaMergin;
  const fontUnitSize = Math.round(playerWidth * 25) / 1000;

  const Providers = {
    'origin': OriginOvelraysProvider,
    'translated': TranslatedOverlaysProvider,
    'dual': DualOvelraysProvider
  }

  const Provider = Providers[selectedEditType];

  return (
    <Provider
      area={props.area}
      fontUnitSize={fontUnitSize}
    />
  )
}

function propsAreEqual(
  prevProps: Readonly<IOverlayProviderContainerProps>,
  nextProps: Readonly<IOverlayProviderContainerProps>
) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.area === nextProps.area;
}

export default React.memo(OverlayProviderContainer, propsAreEqual);
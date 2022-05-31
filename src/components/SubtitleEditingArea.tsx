import SelectLanguageContainer from 'containers/SelectLanguageContainer';
import React from 'react';
import VideoCaptionTitlebarContainer from 'containers/VideoCaptionTitlebarContainer';
import HelpImgContainer from 'containers/HelpImgContainer';

interface IOrigincalSubtitileEditingAreaProperties {
  children?: React.ReactNode,
  Options?: React.ReactNode
}


const cotentStyle: React.CSSProperties = {
  height: 'calc(100% - 77.19px)',
  overflowY: 'auto'
};

const SubtitleContent = React.memo(props => {
  return (
    <div style={cotentStyle}>
      {props.children}
    </div>
  )
})

const HorizontalBound = React.memo(() => <hr style={{ margin: 0, padding: 0 }} />)
const areaStyle: React.CSSProperties = ({
  height: '100%',
  overscrollBehavior: 'contain',
  marginLeft: '1rem', overflowY:
    'hidden'
});

const SubtitleEditingArea = React.memo<IOrigincalSubtitileEditingAreaProperties>(props => (
  <div style={areaStyle}>
    <div>
      <SelectLanguageContainer />
      <HelpImgContainer />    
    </div>
    <VideoCaptionTitlebarContainer />
    <HorizontalBound />
    <SubtitleContent>
      {props.children}
    </SubtitleContent>
  </div>
));

export default SubtitleEditingArea;
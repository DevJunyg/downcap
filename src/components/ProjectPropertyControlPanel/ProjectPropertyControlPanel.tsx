import ActivableMenu from 'components/common/ActivableMenu';
import React, { Component } from 'react';
import './ProjectPropertyControlPanel.scss';
import PreviewButton from './PreviewButton';
import { IActivableMenuProps } from 'components/common/ActivableMenu/ActivableMenu';
import { PreviewType } from 'storeV2';
import { withTranslation, WithTranslation } from 'react-i18next';

interface LeftBottomTabProps {
  tabIndex: number;
  selectedPreviewName: PreviewType;
  tabComponent: JSX.Element | undefined;
  height: string;
  onTabIndexChange: (param: number) => void;
  onChange: (event: React.MouseEvent, value: PreviewType) => void;
}

const StyleMenuItem = withTranslation()(React.memo<WithTranslation>(props => <div>{props.t('Style')}</div>));

type ProjectMenuType = Omit<IActivableMenuProps, 'children'>;

const ProjectMenu = (props: ProjectMenuType) => (
  <ActivableMenu {...props}>
    <StyleMenuItem />
  </ActivableMenu>
)

class ProjectPropertyControlPanel extends Component<LeftBottomTabProps>{
  render() {
    const { tabIndex, tabComponent, height, onChange } = this.props;

    return (
      <div className="left-bottom-container" style={{ height }}>
        <div className="left-bottom h-100">
          <div className="tab-menu d-flex justify-content-space-between">
            <ProjectMenu
              className="tab d-flex pointer"
              activationIndex={tabIndex}
              onTabIndexChange={this.props.onTabIndexChange} />
            <PreviewButton
              selectedPreviewName={this.props.selectedPreviewName}
              onChange={onChange}
            />
          </div>
          <div style={{ backgroundColor: "white", height: 'calc(100% - 30px)', overflowY: 'auto', paddingLeft: '1rem' }}>
            {tabComponent}
          </div>
        </div>
      </div >
    );
  }
}

export default withTranslation()(ProjectPropertyControlPanel);

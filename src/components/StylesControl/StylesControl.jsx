//@ts-check
import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

import './StylesControl.scss'

/**
 * 
 * @param {object} props
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 */
function SequenceCompoenet(props) {
  const { t } = useTranslation("translation");
  const { children } = props;
  return (
    <div className='styles-control-context-item'>
      <div className='styles-control-context-item-title' >
        <h4>{t("DualCaption_Sequence")}</h4>
      </div>
      <div style={{
        justifyContent: 'center',
        display: 'flex'
      }}>
        {children}
      </div>
    </div>
  )
}

/**
 * @typedef {object} Props
 * @property {JSX.Element | JSX.Element[]} [formatControls]
 * @property {JSX.Element} [preset]
 * @property {JSX.Element} [sequence]
 * 
 * @extends {Component<Props>}
 */
class StylesControl extends Component {
  render() {
    const { formatControls, preset, sequence } = this.props;
    return (
      <div className='styles-control'>
        <div className='styles-control-context' style={{ overflowY: 'auto' }}>
          <div>
            {formatControls}
            {sequence && (
              <>
                <hr />
                <SequenceCompoenet>{sequence}</SequenceCompoenet>
              </>
            )}
            <hr />
            <div className='styles-control-context-item' style={{ marginTop: 0 }}>
              <div className='styles-control-context-item-content' style={{ marginTop: 0 }}>
                {preset}
              </div>
            </div>
          </div >
        </div>
      </div>
    )
  }
}

export default StylesControl;

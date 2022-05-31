import React from 'react';
import PopUp from 'components/common/PopUp';
import './ShortcutPopup.scss';
import { KeyboardShortcut } from 'lib/KeyboardShortcut';
import { IPopupProps } from 'containers/PopupContainer';
import { WithTranslation, withTranslation } from 'react-i18next';


function ShortcutPopup(props: IPopupProps & WithTranslation) {
  return (
    <PopUp title={props.t('Shortcut')} onCloseClick={props.onCloseClick}>
      <table>
        <colgroup>
          <col width='60%' />
          <col width='*' />
        </colgroup>
        <tbody>
          {KeyboardShortcut.map(item => (
            <tr key={item.id}>
              <td>{props.t(`KeyboardShortcut.${item.name}`)}</td>
              <td>{item.shortcut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PopUp>
  )
}

export default withTranslation('ShortcutPopup')(React.memo(ShortcutPopup));

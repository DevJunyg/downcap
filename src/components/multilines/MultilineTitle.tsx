import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

const titleStyle = { fontSize: '1.2rem',color: '#7d1ed8', margin: 0, padding: 0 };
const MultiLineTitle = React.memo<WithTranslation>(props => (
  <h3 style={titleStyle} dangerouslySetInnerHTML={{ __html: props.t('MultiLineEditTile_Title_Html') }}/>
));

export default withTranslation()(MultiLineTitle);
import React from 'react';
import LayoutBound from 'layouts/LayoutBound';
import VariableLengthVerticalLayout from 'layouts/VariableLengthVerticalLayout';
import SubtitleEditingArea from './SubtitleEditingArea';
import MultiLineEditingArea from './multilines/MultilineEditingArea';

interface IEditingTemplateMultiLineVersionProps {
  Content?: React.ReactNode,
  Options?: React.ReactNode
}

const EditingTemplateMultiLineVersion = React.memo<IEditingTemplateMultiLineVersionProps>(props => {
  return (
    <VariableLengthVerticalLayout Bound={LayoutBound} boundHeigth={20} heigth={'100%'} contentHeights={[0.935, 0.065]}>
      <SubtitleEditingArea Options={props.Options}>
        {props.Content}
      </SubtitleEditingArea>
      <MultiLineEditingArea />
    </VariableLengthVerticalLayout>
  )
})

export default EditingTemplateMultiLineVersion;
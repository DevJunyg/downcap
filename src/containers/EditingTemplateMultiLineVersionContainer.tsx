import EditingTemplateMultiLineVersion from 'components/EditingTemplateMultiLineVersion';
import React from 'react';
import PlayerContext from 'contexts/PlayerContext';

interface EditingTemplateMultiLineVersionContainerProps {
  Content?: React.ReactNode,
  Options?: React.ReactNode
}
class EditingTemplateMultiLineVersionContainer extends React.Component<EditingTemplateMultiLineVersionContainerProps>{
  static contextType = PlayerContext

  render() {
    return (
      <EditingTemplateMultiLineVersion
        Content={this.props.Content}
        Options={this.props.Options}
      />
    )
  }
}

export default EditingTemplateMultiLineVersionContainer;
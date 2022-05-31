import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import Group from '../Group';
import Item from '../Item';

interface IYoutubeMenu {
  selected?: boolean;
  videoUploadDisabled?: boolean;
  captionsUploadDisabled?: boolean;
  onTitleClick?: React.MouseEventHandler;
  onYouTubeVideoUploadClick?: React.MouseEventHandler;
  onYouTubeCaptionsUploadClick?: React.MouseEventHandler;
}

function YoutubeMenu(props: IYoutubeMenu) {
  const { t } = useTranslation();
  const title = <label>{t('YoutubeUpload')}</label>;
  return (
    <Group title={title} selected={props.selected} onClick={props.onTitleClick} >
      <Item onClick={props.onYouTubeVideoUploadClick} disabled={props.videoUploadDisabled} >
        <label>{t('YoutubeVideoUpload')}</label>
      </Item>
      <Item onClick={props.onYouTubeCaptionsUploadClick} disabled={props.captionsUploadDisabled}>
        <label>{t('YoutubeCaptionsUpload')}</label>
      </Item>
    </Group>
  );
}

export default YoutubeMenu;

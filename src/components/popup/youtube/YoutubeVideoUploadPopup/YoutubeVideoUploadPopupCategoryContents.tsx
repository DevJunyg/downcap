import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupCategoryContentsProps {
  onVideoCategoryId: (value: string) => void;
}

export default function YoutubeVideoUploadPopupCategoryContents(props: IYoutubeVideoUploadPopupCategoryContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupCategoryContents');

  return (
    <div className='category-contents'>
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="category-content">
        <select name="category-options" onChange={(e) => { props.onVideoCategoryId(e.target.value) }}>
          <option value="0">{t('category_1')}</option>
          <option value="1">{t('category_2')}</option>
          <option value="2">{t('category_3')}</option>
          <option value="3">{t('category_4')}</option>
          <option value="4">{t('category_5')}</option>
          <option value="5">{t('category_6')}</option>
          <option value="6">{t('category_7')}</option>
          <option value="7">{t('category_8')}</option>
          <option value="8">{t('category_9')}</option>
          <option value="9">{t('category_10')}</option>
          <option value="10">{t('category_11')}</option>
          <option value="11">{t('category_12')}</option>
          <option value="12">{t('category_13')}</option>
          <option value="13">{t('category_14')}</option>
          <option value="14">{t('category_15')}</option>
        </select>
      </div>
    </div>
  );
}
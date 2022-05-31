import FileOpenIcon from "components/icons/FileOpenIcon";
import { useTranslation } from "react-i18next";

interface IFileOpenArea {
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const style: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '35vh',
  width: '80%',
  border: '2px dashed #9A9A9A',
  boxSizing: 'border-box',
  borderRadius: '2px',
  margin: '0 auto'
}

function FileOpenArea(props: IFileOpenArea) {
  const { t } = useTranslation('FileOpenArea');
  return (
    <div className="text-center pointer no-drag" onClick={props.onClick} style={style}>
      <div>
        <div>
          <FileOpenIcon />
        </div>
        <div>
          <p>
            {t('localFile')}<br />
            {t('fileType')}<br />
            <b>{t('click')}</b> {t('or')} <b>{t('dragAndDrop')}</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FileOpenArea;
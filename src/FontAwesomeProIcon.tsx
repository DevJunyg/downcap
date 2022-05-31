import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export type FontAwesomeIconProStyle = React.CSSProperties & {
  "--fa-primary-color"?: string,
  "--fa-primary-opacity"?: number,
  "--fa-secondary-color"?: string,
  "--fa-secondary-opacity"?: number,
}

export interface FontAwesomeIconProProps extends FontAwesomeIconProps {
  style?: FontAwesomeIconProStyle
}

const FontAwesomeProIcon = (props: FontAwesomeIconProProps) => <FontAwesomeIcon {...props} />;

export default FontAwesomeProIcon;

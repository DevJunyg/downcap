import Guide, { GuideProperties } from '../Guide/Guide';

interface VerticalGuideProperties extends GuideProperties {
  height?: string,
}

function VerticalGuide(props: VerticalGuideProperties) {
  const { height, style, className, ...rest } = props;
  let gStyle = style ?? {};
  gStyle.height = height;

  return (
    <Guide className={`d-flex justify-content-space-between flex-column ${className}`} style={gStyle} {...rest} />
  )
}

const defaultProps: VerticalGuideProperties = {
  guideAmount: 5,
  height: "95px"
}

VerticalGuide.defaultProps = defaultProps;

export default VerticalGuide;
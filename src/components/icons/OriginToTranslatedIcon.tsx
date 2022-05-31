import IconPathHelper from "IconPathHelper";

function OriginToTranslatedIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, ...rest } = props;
  return <img src={IconPathHelper.koToEnIconPath} alt={"ko to en"} {...rest} />
}

export default OriginToTranslatedIcon;
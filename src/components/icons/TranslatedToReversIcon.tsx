import IconPathHelper from "IconPathHelper";

function TranslatedToReversIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, ...rest } = props;
  return <img src={IconPathHelper.enToKoIconPath} alt={"en to ko"} {...rest} />
}

export default TranslatedToReversIcon;
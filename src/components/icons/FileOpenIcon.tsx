import IconPathHelper from "IconPathHelper";

function FileOpenIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, ...rest } = props;
  return <img src={IconPathHelper.fileOpenIconPath} alt={"File open icon"} {...rest} />
}

export default FileOpenIcon;
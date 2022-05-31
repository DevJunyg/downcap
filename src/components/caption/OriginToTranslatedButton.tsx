import ClassNameHelper from "ClassNameHelper";
import OriginToTranslatedIcon from "components/icons/OriginToTranslatedIcon";
import React from "react";

function OriginToTranslatedButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  let { className, ...rest } = props

  className = ClassNameHelper.concat('translate-helper-button', className);

  return (
    <button className={className} {...rest}>
      <OriginToTranslatedIcon />
    </button>
  );
}

export default React.memo<React.HTMLAttributes<HTMLButtonElement>>(
  OriginToTranslatedButton,
  (prevProps, nextProps) => {
    return prevProps.className === nextProps.className
      && prevProps.onClick === nextProps.onClick;
  }
);
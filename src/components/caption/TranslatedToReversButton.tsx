import ClassNameHelper from "ClassNameHelper";
import TranslatedToReversIcon from "components/icons/TranslatedToReversIcon";
import React from "react";

function TranslatedToReversButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  let { className, ...rest } = props;

  className = ClassNameHelper.concat('translate-helper-button', className);

  return (
    <button className={className} {...rest}>
      <TranslatedToReversIcon />
    </button>
  );
}


export default React.memo<React.HTMLAttributes<HTMLButtonElement>>(
  TranslatedToReversButton,
  (prevProps, nextProps) => {
    return prevProps.className === nextProps.className
      && prevProps.onClick === nextProps.onClick;
  }
);
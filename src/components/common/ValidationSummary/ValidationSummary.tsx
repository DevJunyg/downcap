import IValidationSummary from "./IValidationSummary";

interface IValidationItem {
  content: JSX.Element | string
}

function ValidationItem(props: IValidationItem) {
  if (typeof props.content === "string") {
    return <label>{props.content}</label>;
  }

  return props.content;
}

function ValidationSummary(props: IValidationSummary) {
  const { validations, children, ...rest } = props
  if (!validations) {
    return null;
  }

  const validationItems = Array.isArray(validations) ? validations : [validations];
  const validationsJSX = validationItems?.map((item, index) => <ValidationItem key={index} content={item} />);
  return <div {...rest}>{validationsJSX}</div>;
}

export default ValidationSummary;
import ValidationItemType from "./ValidationItemType";

export default interface IValidationSummary extends React.HTMLAttributes<HTMLDivElement> {
  validations?: ValidationItemType
}
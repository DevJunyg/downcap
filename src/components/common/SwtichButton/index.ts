export { default } from "./SwtichButton";
export interface ISwtichButton {
  activated?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}
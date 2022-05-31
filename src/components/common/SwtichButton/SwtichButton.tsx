import { ISwtichButton } from '.';
import './SwtichButton.scss';

export default function SwtichButton(props: ISwtichButton) {
  const className = props.activated ? 'toggle-btn active' : 'toggle-btn';
  return (
    <div className={className} >
      <input type="checkbox" className="cb-value" checked={props.activated} onChange={props.onChange} />
      <span className="round-btn"></span>
    </div>
  )
}
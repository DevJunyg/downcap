export default function YoutubeVideoUploadPopupError(props: {err: string}) {
  return <div className="error-message">
    <label>* {props.err}</label>
  </div>
}
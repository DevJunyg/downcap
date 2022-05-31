import CycleSpin from 'components/common/CycleSpin';

const translatedPendingTextStyle = {
  display: 'inline',
  marginLeft: '1rem'
}

function TranlsatedPending() {
  return (
    <div className="d-flex justify-content-center" >
      <span>
        <CycleSpin fontSize="1rem" />
        <p style={translatedPendingTextStyle}>번역중 ...</p>
      </span>
    </div>
  )
}


export default TranlsatedPending;
import CaptionsLocations from "components/FomatControl/CaptionsLocations";
import LineLocations from "components/FomatControl/LineLocations";
import LineLocationHelper from "helpers/LineLocationHelper";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';

function LocationButtonsContainer() {
  const selectedStyleEditType = ReactRedux.useSelector<
    store.RootState, store.StyleEditType | undefined
  >(state => state.present.projectCotrol.selectedStyleEditType);

  const rootStore = ReactRedux.useStore<store.RootState>();

  const handleLineLocationDownButtonClick = () => LineLocationHelper.addLineLoaction('vertical', -0.01, rootStore);
  const handleLineLocationLeftButtonClick = () => LineLocationHelper.addLineLoaction('horizontal', -0.01, rootStore);
  const handleLineLocationRightButtonClick = () => LineLocationHelper.addLineLoaction('horizontal', 0.01, rootStore);
  const handleLineLocationUpButtonClick = () => LineLocationHelper.addLineLoaction('vertical', 0.01, rootStore);

  const disabled = selectedStyleEditType !== 'line';

  return (
    <div className='d-flex'>
      <CaptionsLocations
        disabled={disabled}
        onClick={handleResetLocationClick}
      />
      <LineLocations
        locationButtonDisabled={disabled}
        onDownButtonClick={handleLineLocationDownButtonClick}
        onLeftButtonClick={handleLineLocationLeftButtonClick}
        onRightButtonClick={handleLineLocationRightButtonClick}
        onUpButtonClick={handleLineLocationUpButtonClick}
      />
    </div>
  );

  function handleResetLocationClick() {
    LineLocationHelper.resetLocation(rootStore);
  }
}

export default LocationButtonsContainer;
import App from "components/App";
import { Provider } from "react-redux";
import store from "storeV2";
import 'styles/init.scss';
import 'styles/dimens.scss';
import i18n from "i18n";
import { I18nextProvider } from "react-i18next";

const dropCommandKeys = new Set(['KeyW', 'KeyR']);

function handleDocmentKeyDown(e) {
  if (e.ctrlKey && dropCommandKeys.has(e.code)) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}

// disabled key events
document.addEventListener('keydown', handleDocmentKeyDown)

const Root = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <div id="mydiv" className="app" >
        <App />
      </div>
    </Provider>
  </I18nextProvider>
)

export default Root;

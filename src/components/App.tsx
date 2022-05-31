import { HashRouter, Route, Switch } from 'react-router-dom';
import TitlebarConatainer from 'containers/TitlebarContainer';
import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import "styles/app.scss";
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

const LoginPage = React.lazy(() => import('pages/LoginPage'));
const EditorPage = React.lazy(() => import('pages/EditorPage'));

const theme = createTheme({
  overrides: {
    MuiSvgIcon: {
      root: {
        fontSize: '1.1rem'
      }
    },
    //@ts-ignore
    MuiToggleButton: {
      root: {
        '&$selected': {
          color: '#FFF',
          backgroundColor: '#7D1ED8',
        },
        padding: "0.1rem 0.2rem",
        color: '#000',
        background: '#FFFFFF',
        fontSize: '0.6rem'
      },
    }
  },
});

const App = () => {
  const { t } = useTranslation('translation');
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <TitlebarConatainer />
        <Suspense fallback={<div>{t('Loading_Pending_Comments')}</div>}>
          <Switch>
            <Route path="/editor" component={EditorPage} />
            <Route path="/" component={LoginPage} />
          </Switch>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
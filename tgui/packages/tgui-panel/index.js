/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

// Themes
import './styles/main.scss';
import './styles/themes/light.scss';

import { perf } from 'common/perf';
import { combineReducers } from 'common/redux';
import { setupHotReloading } from 'tgui-dev-server/link/client.cjs';
import { setupGlobalEvents } from 'tgui/events';
import { captureExternalLinks } from 'tgui/links';
import { createRenderer } from 'tgui/renderer';
import { configureStore, StoreProvider } from 'tgui/store';
import { audioMiddleware, audioReducer } from './audio';
import { chatMiddleware, chatReducer } from './chat';
import { gameMiddleware, gameReducer } from './game';
import { setupPanelFocusHacks } from './panelFocus';
import { pingMiddleware, pingReducer } from './ping';
import { settingsMiddleware, settingsReducer } from './settings';
import { statMiddleware, statReducer } from './stat';
import { telemetryMiddleware } from './telemetry';
import { KEY_F5, KEY_R } from 'common/keycodes';

perf.mark('inception', window.performance?.timing?.navigationStart);
perf.mark('init');

const store = configureStore({
  reducer: combineReducers({
    audio: audioReducer,
    chat: chatReducer,
    game: gameReducer,
    ping: pingReducer,
    settings: settingsReducer,
    stat: statReducer,
  }),
  middleware: {
    pre: [
      chatMiddleware,
      pingMiddleware,
      telemetryMiddleware,
      settingsMiddleware,
      audioMiddleware,
      gameMiddleware,
      statMiddleware,
    ],
  },
});

const renderApp = createRenderer(() => {
  const { Panel } = require('./Panel');
  return (
    <StoreProvider store={store}>
      <Panel />
    </StoreProvider>
  );
});

const setupApp = () => {
  // Delay setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
    return;
  }

  setupGlobalEvents({
    ignoreWindowFocus: true,
  });
  setupPanelFocusHacks();
  captureExternalLinks();

  // Prevent refreshing
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === KEY_F5 || event.keyCode === KEY_R) {
      event.preventDefault();
    }
  });

  // Subscribe for Redux state updates
  store.subscribe(renderApp);

  // Subscribe for bankend updates
  window.update = msg => store.dispatch(Byond.parseJson(msg));

  // Process the early update queue
  while (true) {
    const msg = window.__updateQueue__.shift();
    if (!msg) {
      break;
    }
    window.update(msg);
  }

  // Unhide the panel
  Byond.winset('output', {
    'is-visible': false,
  });
  Byond.winset('browseroutput', {
    'is-visible': true,
    'is-disabled': false,
    'pos': '0x0',
    'size': '0x0',
  });

  based_winset();

  // Enable hot module reloading
  if (module.hot) {
    setupHotReloading();
    module.hot.accept([
      './audio',
      './chat',
      './game',
      './Notifications',
      './Panel',
      './ping',
      './settings',
      './stat',
      './telemetry',
    ], () => {
      renderApp();
    });
  }
};

const based_winset = async (based_on_what = 'output') => {
  const winget_output = await Byond.winget(based_on_what);
  Byond.winset('browseroutput', {
    'size': winget_output["size"],
  });
};

setupApp();

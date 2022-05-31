const { shell, systemPreferences } = require('electron');
Object.defineProperty(exports, "__esModule", {
  value: true
});

const isMac = process.platform === 'darwin';
const baseURL = process.env.API_URL ?? 'https://downcap.net';

if (isMac) {
  systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
  systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);
}

/**
 * 
 * @param {object} app 
 * @param {string} app.name
 * @param {import('i18next').i18n} [i18n]
 * @returns {Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)>}
 */
function createMenu(app, i18n) {
  return [
    {
      label: app.name,
      submenu: [
        {
          label: `${app.name} ${i18n.t('electronMenu_infomation')}`,
          role: 'about'
        }, {
          type: 'separator'
        }, {
          label: i18n.t('electronMenu_Service'),
          role: 'services'
        }, {
          type: 'separator'
        }, {
          label: `${app.name} ${i18n.t('electronMenu_Hide')}`,
          role: 'hide'
        }, {
          label: i18n.t('electronMenu_Hide_Other'),
          role: 'hideothers'
        }, {
          label: i18n.t('electronMenu_Show_All'),
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          label: i18n.t('electronMenu_Exit'),
          role: 'quit'
        }
      ]
    },
    {
      label: i18n.t('electronMenu_File'),
      submenu: [
        {
          label: i18n.t('electronMenu_Close_Window'),
          role: 'close'
        }
      ]
    },
    {
      label: i18n.t('electronMenu_Edit'),
      submenu: [
        {
          label: i18n.t('electronMenu_Undo'),
          role: 'undo'
        }, {
          label: i18n.t('electronMenu_Redo'),
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          label: i18n.t('electronMenu_Cut'),
          role: 'cut'
        }, {
          label: i18n.t('electronMenu_Copy'),
          role: 'copy'
        }, {
          label: i18n.t('electronMenu_Paste'),
          role: 'paste'
        },
        ...(isMac ? [
          {
            label: i18n.t('electronMenu_Paste_And_Match_Styles'),
            role: 'pasteAndMatchStyle'
          }, {
            label: i18n.t('electronMenu_Delete'),
            role: 'delete'
          }, {
            label: i18n.t('electronMenu_Select_All'),
            role: 'selectAll'
          }, {
            type: 'separator'
          }, {
            label: i18n.t('electronMenu_Speak'),
            submenu: [
              {
                label: i18n.t('electronMenu_Start_Speaking'),
                role: 'startSpeaking'
              }, {
                label: i18n.t('electronMenu_Stop_Speaking'),
                role: 'stopSpeaking'
              }
            ]
          }
        ] : [
          {
            label: i18n.t('electronMenu_Delete'),
            role: 'delete'
          }, {
            type: 'separator'
          }, {
            label: i18n.t('electronMenu_Select_All'),
            role: 'selectAll'
          }
        ])
      ]
    },
    {
      label: i18n.t('electronMenu_View'),
      submenu: [
        {
          label: i18n.t('electronMenu_Reload'),
          role: 'reload'
        }, {
          label: i18n.t('electronMenu_Force_Reload'),
          role: 'forceReload'
        }, {
          role: 'toggleDevTools'
        }, {
          type: 'separator'
        }, {
          label: i18n.t('electronMenu_Default_Size'),
          role: 'resetZoom'
        }, {
          label: i18n.t('electronMenu_Zoom_In'),
          role: 'zoomIn'
        }, {
          label: i18n.t('electronMenu_Collapse'),
          role: 'zoomOut'
        }, {
          type: 'separator'
        }, {
          label: i18n.t('electronMenu_Full_Screen'),
          role: 'togglefullscreen'
        }
      ]
    },
    {
      label: i18n.t('electronMenu_Window'),
      submenu: [
        {
          label: i18n.t('electronMenu_Minimize'),
          role: 'minimize'
        }, {
          label: i18n.t('electronMenu_Zoom_In_Or_Collapse'),
          role: 'zoom'
        },
        ...(isMac ? [{
          type: 'separator'
        }, {
          label: i18n.t('electronMenu_Bring_All_Forward'),
          role: 'front'
        }
        ] : [{
          label: i18n.t('electronMenu_Close'),
          role: 'close'
        }
        ])
      ]
    },
    {
      label: i18n.t('electronMenu_Help'),
      role: 'help',
      submenu: [
        {
          label: `${app.name} ${i18n.t('electronMenu_Help')}`,
          click: () => shell.openExternal(`${baseURL}/pdf/service-introduction.pdf`)
        },
        {
          label: i18n.t('electronMenu_Customer_Support'),
          click: () => shell.openExternal(`${baseURL}/Support`)
        }
      ]
    }
  ]
}

exports.default = createMenu;
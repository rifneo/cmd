/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreManager = require('./core/Manager');

var _coreManager2 = _interopRequireDefault(_coreManager);

var _corePluginsList = require('./core/PluginsList');

var _corePluginsList2 = _interopRequireDefault(_corePluginsList);

var _corePluginEditor = require('./core/PluginEditor');

var _corePluginEditor2 = _interopRequireDefault(_corePluginEditor);

var _coreCoreAndPluginsDashboard = require('./core/CoreAndPluginsDashboard');

var _coreCoreAndPluginsDashboard2 = _interopRequireDefault(_coreCoreAndPluginsDashboard);

var _authAuthenticationPluginsDashboard = require('./auth/AuthenticationPluginsDashboard');

var _authAuthenticationPluginsDashboard2 = _interopRequireDefault(_authAuthenticationPluginsDashboard);

var _editorsEditorsDashboard = require('./editors/EditorsDashboard');

var _editorsEditorsDashboard2 = _interopRequireDefault(_editorsEditorsDashboard);

var _updaterUpdaterDashboard = require('./updater/UpdaterDashboard');

var _updaterUpdaterDashboard2 = _interopRequireDefault(_updaterUpdaterDashboard);

var _cacheCacheServerDashboard = require('./cache/CacheServerDashboard');

var _cacheCacheServerDashboard2 = _interopRequireDefault(_cacheCacheServerDashboard);

var _diagnosticDiagnosticDashboard = require('./diagnostic/DiagnosticDashboard');

var _diagnosticDiagnosticDashboard2 = _interopRequireDefault(_diagnosticDiagnosticDashboard);

var _docsJSDocsDashboard = require('./docs/JSDocsDashboard');

var _docsJSDocsDashboard2 = _interopRequireDefault(_docsJSDocsDashboard);

window.AdminPlugins = {

  PluginsManager: _coreManager2['default'],
  PluginEditor: _corePluginEditor2['default'],
  PluginsList: _corePluginsList2['default'],
  CoreAndPluginsDashboard: _coreCoreAndPluginsDashboard2['default'],

  AuthenticationPluginsDashboard: _authAuthenticationPluginsDashboard2['default'],
  EditorsDashboard: _editorsEditorsDashboard2['default'],
  UpdaterDashboard: _updaterUpdaterDashboard2['default'],
  CacheServerDashboard: _cacheCacheServerDashboard2['default'],
  DiagnosticDashboard: _diagnosticDiagnosticDashboard2['default'],
  JSDocsDashboard: _docsJSDocsDashboard2['default']

};

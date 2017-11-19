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

import PluginsManager from './core/Manager'
import PluginsList from './core/PluginsList'
import PluginEditor from './core/PluginEditor'
import CoreAndPluginsDashboard from './core/CoreAndPluginsDashboard'

import AuthenticationPluginsDashboard from './auth/AuthenticationPluginsDashboard'
import EditorsDashboard from './editors/EditorsDashboard'
import UpdaterDashboard from './updater/UpdaterDashboard'
import CacheServerDashboard from './cache/CacheServerDashboard'
import DiagnosticDashboard from './diagnostic/DiagnosticDashboard'
import JSDocsDashboard from './docs/JSDocsDashboard'

window.AdminPlugins = {

    PluginsManager                  : PluginsManager,
    PluginEditor                    : PluginEditor,
    PluginsList                     : PluginsList,
    CoreAndPluginsDashboard         : CoreAndPluginsDashboard,

    AuthenticationPluginsDashboard  : AuthenticationPluginsDashboard,
    EditorsDashboard                : EditorsDashboard,
    UpdaterDashboard                : UpdaterDashboard,
    CacheServerDashboard            : CacheServerDashboard,
    DiagnosticDashboard             : DiagnosticDashboard,
    JSDocsDashboard                 : JSDocsDashboard

};

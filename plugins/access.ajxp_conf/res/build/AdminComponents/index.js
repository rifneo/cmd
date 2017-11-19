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

var _boardAdminDashboard = require('./board/AdminDashboard');

var _boardAdminDashboard2 = _interopRequireDefault(_boardAdminDashboard);

var _boardSimpleDashboard = require('./board/SimpleDashboard');

var _boardSimpleDashboard2 = _interopRequireDefault(_boardSimpleDashboard);

var _boardGroupAdminDashboard = require('./board/GroupAdminDashboard');

var _boardGroupAdminDashboard2 = _interopRequireDefault(_boardGroupAdminDashboard);

var _utilMixins = require('./util/Mixins');

var _utilNavigationHelper = require('./util/NavigationHelper');

var _utilNavigationHelper2 = _interopRequireDefault(_utilNavigationHelper);

var _utilMenuItemListener = require('./util/MenuItemListener');

var _utilMenuItemListener2 = _interopRequireDefault(_utilMenuItemListener);

var _utilDNDActionsManager = require('./util/DNDActionsManager');

var _utilDNDActionsManager2 = _interopRequireDefault(_utilDNDActionsManager);

window.AdminComponents = {
  MessagesConsumerMixin: _utilMixins.MessagesConsumerMixin,
  PydioConsumerMixin: _utilMixins.PydioConsumerMixin,
  NavigationHelper: _utilNavigationHelper2['default'],
  MenuItemListener: _utilMenuItemListener2['default'],
  DNDActionsManager: _utilDNDActionsManager2['default'],

  AdminDashboard: _boardAdminDashboard2['default'],
  SimpleDashboard: _boardSimpleDashboard2['default'],
  GroupAdminDashboard: _boardGroupAdminDashboard2['default']
};

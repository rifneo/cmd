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

Object.defineProperty(exports, '__esModule', {
    value: true
});
var PydioApi = require('pydio/http/api');

exports['default'] = function (pydio) {

    return function () {
        var _callback = function _callback(node, newValue) {
            if (!node) node = pydio.getUserSelection().getUniqueNode();
            PydioApi.getClient().request({
                get_action: 'rename',
                file: node.getPath(),
                filename_new: newValue
            });
        };
        var n = pydio.getUserSelection().getSelectedNodes()[0];
        if (n) {
            var res = n.notify("node_action", { type: "prompt-rename", callback: function callback(value) {
                    _callback(n, value);
                } });
            if ((!res || res[0] !== true) && n.getParent()) {
                n.getParent().notify("child_node_action", { type: "prompt-rename", child: n, callback: function callback(value) {
                        _callback(n, value);
                    } });
            }
        }
    };
};

module.exports = exports['default'];

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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var configs = pydio.getPluginConfigs("editor.libreoffice");
var _PydioHOCs = PydioHOCs;
var withMenu = _PydioHOCs.withMenu;
var withLoader = _PydioHOCs.withLoader;
var withErrors = _PydioHOCs.withErrors;
var withControls = _PydioHOCs.withControls;

var Viewer = (0, _redux.compose)(withMenu, withLoader, withErrors)(function (_ref) {
    var url = _ref.url;
    var style = _ref.style;
    return _react2['default'].createElement('iframe', { src: url, style: _extends({}, style, { width: "100%", height: "100%", border: 0, flex: 1 }) });
});

var Editor = (function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor(props) {
        _classCallCheck(this, Editor);

        _get(Object.getPrototypeOf(Editor.prototype), 'constructor', this).call(this, props);

        this.state = {};
    }

    _createClass(Editor, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this = this;

            var iframeUrl = configs.get('LIBREOFFICE_IFRAME_URL'),
                webSocketSecure = configs.get('LIBREOFFICE_WEBSOCKET_SECURE'),
                webSocketHost = configs.get('LIBREOFFICE_WEBSOCKET_HOST'),
                webSocketPort = configs.get('LIBREOFFICE_WEBSOCKET_PORT');

            var webSocketProtocol = webSocketSecure ? 'wss' : 'ws',
                webSocketUrl = encodeURIComponent(webSocketProtocol + '://' + webSocketHost + ':' + webSocketPort);

            var fileName = this.props.node.getPath();
            pydio.ApiClient.request({
                get_action: 'libreoffice_get_file_url',
                file: fileName
            }, function (_ref2) {
                var _ref2$responseJSON = _ref2.responseJSON;
                var responseJSON = _ref2$responseJSON === undefined ? {} : _ref2$responseJSON;
                var host = responseJSON.host;
                var uri = responseJSON.uri;
                var permission = responseJSON.permission;
                var jwt = responseJSON.jwt;

                var fileSrcUrl = encodeURIComponent('' + host + uri);
                _this.setState({ url: iframeUrl + '?host=' + webSocketUrl + '&WOPISrc=' + fileSrcUrl + '&access_token=' + jwt + '&permisson=' + permission });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(Viewer, _extends({}, this.props, { url: this.state.url }));
        }
    }]);

    return Editor;
})(_react2['default'].Component);

exports['default'] = Editor;
module.exports = exports['default'];

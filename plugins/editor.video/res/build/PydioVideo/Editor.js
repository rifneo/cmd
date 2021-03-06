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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var Viewer = (function (_React$Component) {
    _inherits(Viewer, _React$Component);

    function Viewer() {
        _classCallCheck(this, Viewer);

        _get(Object.getPrototypeOf(Viewer.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Viewer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.loadNode(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.node !== this.props.node) {
                this.loadNode(nextProps);
            }
        }
    }, {
        key: 'loadNode',
        value: function loadNode(props) {
            var _this = this;

            var pydio = props.pydio;
            var node = props.node;

            this.getSessionId().then(function (sessionId) {
                return _this.setState({
                    url: pydio.Parameters.get('ajxpServerAccess') + '&ajxp_sessid=' + sessionId + '&get_action=read_video_data&file=' + encodeURIComponent(node.getPath())
                });
            });
        }

        // Util functions
    }, {
        key: 'getSessionId',
        value: function getSessionId() {
            var pydio = this.props.pydio;

            return new Promise(function (resolve, reject) {
                pydio.ApiClient.request({
                    get_action: 'get_sess_id'
                }, function (transport) {
                    resolve(transport.responseText);
                });
            });
        }

        // Plugin Main Editor rendering
    }, {
        key: 'render',
        value: function render() {
            var _ref = this.state || {};

            var url = _ref.url;

            // Only display the video when we know the URL
            var editor = url ? _react2['default'].createElement(_Player2['default'], { url: url }) : null;

            return _react2['default'].createElement(
                'div',
                { style: Viewer.styles.container },
                editor
            );
        }
    }], [{
        key: 'styles',
        get: function get() {
            return {
                container: {
                    maxWidth: "100%",
                    minHeight: 120,
                    padding: 0,
                    width: "100%",
                    flex: 1,
                    display: 'flex',
                    alignItems: 'stretch'
                }
            };
        }
    }, {
        key: 'propTypes',
        get: function get() {
            return {
                node: _react2['default'].PropTypes.instanceOf(AjxpNode).isRequired,
                pydio: _react2['default'].PropTypes.instanceOf(Pydio).isRequired,

                preview: _react2['default'].PropTypes.bool.isRequired
            };
        }
    }, {
        key: 'defaultProps',
        get: function get() {
            return {
                preview: false
            };
        }
    }]);

    return Viewer;
})(_react2['default'].Component);

var _PydioHOCs = PydioHOCs;
var withSelection = _PydioHOCs.withSelection;

var editors = pydio.Registry.getActiveExtensionByType("editor");
var conf = editors.filter(function (_ref2) {
    var id = _ref2.id;
    return id === 'editor.video';
})[0];

var getSelectionFilter = function getSelectionFilter(node) {
    return conf.mimes.indexOf(node.getAjxpMime()) > -1;
};

var getSelection = function getSelection(node) {
    return new Promise(function (resolve, reject) {
        var selection = [];

        node.getParent().getChildren().forEach(function (child) {
            return selection.push(child);
        });
        selection = selection.filter(getSelectionFilter);

        resolve({
            selection: selection,
            currentIndex: selection.reduce(function (currentIndex, current, index) {
                return current === node && index || currentIndex;
            }, 0)
        });
    });
};

var Panel = Viewer;

exports.Panel = Panel;
var Editor = (0, _redux.compose)(withSelection(getSelection), (0, _reactRedux.connect)())(Viewer);
exports.Editor = Editor;

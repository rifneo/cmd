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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _materialUi = require('material-ui');

var _PydioHOCs = PydioHOCs;
var withSelection = _PydioHOCs.withSelection;

var Editor = (function (_Component) {
    _inherits(Editor, _Component);

    function Editor(props) {
        _classCallCheck(this, Editor);

        _get(Object.getPrototypeOf(Editor.prototype), 'constructor', this).call(this, props);

        this.state = {
            data: [],
            error: ""
        };
    }

    _createClass(Editor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.loadNodeContent(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.node !== this.props.node) {
                this.loadNodeContent(nextProps);
            }
        }
    }, {
        key: 'loadNodeContent',
        value: function loadNodeContent(props) {
            var _this = this;

            var node = props.node;

            var callback = function callback(object) {
                _this.setState(object);
                typeof _this.props.onLoad === 'function' && _this.props.onLoad();
            };

            PydioApi.getClient().request({
                get_action: 'extract_exif',
                file: node.getPath(),
                format: 'json'
            }, function (_ref) {
                var responseJSON = _ref.responseJSON;
                return responseJSON ? callback({ data: responseJSON }) : callback({ error: 'Could not load JSON' });
            }, function () {
                return callback({ error: 'Could not load data' });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var content = undefined;

            var showControls = this.props.showControls;
            var _state = this.state;
            var data = _state.data;
            var error = _state.error;

            return _react2['default'].createElement(
                Viewer,
                _extends({}, this.props, {
                    onLocate: showControls ? function () {
                        return _this2.openGpsLocator();
                    } : null,
                    error: error,
                    style: { display: "flex", justifyContent: "space-around", flexFlow: "row wrap" }
                }),
                Object.keys(data).map(function (key) {
                    return _react2['default'].createElement(
                        _materialUi.Card,
                        { style: { width: "calc(50% - 20px)", margin: 10, overflow: "auto" } },
                        _react2['default'].createElement(
                            _materialUi.CardTitle,
                            { key: key + '-head' },
                            key
                        ),
                        _react2['default'].createElement(
                            _materialUi.CardText,
                            null,
                            _react2['default'].createElement(
                                _materialUi.Table,
                                { selectable: false },
                                _react2['default'].createElement(
                                    _materialUi.TableBody,
                                    { displayRowCheckbox: false },
                                    Object.keys(data[key]).map(function (itemKey) {
                                        return _react2['default'].createElement(
                                            _materialUi.TableRow,
                                            { key: key + '-' + itemKey },
                                            _react2['default'].createElement(
                                                _materialUi.TableRowColumn,
                                                null,
                                                itemKey
                                            ),
                                            _react2['default'].createElement(
                                                _materialUi.TableRowColumn,
                                                null,
                                                data[key][itemKey]
                                            )
                                        );
                                    })
                                )
                            )
                        )
                    );
                })
            );
        }
    }], [{
        key: 'controls',
        get: function get() {
            return {
                options: {
                    locate: function locate(handler) {
                        return _react2['default'].createElement(_materialUi.IconButton, { onClick: handler, iconClassName: 'mdi mdi-crosshairs-gps', tooltip: "Locate on a map" });
                    }
                }
            };
        }
    }]);

    return Editor;
})(_react.Component);

var _PydioHOCs2 = PydioHOCs;
var withMenu = _PydioHOCs2.withMenu;
var withLoader = _PydioHOCs2.withLoader;
var withErrors = _PydioHOCs2.withErrors;
var withControls = _PydioHOCs2.withControls;

var Viewer = (0, _redux.compose)(withMenu, withLoader, withErrors)(function (props) {
    return _react2['default'].createElement('div', props);
});

var getSelectionFilter = function getSelectionFilter(node) {
    return node.getMetadata().get('is_image') === '1';
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

exports['default'] = (0, _redux.compose)(withSelection(getSelection), (0, _reactRedux.connect)())(Editor);
module.exports = exports['default'];

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

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _materialUi = require('material-ui');

var _materialUiStyles = require('material-ui/styles');

var _pydioModelDataModel = require('pydio/model/data-model');

var _pydioModelDataModel2 = _interopRequireDefault(_pydioModelDataModel);

var _pydioUtilLang = require('pydio/util/lang');

var _pydioUtilLang2 = _interopRequireDefault(_pydioUtilLang);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Pydio$requireLib = _pydio2['default'].requireLib('components');

var NodeListCustomProvider = _Pydio$requireLib.NodeListCustomProvider;
var SimpleList = _Pydio$requireLib.SimpleList;

var _Pydio$requireLib2 = _pydio2['default'].requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib2.PydioContextConsumer;

var _Pydio$requireLib3 = _pydio2['default'].requireLib('workspaces');

var FilePreview = _Pydio$requireLib3.FilePreview;

var HomeSearchForm = (function (_Component) {
    _inherits(HomeSearchForm, _Component);

    function HomeSearchForm(props) {
        _classCallCheck(this, HomeSearchForm);

        _get(Object.getPrototypeOf(HomeSearchForm.prototype), 'constructor', this).call(this, props);

        // Create Fake DM
        this.basicDataModel = new _pydioModelDataModel2['default'](true);
        var rNodeProvider = new EmptyNodeProvider();
        this.basicDataModel.setAjxpNodeProvider(rNodeProvider);
        var rootNode = new AjxpNode("/", false, '', '', rNodeProvider);
        this.basicDataModel.setRootNode(rootNode);

        this.state = {
            queryString: '',
            dataModel: this.basicDataModel,
            empty: true,
            loading: false
        };

        this.submit = _lodash2['default'].debounce(this.submit, 500);
    }

    _createClass(HomeSearchForm, [{
        key: 'update',
        value: function update(queryString) {
            var _this = this;

            this.setState({ queryString: queryString }, function () {
                _this.submit();
            });
        }
    }, {
        key: 'submit',
        value: function submit() {
            var _this2 = this;

            var forceValue = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
            var queryString = this.state.queryString;

            if (forceValue) queryString = forceValue;
            if (!queryString) {
                this.setState({ empty: true, dataModel: this.basicDataModel });
                return;
            }
            // Refresh data model
            var dmParams = {
                get_action: 'multisearch',
                query: queryString,
                limit: this.props.limit || 5,
                connexion_discrete: true
            };
            var newDM = _pydioModelDataModel2['default'].RemoteDataModelFactory(dmParams);
            newDM.getRootNode().observeOnce("loaded", function () {
                _this2.setState({ loading: false });
            });
            this.setState({
                loading: true,
                dataModel: newDM,
                empty: false
            }, function () {
                _this2.refs.results.reload();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state = this.state;
            var loading = _state.loading;
            var dataModel = _state.dataModel;
            var empty = _state.empty;
            var queryString = _state.queryString;
            var _props = this.props;
            var style = _props.style;
            var zDepth = _props.zDepth;
            var pydio = _props.pydio;
            var muiTheme = _props.muiTheme;

            var hintText = pydio.MessageHash[607];
            var accent2Color = muiTheme.palette.accent2Color;
            var whiteTransp = 'rgba(255,255,255,.63)';
            var white = 'rgb(255,255,255)';

            var styles = {
                textFieldContainer: {
                    display: 'flex',
                    backgroundColor: accent2Color,
                    height: 55,
                    padding: '4px 8px'
                },
                textField: { flex: 1 },
                textInput: { color: white },
                textHint: { color: whiteTransp },
                magnifier: { color: whiteTransp, fontSize: 20, padding: '14px 8px' },
                close: { color: whiteTransp, fontSize: 20, padding: '14px 8px', cursor: 'pointer' }
            };

            var renderIcon = function renderIcon(node) {
                var entryProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                return React.createElement(FilePreview, { loadThumbnail: !entryProps['parentIsScrolling'], node: node });
            };
            var renderSecondLine = function renderSecondLine(node) {
                var path = node.getPath();
                return React.createElement(
                    'div',
                    null,
                    path
                );
            };
            var renderGroupHeader = function renderGroupHeader(repoId, repoLabel) {
                return React.createElement(
                    'div',
                    { style: { fontSize: 13, color: '#93a8b2', fontWeight: 500, cursor: 'pointer' }, onClick: function () {
                            return pydio.triggerRepositoryChange(repoId);
                        } },
                    repoLabel
                );
            };

            return React.createElement(
                _materialUi.Paper,
                { style: style, zDepth: zDepth, className: 'vertical-layout home-center-paper' },
                React.createElement(
                    'div',
                    { style: styles.textFieldContainer, className: 'home-search-form' },
                    React.createElement(_materialUi.FontIcon, { className: 'mdi mdi-magnify', style: styles.magnifier }),
                    React.createElement(_materialUi.TextField, {
                        ref: function (input) {
                            return _this3.input = input;
                        },
                        style: styles.textField,
                        inputStyle: styles.textInput,
                        hintStyle: styles.textHint,
                        fullWidth: true,
                        underlineShow: false,
                        hintText: hintText,
                        value: queryString,
                        onChange: function (e, v) {
                            return _this3.update(v);
                        },
                        onKeyPress: function (e) {
                            return e.key === 'Enter' ? _this3.update(e.target.value) : null;
                        }
                    }),
                    loading && React.createElement(
                        'div',
                        { style: { marginTop: 14, marginRight: 8 } },
                        React.createElement(_materialUi.CircularProgress, { size: 20, thickness: 3 })
                    ),
                    queryString && !loading && React.createElement(_materialUi.FontIcon, { className: 'mdi mdi-close', style: styles.close, onTouchTap: function () {
                            return _this3.update('');
                        } })
                ),
                !empty && React.createElement(PydioComponents.NodeListCustomProvider, {
                    ref: 'results',
                    className: 'files-list vertical_fit',
                    elementHeight: SimpleList.HEIGHT_TWO_LINES,
                    entryRenderIcon: renderIcon,
                    entryRenderActions: function () {
                        return null;
                    },
                    entryRenderSecondLine: renderSecondLine,
                    entryRenderGroupHeader: renderGroupHeader,
                    presetDataModel: dataModel,
                    openCollection: function (node) {
                        pydio.goTo(node);
                    },
                    nodeClicked: function (node) {
                        pydio.goTo(node);
                    },
                    defaultGroupBy: 'repository_id',
                    groupByLabel: 'repository_display',
                    emptyStateProps: {
                        iconClassName: "",
                        primaryTextId: 478,
                        style: { backgroundColor: 'transparent' }
                    }
                }),
                empty && this.props.children
            );
        }
    }]);

    return HomeSearchForm;
})(_react.Component);

exports['default'] = HomeSearchForm = PydioContextConsumer(HomeSearchForm);
exports['default'] = HomeSearchForm = (0, _materialUiStyles.muiThemeable)()(HomeSearchForm);
exports['default'] = HomeSearchForm;
module.exports = exports['default'];

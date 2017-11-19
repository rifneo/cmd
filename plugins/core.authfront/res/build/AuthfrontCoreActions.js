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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (global) {
    var _MaterialUI$Style = MaterialUI.Style;
    var muiThemeable = _MaterialUI$Style.muiThemeable;
    var getMuiTheme = _MaterialUI$Style.getMuiTheme;
    var darkBaseTheme = _MaterialUI$Style.darkBaseTheme;
    var _MaterialUI = MaterialUI;
    var TextField = _MaterialUI.TextField;
    var MuiThemeProvider = _MaterialUI.MuiThemeProvider;
    var FlatButton = _MaterialUI.FlatButton;
    var Checkbox = _MaterialUI.Checkbox;
    var FontIcon = _MaterialUI.FontIcon;
    var MenuItem = _MaterialUI.MenuItem;
    var SelectField = _MaterialUI.SelectField;
    var IconButton = _MaterialUI.IconButton;
    var IconMenu = _MaterialUI.IconMenu;
    var Toggle = _MaterialUI.Toggle;

    var pydio = global.pydio;

    var LoginDialogMixin = {

        getInitialState: function getInitialState() {
            return {
                globalParameters: pydio.Parameters,
                authParameters: pydio.getPluginConfigs('auth'),
                errorId: null,
                displayCaptcha: false
            };
        },

        postLoginData: function postLoginData(client) {

            var passwordOnly = this.state.globalParameters.get('PASSWORD_AUTH_ONLY');
            var login = undefined;
            if (passwordOnly) {
                login = this.state.globalParameters.get('PRESET_LOGIN');
            } else {
                login = this.refs.login.getValue();
            }
            var params = {
                get_action: 'login',
                userid: login,
                password: this.refs.password.getValue(),
                login_seed: -1
            };
            if (this.refs.captcha_input) {
                params['captcha_code'] = this.refs.captcha_input.getValue();
            }
            if (this.state && this.state.rememberChecked) {
                params['remember_me'] = 'true';
            }
            if (this.props.modifiers) {
                this.props.modifiers.map((function (m) {
                    m.enrichSubmitParameters(this.props, this.state, this.refs, params);
                }).bind(this));
            }
            client.request(params, (function (responseObject) {
                var success = client.parseXmlMessage(responseObject.responseXML);
                if (success) {
                    this.dismiss();
                } else {
                    var errorId = PydioApi.getClient().LAST_ERROR_ID;
                    if (errorId == '285' && passwordOnly) {
                        errorId = '553';
                    }
                    this.setState({ errorId: errorId });
                    if (responseObject.responseXML && XMLUtils.XPathGetSingleNodeText(responseObject.responseXML.documentElement, "logging_result/@value") === '-4') {
                        this.setState({ displayCaptcha: true });
                    }
                }
            }).bind(this));
        }
    };

    var LoginPasswordDialog = React.createClass({
        displayName: 'LoginPasswordDialog',

        mixins: [PydioReactUI.ActionDialogMixin, PydioReactUI.SubmitButtonProviderMixin, LoginDialogMixin],

        getDefaultProps: function getDefaultProps() {
            return {
                dialogTitle: '', //pydio.MessageHash[163],
                dialogIsModal: true,
                dialogSize: 'sm'
            };
        },

        getInitialState: function getInitialState() {
            return { rememberChecked: false };
        },

        componentWillReceiveProps: function componentWillReceiveProps() {
            this.setState({ displayCaptcha: false });
            PydioApi.getClient().request({ get_action: "get_seed" }, (function (transport) {
                if (transport.responseJSON) this.setState({ displayCaptcha: true });
            }).bind(this));
        },

        submit: function submit() {
            var client = PydioApi.getClient();
            this.postLoginData(client);
        },

        fireForgotPassword: function fireForgotPassword(e) {
            e.stopPropagation();
            pydio.getController().fireAction(this.state.authParameters.get("FORGOT_PASSWORD_ACTION"));
        },

        useBlur: function useBlur() {
            return true;
        },

        getButtons: function getButtons() {
            var _this = this;

            var passwordOnly = this.state.globalParameters.get('PASSWORD_AUTH_ONLY');
            var secureLoginForm = passwordOnly || this.state.authParameters.get('SECURE_LOGIN_FORM');

            var enterButton = React.createElement(FlatButton, { id: 'dialog-login-submit', 'default': true, labelStyle: { color: 'white' }, key: 'enter', label: pydio.MessageHash[617], onTouchTap: function () {
                    return _this.submit();
                } });
            var buttons = [];
            if (!secureLoginForm) {
                buttons.push(React.createElement(
                    DarkThemeContainer,
                    { key: 'remember', style: { flex: 1, textAlign: 'left', paddingLeft: 16 } },
                    React.createElement(Checkbox, { label: pydio.MessageHash[261], labelStyle: { fontSize: 13 }, onCheck: function (e, c) {
                            _this.setState({ rememberChecked: c });
                        } })
                ));
                buttons.push(enterButton);
                return [React.createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center' } },
                    buttons
                )];
            } else {
                return [enterButton];
            }
        },

        render: function render() {
            var _this2 = this;

            var passwordOnly = this.state.globalParameters.get('PASSWORD_AUTH_ONLY');
            var secureLoginForm = passwordOnly || this.state.authParameters.get('SECURE_LOGIN_FORM');
            var forgotPasswordLink = this.state.authParameters.get('ENABLE_FORGOT_PASSWORD') && !passwordOnly;

            var errorMessage = undefined;
            if (this.state.errorId) {
                errorMessage = React.createElement(
                    'div',
                    { className: 'ajxp_login_error' },
                    pydio.MessageHash[this.state.errorId]
                );
            }
            var captcha = undefined;
            if (this.state.displayCaptcha) {
                captcha = React.createElement(
                    'div',
                    { className: 'captcha_container' },
                    React.createElement(TextField, { style: { width: 170, marginTop: -20 }, hintText: pydio.MessageHash[390], ref: 'captcha_input', onKeyDown: this.submitOnEnterKey }),
                    React.createElement('img', { src: this.state.globalParameters.get('ajxpServerAccess') + '&get_action=get_captcha&sid=' + Math.random() })
                );
            }
            var forgotLink = undefined;
            if (forgotPasswordLink) {
                forgotLink = React.createElement(
                    'div',
                    { className: 'forgot-password-link' },
                    React.createElement(
                        'a',
                        { style: { cursor: 'pointer' }, onClick: this.fireForgotPassword },
                        pydio.MessageHash[479]
                    )
                );
            }
            var additionalComponentsTop = undefined,
                additionalComponentsBottom = undefined;
            if (this.props.modifiers) {
                (function () {
                    var comps = { top: [], bottom: [] };
                    _this2.props.modifiers.map((function (m) {
                        m.renderAdditionalComponents(this.props, this.state, comps);
                    }).bind(_this2));
                    if (comps.top.length) additionalComponentsTop = React.createElement(
                        'div',
                        null,
                        comps.top
                    );
                    if (comps.bottom.length) additionalComponentsBottom = React.createElement(
                        'div',
                        null,
                        comps.bottom
                    );
                })();
            }

            var custom = this.props.pydio.Parameters.get('customWording');
            var logoUrl = custom.icon;
            if (custom.icon_binary_url) {
                logoUrl = this.props.pydio.Parameters.get('ajxpServerAccess') + '&' + custom.icon_binary_url;
            }

            var logoStyle = {
                backgroundSize: 'contain',
                backgroundImage: 'url(' + logoUrl + ')',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                top: -130,
                left: 0,
                width: 320,
                height: 120
            };

            var languages = [];
            pydio.listLanguagesWithCallback(function (key, label, current) {
                languages.push(React.createElement(MenuItem, { primaryText: label, value: key, rightIcon: current ? React.createElement(FontIcon, { className: 'mdi mdi-check' }) : null }));
            });
            var languageMenu = React.createElement(
                IconMenu,
                {
                    iconButtonElement: React.createElement(IconButton, { tooltip: pydio.MessageHash[618], iconClassName: 'mdi mdi-flag-outline-variant', iconStyle: { fontSize: 20, color: 'rgba(255,255,255,.67)' } }),
                    onItemTouchTap: function (e, o) {
                        pydio.loadI18NMessages(o.props.value);
                    },
                    desktop: true
                },
                languages
            );

            return React.createElement(
                DarkThemeContainer,
                null,
                React.createElement('div', { style: logoStyle }),
                React.createElement(
                    'div',
                    { className: 'dialogLegend', style: { fontSize: 22, paddingBottom: 12, lineHeight: '28px' } },
                    pydio.MessageHash[passwordOnly ? 552 : 180],
                    languageMenu
                ),
                errorMessage,
                captcha,
                additionalComponentsTop,
                React.createElement(
                    'form',
                    { autoComplete: secureLoginForm ? "off" : "on" },
                    !passwordOnly && React.createElement(TextField, {
                        className: 'blurDialogTextField',
                        autoComplete: secureLoginForm ? "off" : "on",
                        floatingLabelText: pydio.MessageHash[181],
                        ref: 'login',
                        onKeyDown: this.submitOnEnterKey,
                        fullWidth: true,
                        id: 'application-login'
                    }),
                    React.createElement(TextField, {
                        id: 'application-password',
                        className: 'blurDialogTextField',
                        autoComplete: secureLoginForm ? "off" : "on",
                        type: 'password',
                        floatingLabelText: pydio.MessageHash[182],
                        ref: 'password',
                        onKeyDown: this.submitOnEnterKey,
                        fullWidth: true
                    })
                ),
                additionalComponentsBottom,
                forgotLink
            );
        }

    });

    var DarkThemeContainer = (function (_React$Component) {
        _inherits(DarkThemeContainer, _React$Component);

        function DarkThemeContainer() {
            _classCallCheck(this, DarkThemeContainer);

            _get(Object.getPrototypeOf(DarkThemeContainer.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(DarkThemeContainer, [{
            key: 'render',
            value: function render() {
                var _props = this.props;
                var muiTheme = _props.muiTheme;

                var props = _objectWithoutProperties(_props, ['muiTheme']);

                var baseTheme = _extends({}, darkBaseTheme);
                baseTheme.palette.primary1Color = muiTheme.palette.accent1Color;
                var darkTheme = getMuiTheme(baseTheme);

                return React.createElement(
                    MuiThemeProvider,
                    { muiTheme: darkTheme },
                    React.createElement('div', props)
                );
            }
        }]);

        return DarkThemeContainer;
    })(React.Component);

    DarkThemeContainer = muiThemeable()(DarkThemeContainer);

    var MultiAuthSelector = React.createClass({
        displayName: 'MultiAuthSelector',

        getValue: function getValue() {
            return this.state.value;
        },

        getInitialState: function getInitialState() {
            return { value: Object.keys(this.props.authSources).shift() };
        },

        onChange: function onChange(object, key, payload) {
            this.setState({ value: payload });
        },

        render: function render() {
            var menuItems = [];
            for (var key in this.props.authSources) {
                menuItems.push(React.createElement(MenuItem, { value: key, primaryText: this.props.authSources[key] }));
            }
            return React.createElement(
                SelectField,
                {
                    value: this.state.value,
                    onChange: this.onChange,
                    floatingLabelText: 'Login as...'
                },
                menuItems
            );
        }
    });

    var MultiAuthModifier = (function (_PydioReactUI$AbstractDialogModifier) {
        _inherits(MultiAuthModifier, _PydioReactUI$AbstractDialogModifier);

        function MultiAuthModifier() {
            _classCallCheck(this, MultiAuthModifier);

            _get(Object.getPrototypeOf(MultiAuthModifier.prototype), 'constructor', this).call(this);
        }

        _createClass(MultiAuthModifier, [{
            key: 'enrichSubmitParameters',
            value: function enrichSubmitParameters(props, state, refs, params) {

                var selectedSource = refs.multi_selector.getValue();
                params['auth_source'] = selectedSource;
                if (props.masterAuthSource && selectedSource === props.masterAuthSource) {
                    params['userid'] = selectedSource + props.userIdSeparator + params['userid'];
                }
            }
        }, {
            key: 'renderAdditionalComponents',
            value: function renderAdditionalComponents(props, state, accumulator) {

                if (!props.authSources) {
                    console.error('Could not find authSources');
                    return;
                }
                accumulator.top.push(React.createElement(MultiAuthSelector, _extends({ ref: 'multi_selector' }, props, { parentState: state })));
            }
        }]);

        return MultiAuthModifier;
    })(PydioReactUI.AbstractDialogModifier);

    var WebFTPDialog = React.createClass({
        displayName: 'WebFTPDialog',

        mixins: [PydioReactUI.ActionDialogMixin, PydioReactUI.SubmitButtonProviderMixin, LoginDialogMixin],

        getDefaultProps: function getDefaultProps() {
            return {
                dialogTitle: pydio.MessageHash[163],
                dialogIsModal: true
            };
        },

        submit: function submit() {

            var client = PydioApi.getClient();
            client.request({
                get_action: 'set_ftp_data',
                FTP_HOST: this.refs.FTP_HOST.getValue(),
                FTP_PORT: this.refs.FTP_PORT.getValue(),
                PATH: this.refs.PATH.getValue(),
                CHARSET: this.refs.CHARSET.getValue(),
                FTP_SECURE: this.refs.FTP_SECURE.isToggled() ? 'TRUE' : 'FALSE',
                FTP_DIRECT: this.refs.FTP_DIRECT.isToggled() ? 'TRUE' : 'FALSE'
            }, (function () {

                this.postLoginData(client);
            }).bind(this));
        },

        render: function render() {

            var messages = pydio.MessageHash;
            var tFieldStyle = { width: '100%' };
            var errorMessage = undefined;
            if (this.state.errorId) {
                errorMessage = React.createElement(
                    'div',
                    { 'class': 'ajxp_login_error' },
                    pydio.MessageHash[this.state.errorId]
                );
            }
            var captcha = undefined;
            if (this.state.displayCaptcha) {
                captcha = React.createElement(
                    'div',
                    { className: 'captcha_container' },
                    React.createElement('img', { src: this.state.globalParameters.get('ajxpServerAccess') + '&get_action=get_captcha&sid=' + Math.random() }),
                    React.createElement(TextField, { floatingLabelText: pydio.MessageHash[390], ref: 'captcha_input' })
                );
            }

            return React.createElement(
                'div',
                null,
                captcha,
                React.createElement(
                    'table',
                    { cellPadding: 5, border: '0', style: { width: 370 } },
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { colspan: '2' },
                            React.createElement(
                                'div',
                                { 'class': 'dialogLegend' },
                                messages['ftp_auth.1']
                            )
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(TextField, { fullWidth: true, style: tFieldStyle, ref: 'FTP_HOST', floatingLabelText: messages['ftp_auth.2'] })
                        ),
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(TextField, { fullWidth: true, ref: 'FTP_PORT', style: tFieldStyle, defaultValue: '21', floatingLabelText: messages['ftp_auth.8'] })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(TextField, { fullWidth: true, style: tFieldStyle, ref: 'login', floatingLabelText: messages['181'] })
                        ),
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(TextField, { fullWidth: true, style: tFieldStyle, ref: 'password', type: 'password', floatingLabelText: messages['182'] })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { colspan: '2', style: { padding: '15px 5px 0' } },
                            React.createElement(
                                'div',
                                { 'class': 'dialogLegend' },
                                messages['ftp_auth.3']
                            )
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(TextField, { fullWidth: true, style: tFieldStyle, ref: 'PATH', defaultValue: '/', floatingLabelText: messages['ftp_auth.4'] })
                        ),
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(Toggle, { ref: 'FTP_SECURE', label: messages['ftp_auth.5'], labelPosition: 'right' })
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(TextField, { fullWidth: true, style: tFieldStyle, ref: 'CHARSET', floatingLabelText: messages['ftp_auth.6'] })
                        ),
                        React.createElement(
                            'td',
                            { style: { padding: '0 5px' } },
                            React.createElement(Toggle, { ref: 'FTP_DIRECT', label: messages['ftp_auth.7'], labelPosition: 'right' })
                        )
                    )
                ),
                errorMessage
            );
        }

    });

    var Callbacks = (function () {
        function Callbacks() {
            _classCallCheck(this, Callbacks);
        }

        _createClass(Callbacks, null, [{
            key: 'sessionLogout',
            value: function sessionLogout() {

                PydioApi.clearRememberData();
                var client = PydioApi.getClient();
                client.request({ get_action: 'logout' }, function (responseObject) {
                    client.parseXmlMessage(responseObject.responseXML);
                });
            }
        }, {
            key: 'loginPassword',
            value: function loginPassword() {
                var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                pydio.UI.openComponentInModal('AuthfrontCoreActions', 'LoginPasswordDialog', _extends({}, props, { blur: true }));
            }
        }, {
            key: 'webFTP',
            value: function webFTP() {

                pydio.UI.openComponentInModal('AuthfrontCoreActions', 'WebFTPDialog');

                return;
            }
        }]);

        return Callbacks;
    })();

    var ResetPasswordRequire = React.createClass({
        displayName: 'ResetPasswordRequire',

        mixins: [PydioReactUI.ActionDialogMixin, PydioReactUI.SubmitButtonProviderMixin, PydioReactUI.CancelButtonProviderMixin],

        statics: {
            open: function open() {
                pydio.UI.openComponentInModal('AuthfrontCoreActions', 'ResetPasswordRequire', { blur: true });
            }
        },

        getDefaultProps: function getDefaultProps() {
            return {
                dialogTitle: pydio.MessageHash['gui.user.1'],
                dialogIsModal: true,
                dialogSize: 'sm'
            };
        },

        useBlur: function useBlur() {
            return true;
        },

        cancel: function cancel() {
            pydio.Controller.fireAction('login');
        },

        submit: function submit() {
            var _this3 = this;

            var valueSubmitted = this.state && this.state.valueSubmitted;
            if (valueSubmitted) {
                this.cancel();
            }
            var value = this.refs.input && this.refs.input.getValue();
            if (!value) return;
            PydioApi.getClient().request({
                get_action: 'reset-password-ask',
                email: value
            }, function () {
                _this3.setState({ valueSubmitted: true });
            });
        },

        render: function render() {
            var mess = this.props.pydio.MessageHash;
            var valueSubmitted = this.state && this.state.valueSubmitted;
            return React.createElement(
                'div',
                null,
                !valueSubmitted && React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'dialogLegend' },
                        mess['gui.user.3']
                    ),
                    React.createElement(TextField, {
                        className: 'blurDialogTextField',
                        ref: 'input',
                        fullWidth: true,
                        floatingLabelText: mess['gui.user.4']
                    })
                ),
                valueSubmitted && React.createElement(
                    'div',
                    null,
                    mess['gui.user.5']
                )
            );
        }

    });

    var ResetPasswordDialog = React.createClass({
        displayName: 'ResetPasswordDialog',

        mixins: [PydioReactUI.ActionDialogMixin, PydioReactUI.SubmitButtonProviderMixin],

        statics: {
            open: function open() {
                pydio.UI.openComponentInModal('AuthfrontCoreActions', 'ResetPasswordDialog', { blur: true });
            }
        },

        getDefaultProps: function getDefaultProps() {
            return {
                dialogTitle: pydio.MessageHash['gui.user.1'],
                dialogIsModal: true,
                dialogSize: 'sm'
            };
        },

        getInitialState: function getInitialState() {
            return { valueSubmitted: false, formLoaded: false, passValue: null, userId: null };
        },

        useBlur: function useBlur() {
            return true;
        },

        submit: function submit() {
            var _this4 = this;

            var pydio = this.props.pydio;

            if (this.state.valueSubmitted) {
                this.props.onDismiss();
                pydio.Controller.fireAction('login');
                return;
            }

            var mess = pydio.MessageHash;
            PydioApi.getClient().request({
                get_action: 'reset-password',
                key: pydio.Parameters.get('USER_ACTION_KEY'),
                user_id: this.state.userId,
                new_pass: this.state.passValue
            }, function (transp) {
                if (transp.responseText === 'PASS_ERROR') {
                    global.alert(mess[240]);
                } else {
                    _this4.setState({ valueSubmitted: true });
                }
            });
        },

        componentDidMount: function componentDidMount() {
            var _this5 = this;

            Promise.resolve(require('pydio').requireLib('form', true)).then(function () {
                _this5.setState({ formLoaded: true });
            });
        },

        onPassChange: function onPassChange(newValue, oldValue) {
            this.setState({ passValue: newValue });
        },

        onUserIdChange: function onUserIdChange(event, newValue) {
            this.setState({ userId: newValue });
        },

        render: function render() {
            var mess = this.props.pydio.MessageHash;
            var _state = this.state;
            var valueSubmitted = _state.valueSubmitted;
            var formLoaded = _state.formLoaded;
            var passValue = _state.passValue;
            var userId = _state.userId;

            if (!valueSubmitted && formLoaded) {

                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'dialogLegend' },
                        mess['gui.user.8']
                    ),
                    React.createElement(TextField, {
                        className: 'blurDialogTextField',
                        value: userId,
                        floatingLabelText: mess['gui.user.4'],
                        onChange: this.onUserIdChange.bind(this)
                    }),
                    React.createElement(PydioForm.ValidPassword, {
                        className: 'blurDialogTextField',
                        onChange: this.onPassChange.bind(this),
                        attributes: { name: 'password', label: mess[198] },
                        value: passValue
                    })
                );
            } else if (valueSubmitted) {

                return React.createElement(
                    'div',
                    null,
                    mess['gui.user.6']
                );
            } else {
                return React.createElement(PydioReactUI.Loader, null);
            }
        }

    });

    global.AuthfrontCoreActions = {
        Callbacks: Callbacks,
        LoginPasswordDialog: LoginPasswordDialog,
        ResetPasswordRequire: ResetPasswordRequire,
        ResetPasswordDialog: ResetPasswordDialog,
        WebFTPDialog: WebFTPDialog,
        MultiAuthModifier: MultiAuthModifier
    };
})(window);

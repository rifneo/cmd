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
var React = require('react');
var Pydio = require('pydio');

var _Pydio$requireLib = Pydio.requireLib('boot');

var ActionDialogMixin = _Pydio$requireLib.ActionDialogMixin;

var _require = require('material-ui');

var AppBar = _require.AppBar;

var _Pydio$requireLib2 = Pydio.requireLib('form');

var ValidPassword = _Pydio$requireLib2.ValidPassword;

var PasswordForm = React.createClass({
    displayName: 'PasswordForm',

    getInitialState: function getInitialState() {
        return { error: null, old: '', newPass: '' };
    },

    getMessage: function getMessage(id) {
        return this.props.pydio.MessageHash[id];
    },

    update: function update(value, field) {
        var _this = this;

        var newStatus = {};
        newStatus[field] = value;
        this.setState(newStatus, function () {
            var status = _this.validate();
            if (_this.props.onValidStatusChange) {
                _this.props.onValidStatusChange(status);
            }
        });
    },

    validate: function validate() {
        if (!this.refs.newpass.isValid()) {
            return false;
        }
        var _state = this.state;
        var oldPass = _state.oldPass;
        var newPass = _state.newPass;

        if (!oldPass || !newPass) {
            this.setState({ error: this.getMessage(239) });
            return false;
        }
        if (newPass.length < parseInt(this.props.pydio.getPluginConfigs("core.auth").get("PASSWORD_MINLENGTH"))) {
            this.setState({ error: this.getMessage(378) });
            return false;
        }
        this.setState({ error: null });
        return true;
    },

    post: function post(callback) {
        var _state2 = this.state;
        var oldPass = _state2.oldPass;
        var newPass = _state2.newPass;

        var logoutString = '';
        if (this.props.pydio.user.lock) {
            logoutString = ' ' + this.getMessage(445);
        }
        PydioApi.getClient().request({
            get_action: 'pass_change',
            old_pass: oldPass,
            new_pass: newPass,
            pass_seed: '-1'
        }, (function (transport) {

            if (transport.responseText === 'PASS_ERROR') {

                this.setState({ error: this.getMessage(240) });
                callback(false);
            } else if (transport.responseText === 'SUCCESS') {

                this.props.pydio.displayMessage('SUCCESS', this.getMessage(197) + logoutString);
                callback(true);
                if (logoutString) {
                    this.props.pydio.getController().fireAction('logout');
                }
            }
        }).bind(this));
    },

    render: function render() {
        var _this2 = this;

        var messages = this.props.pydio.MessageHash;
        var legend = undefined;
        if (this.state.error) {
            legend = React.createElement(
                'div',
                { className: 'error' },
                this.state.error
            );
        } else if (this.props.pydio.user.lock) {
            legend = React.createElement(
                'div',
                null,
                messages[444]
            );
        }
        var oldChange = function oldChange(event, newV) {
            _this2.update(newV, 'oldPass');
        };
        var newChange = function newChange(newV, oldV) {
            _this2.update(newV, 'newPass');
        };
        return React.createElement(
            'div',
            { style: this.props.style },
            legend,
            React.createElement(
                'div',
                null,
                React.createElement(
                    'form',
                    { autoComplete: 'off' },
                    React.createElement(MaterialUI.TextField, {
                        onChange: oldChange,
                        type: 'password',
                        value: this.state.oldPass,
                        ref: 'old',
                        floatingLabelText: messages[237],
                        autoComplete: 'off'
                    })
                )
            ),
            React.createElement(
                'div',
                { style: { width: 250 } },
                React.createElement(ValidPassword, {
                    onChange: newChange,
                    attributes: { name: 'pass', label: messages[198] },
                    value: this.state.newPass,
                    name: 'newpassword',
                    ref: 'newpass'
                })
            )
        );
    }

});

exports['default'] = PasswordForm;
module.exports = exports['default'];

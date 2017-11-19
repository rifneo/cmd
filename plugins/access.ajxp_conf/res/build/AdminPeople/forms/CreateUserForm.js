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
var CreateUserForm = React.createClass({
    displayName: 'CreateUserForm',

    propTypes: {
        dataModel: React.PropTypes.instanceOf(PydioDataModel),
        openRoleEditor: React.PropTypes.func
    },

    mixins: [AdminComponents.MessagesConsumerMixin, PydioReactUI.ActionDialogMixin, PydioReactUI.CancelButtonProviderMixin, PydioReactUI.SubmitButtonProviderMixin],

    getDefaultProps: function getDefaultProps() {
        return {
            dialogSize: 'sm',
            dialogTitleId: 'ajxp_admin.user.19'
        };
    },

    checkPassword: function checkPassword() {
        var value1 = this.refs.pass.getValue();
        var value2 = this.refs.passconf.getValue();
        var minLength = parseInt(global.pydio.getPluginConfigs("core.auth").get("PASSWORD_MINLENGTH"));
        if (value1 && value1.length < minLength) {
            this.refs.pass.setErrorText(this.context.getMessage('378'));
            return;
        }
        if (value1 && value2 && value2 != value1) {
            this.refs.passconf.setErrorText(this.context.getMessage('238'));
            return;
        }
        this.refs.pass.setErrorText(null);
        this.refs.passconf.setErrorText(null);
    },

    getInitialState: function getInitialState() {
        return {
            step: 1
        };
    },

    submit: function submit(dialog) {
        var parameters = {};
        var ctx = this.props.dataModel.getUniqueNode() || this.props.dataModel.getContextNode();
        parameters['get_action'] = 'create_user';
        parameters['new_user_login'] = this.refs.user_id.getValue();
        parameters['new_user_pwd'] = this.refs.pass.getValue();
        var currentPath = ctx.getPath();
        if (currentPath.startsWith("/data/users")) {
            parameters['group_path'] = currentPath.substr("/data/users".length);
        }
        PydioApi.getClient().request(parameters, (function (transport) {
            var xml = transport.responseXML;
            var message = XMLUtils.XPathSelectSingleNode(xml, "//reload_instruction");
            if (message) {
                var node = new AjxpNode(currentPath + "/" + parameters['new_user_login'], true);
                node.getMetadata().set("ajxp_mime", "user");
                //global.pydio.UI.openCurrentSelectionInEditor(node);
                this.props.openRoleEditor(node);
                var currentNode = global.pydio.getContextNode();
                if (global.pydio.getContextHolder().getSelectedNodes().length) {
                    currentNode = global.pydio.getContextHolder().getSelectedNodes()[0];
                }
                currentNode.reload();
            }
        }).bind(this));
        this.dismiss();
    },

    render: function render() {
        var ctx = this.props.dataModel.getUniqueNode() || this.props.dataModel.getContextNode();
        var currentPath = ctx.getPath();
        var path;
        if (currentPath.startsWith("/data/users")) {
            path = currentPath.substr("/data/users".length);
            if (path) {
                path = React.createElement(
                    'div',
                    null,
                    this.context.getMessage('ajxp_admin.user.20').replace('%s', path)
                );
            }
        }
        return React.createElement(
            'div',
            null,
            path,
            React.createElement(
                'div',
                null,
                React.createElement(ReactMUI.TextField, {
                    ref: 'user_id',
                    floatingLabelText: this.context.getMessage('ajxp_admin.user.21')
                })
            ),
            React.createElement(
                'div',
                null,
                React.createElement(ReactMUI.TextField, {
                    ref: 'pass',
                    type: 'password',
                    floatingLabelText: this.context.getMessage('ajxp_admin.user.22'),
                    onChange: this.checkPassword
                })
            ),
            React.createElement(
                'div',
                null,
                React.createElement(ReactMUI.TextField, {
                    ref: 'passconf',
                    type: 'password',
                    floatingLabelText: this.context.getMessage('ajxp_admin.user.23'),
                    onChange: this.checkPassword
                })
            )
        );
    }
});

exports['default'] = CreateUserForm;
module.exports = exports['default'];

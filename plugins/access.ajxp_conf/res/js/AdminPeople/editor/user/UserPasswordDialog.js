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

const React = require('react')
const {TextField, FlatButton} = require('material-ui')
const Pydio = require('pydio');
const {ActionDialogMixin, CancelButtonProviderMixin, SubmitButtonProviderMixin} = Pydio.requireLib('boot');

export default React.createClass({

    mixins: [
        ActionDialogMixin, CancelButtonProviderMixin, SubmitButtonProviderMixin
    ],

    propTypes: {
        pydio : React.PropTypes.instanceOf(Pydio),
        userId: React.PropTypes.string.isRequired
    },

    getDefaultProps: function(){
        return {
            dialogTitle: global.pydio.MessageHash['role_editor.25'],
            dialogSize: 'sm'
        }
    },

    getInitialState: function () {
        return {okEnabled: false};
    },

    onChange: function (event, value) {
        const minLength = parseInt(global.pydio.getPluginConfigs("core.auth").get("PASSWORD_MINLENGTH"));

        const enabled = (this.refs.pass.getValue()
            && this.refs.pass.getValue().length >= minLength
            && this.refs.pass.getValue() == this.refs.confirm.getValue()
        );

        this.setState({okEnabled: enabled});
    },

    submit: function () {

        if(!this.state.okEnabled){
            return;
        }

        const value = this.refs.pass.getValue();
        PydioApi.getClient().request({
                get_action: "edit",
                sub_action: "update_user_pwd",
                user_id: this.props.userId,
                user_pwd: value
            }, function () {
                this.dismiss()
            }.bind(this)
        );
    },

    render: function () {

        // This is passed via state, context is not working,
        // so we have to get the messages from the global.
        const getMessage = function (id, namespace='') {
            return global.pydio.MessageHash[namespace + (namespace ? '.' : '') + id] || id;
        };
        return (
            <div style={{width: '100%'}}>
                <TextField ref="pass" type="password" fullWidth={true}
                            onChange={this.onChange}
                            floatingLabelText={getMessage('523')}
                           errorText={!this.state.okEnabled ? getMessage('378') : null}
                />
                <TextField ref="confirm" type="password" fullWidth={true}
                            onChange={this.onChange}
                            floatingLabelText={getMessage('199')}/>
            </div>
        );

    }

});

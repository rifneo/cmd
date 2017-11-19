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

(function(global){

    const {muiThemeable, getMuiTheme, darkBaseTheme} = MaterialUI.Style;
    const {TextField, MuiThemeProvider, FlatButton, Checkbox, FontIcon,
        MenuItem, SelectField, IconButton, IconMenu, Toggle} = MaterialUI;

    let pydio = global.pydio;

    let LoginDialogMixin = {

        getInitialState: function(){
            return {
                globalParameters: pydio.Parameters,
                authParameters: pydio.getPluginConfigs('auth'),
                errorId: null,
                displayCaptcha: false
            };
        },

        postLoginData: function(client){

            const passwordOnly = this.state.globalParameters.get('PASSWORD_AUTH_ONLY');
            let login;
            if(passwordOnly){
                login = this.state.globalParameters.get('PRESET_LOGIN');
            }else{
                login = this.refs.login.getValue();
            }
            let params = {
                get_action  : 'login',
                userid      : login,
                password    : this.refs.password.getValue(),
                login_seed  : -1
            };
            if(this.refs.captcha_input){
                params['captcha_code'] = this.refs.captcha_input.getValue();
            }
            if(this.state && this.state.rememberChecked){
                params['remember_me'] = 'true' ;
            }
            if(this.props.modifiers){
                this.props.modifiers.map(function(m){
                    m.enrichSubmitParameters(this.props, this.state, this.refs, params);
                }.bind(this));
            }
            client.request(params, function(responseObject){
                let success = client.parseXmlMessage(responseObject.responseXML);
                if(success){
                    this.dismiss();
                }else{
                    let errorId = PydioApi.getClient().LAST_ERROR_ID;
                    if(errorId == '285' && passwordOnly){
                        errorId = '553';
                    }
                    this.setState({errorId: errorId});
                    if(responseObject.responseXML && XMLUtils.XPathGetSingleNodeText(responseObject.responseXML.documentElement, "logging_result/@value") === '-4'){
                        this.setState({displayCaptcha: true});
                    }

                }
            }.bind(this));

        }
    };

    let LoginPasswordDialog = React.createClass({

        mixins:[
            PydioReactUI.ActionDialogMixin,
            PydioReactUI.SubmitButtonProviderMixin,
            LoginDialogMixin
        ],

        getDefaultProps: function(){
            return {
                dialogTitle: '', //pydio.MessageHash[163],
                dialogIsModal: true,
                dialogSize:'sm'
            };
        },

        getInitialState: function(){
            return {rememberChecked: false};
        },

        componentWillReceiveProps: function(){
            this.setState({displayCaptcha: false});
            PydioApi.getClient().request({get_action:"get_seed"}, function(transport){
                if(transport.responseJSON)  this.setState({displayCaptcha: true});
            }.bind(this));
        },

        submit: function(){
            let client = PydioApi.getClient();
            this.postLoginData(client);
        },

        fireForgotPassword: function(e){
            e.stopPropagation();
            pydio.getController().fireAction(this.state.authParameters.get("FORGOT_PASSWORD_ACTION"));
        },

        useBlur: function(){
            return true;
        },

        getButtons: function(){
            const passwordOnly = this.state.globalParameters.get('PASSWORD_AUTH_ONLY');
            const secureLoginForm = passwordOnly || this.state.authParameters.get('SECURE_LOGIN_FORM');

            const enterButton = <FlatButton id="dialog-login-submit" default={true} labelStyle={{color:'white'}} key="enter" label={pydio.MessageHash[617]} onTouchTap={() => this.submit()}/>;
            let buttons = [];
            if(!secureLoginForm){
                buttons.push(
                    <DarkThemeContainer key="remember" style={{flex:1, textAlign:'left', paddingLeft: 16}}>
                        <Checkbox label={pydio.MessageHash[261]} labelStyle={{fontSize:13}} onCheck={(e,c)=>{this.setState({rememberChecked:c})}}/>
                    </DarkThemeContainer>
                );
                buttons.push(enterButton);
                return [<div style={{display:'flex',alignItems:'center'}}>{buttons}</div>];
            }else{
                return [enterButton];
            }

        },

        render: function(){
            const passwordOnly = this.state.globalParameters.get('PASSWORD_AUTH_ONLY');
            const secureLoginForm = passwordOnly || this.state.authParameters.get('SECURE_LOGIN_FORM');
            const forgotPasswordLink = this.state.authParameters.get('ENABLE_FORGOT_PASSWORD') && !passwordOnly;

            let errorMessage;
            if(this.state.errorId){
                errorMessage = <div className="ajxp_login_error">{pydio.MessageHash[this.state.errorId]}</div>;
            }
            let captcha;
            if(this.state.displayCaptcha){
                captcha = (
                    <div className="captcha_container">
                        <TextField style={{width:170, marginTop: -20}} hintText={pydio.MessageHash[390]} ref="captcha_input" onKeyDown={this.submitOnEnterKey}/>
                        <img src={this.state.globalParameters.get('ajxpServerAccess') + '&get_action=get_captcha&sid='+Math.random()}/>
                    </div>
                );
            }
            let forgotLink;
            if(forgotPasswordLink){
                forgotLink = (
                    <div className="forgot-password-link">
                        <a style={{cursor:'pointer'}} onClick={this.fireForgotPassword}>{pydio.MessageHash[479]}</a>
                    </div>
                );
            }
            let additionalComponentsTop, additionalComponentsBottom;
            if(this.props.modifiers){
                let comps = {top: [], bottom: []};
                this.props.modifiers.map(function(m){
                    m.renderAdditionalComponents(this.props, this.state, comps);
                }.bind(this));
                if(comps.top.length) additionalComponentsTop = <div>{comps.top}</div>;
                if(comps.bottom.length) additionalComponentsBottom = <div>{comps.bottom}</div>;
            }

            const custom = this.props.pydio.Parameters.get('customWording');
            let logoUrl = custom.icon;
            if(custom.icon_binary_url){
                logoUrl = this.props.pydio.Parameters.get('ajxpServerAccess') + '&' + custom.icon_binary_url;
            }

            const logoStyle = {
                backgroundSize: 'contain',
                backgroundImage: 'url('+logoUrl+')',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position:'absolute',
                top: -130,
                left: 0,
                width: 320,
                height: 120
            };

            let languages = [];
            pydio.listLanguagesWithCallback((key, label, current) => {
                languages.push(<MenuItem primaryText={label} value={key} rightIcon={current?<FontIcon className="mdi mdi-check"/>:null}/>);
            });
            const languageMenu = (
                <IconMenu
                    iconButtonElement={<IconButton tooltip={pydio.MessageHash[618]} iconClassName="mdi mdi-flag-outline-variant" iconStyle={{fontSize:20,color:'rgba(255,255,255,.67)'}}/>}
                    onItemTouchTap={(e,o) => {pydio.loadI18NMessages(o.props.value)}}
                    desktop={true}
                >{languages}</IconMenu>
            );

            return (
                <DarkThemeContainer>
                    <div style={logoStyle}></div>
                    <div className="dialogLegend" style={{fontSize: 22, paddingBottom: 12, lineHeight: '28px'}}>
                        {pydio.MessageHash[passwordOnly ? 552 : 180]}
                        {languageMenu}
                    </div>
                    {errorMessage}
                    {captcha}
                    {additionalComponentsTop}
                    <form autoComplete={secureLoginForm?"off":"on"}>
                        {!passwordOnly && <TextField
                            className="blurDialogTextField"
                            autoComplete={secureLoginForm?"off":"on"}
                            floatingLabelText={pydio.MessageHash[181]}
                            ref="login"
                            onKeyDown={this.submitOnEnterKey}
                            fullWidth={true}
                            id="application-login"
                        />}
                        <TextField
                            id="application-password"
                            className="blurDialogTextField"
                            autoComplete={secureLoginForm?"off":"on"}
                            type="password"
                            floatingLabelText={pydio.MessageHash[182]}
                            ref="password"
                            onKeyDown={this.submitOnEnterKey}
                            fullWidth={true}
                        />
                    </form>
                    {additionalComponentsBottom}
                    {forgotLink}
                </DarkThemeContainer>
            );
        }

    });

    class DarkThemeContainer extends React.Component{

        render(){

            const {muiTheme, ...props} = this.props;
            let baseTheme = {...darkBaseTheme};
            baseTheme.palette.primary1Color = muiTheme.palette.accent1Color;
            const darkTheme = getMuiTheme(baseTheme);

            return (
                <MuiThemeProvider muiTheme={darkTheme}>
                    <div {...props}/>
                </MuiThemeProvider>
            );

        }

    }

    DarkThemeContainer = muiThemeable()(DarkThemeContainer);

    let MultiAuthSelector = React.createClass({

        getValue: function(){
            return this.state.value;
        },

        getInitialState: function(){
            return {value:Object.keys(this.props.authSources).shift()}
        },

        onChange: function(object, key, payload){
            this.setState({value: payload});
        },

        render: function(){
            let menuItems = [];
            for (let key in this.props.authSources){
                menuItems.push(<MenuItem value={key} primaryText={this.props.authSources[key]}/>);
            }
            return (
                <SelectField
                    value={this.state.value}
                    onChange={this.onChange}
                    floatingLabelText="Login as..."
                >{menuItems}</SelectField>);

        }
    });

    class MultiAuthModifier extends PydioReactUI.AbstractDialogModifier{

        constructor(){
            super();
        }

        enrichSubmitParameters(props, state, refs, params){

            const selectedSource = refs.multi_selector.getValue();
            params['auth_source'] = selectedSource
            if(props.masterAuthSource && selectedSource === props.masterAuthSource){
                params['userid'] = selectedSource + props.userIdSeparator + params['userid'];
            }

        }

        renderAdditionalComponents(props, state, accumulator){

            if(!props.authSources){
                console.error('Could not find authSources');
                return;
            }
            accumulator.top.push( <MultiAuthSelector ref="multi_selector" {...props} parentState={state}/> );

        }

    }


    let WebFTPDialog = React.createClass({

        mixins: [
            PydioReactUI.ActionDialogMixin,
            PydioReactUI.SubmitButtonProviderMixin,
            LoginDialogMixin
        ],

        getDefaultProps: function () {
            return {
                dialogTitle: pydio.MessageHash[163],
                dialogIsModal: true
            };
        },

        submit: function(){

            let client = PydioApi.getClient();
            client.request({
                get_action      :'set_ftp_data',
                FTP_HOST        :this.refs.FTP_HOST.getValue(),
                FTP_PORT        :this.refs.FTP_PORT.getValue(),
                PATH            :this.refs.PATH.getValue(),
                CHARSET         :this.refs.CHARSET.getValue(),
                FTP_SECURE      :this.refs.FTP_SECURE.isToggled()?'TRUE':'FALSE',
                FTP_DIRECT      :this.refs.FTP_DIRECT.isToggled()?'TRUE':'FALSE',
            }, function(){

                this.postLoginData(client);

            }.bind(this));

        },

        render: function(){

            let messages = pydio.MessageHash;
            let tFieldStyle={width:'100%'};
            let errorMessage;
            if(this.state.errorId){
                errorMessage = <div class="ajxp_login_error">{pydio.MessageHash[this.state.errorId]}</div>;
            }
            let captcha;
            if(this.state.displayCaptcha){
                captcha = (
                    <div className="captcha_container">
                        <img src={this.state.globalParameters.get('ajxpServerAccess') + '&get_action=get_captcha&sid='+Math.random()}/>
                        <TextField floatingLabelText={pydio.MessageHash[390]} ref="captcha_input"/>
                    </div>
                );
            }

            return (
                <div>
                    {captcha}
                    <table cellPadding={5} border="0" style={{width:370}}>
                        <tr>
                            <td colspan="2">
                                <div class="dialogLegend">{messages['ftp_auth.1']}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{padding:'0 5px'}}>
                                <TextField fullWidth={true} style={tFieldStyle} ref="FTP_HOST" floatingLabelText={messages['ftp_auth.2']}/>
                            </td>
                            <td style={{padding:'0 5px'}}>
                                <TextField fullWidth={true} ref="FTP_PORT" style={tFieldStyle} defaultValue="21" floatingLabelText={messages['ftp_auth.8']}/>
                            </td>
                        </tr>
                        <tr>
                            <td style={{padding:'0 5px'}}>
                                <TextField fullWidth={true} style={tFieldStyle} ref="login" floatingLabelText={messages['181']}/>
                            </td>
                            <td style={{padding:'0 5px'}}>
                                <TextField fullWidth={true} style={tFieldStyle} ref="password" type="password" floatingLabelText={messages['182']}/>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style={{padding:'15px 5px 0'}}>
                                <div class="dialogLegend">{messages['ftp_auth.3']}</div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{padding:'0 5px'}}>
                                <TextField fullWidth={true} style={tFieldStyle} ref="PATH" defaultValue="/" floatingLabelText={messages['ftp_auth.4']}/>
                            </td>
                            <td style={{padding:'0 5px'}}>
                                <Toggle ref="FTP_SECURE" label={messages['ftp_auth.5']} labelPosition="right"/>
                            </td>
                        </tr>
                        <tr>
                            <td style={{padding:'0 5px'}}>
                                <TextField fullWidth={true} style={tFieldStyle} ref="CHARSET" floatingLabelText={messages['ftp_auth.6']}/>
                            </td>
                            <td style={{padding:'0 5px'}}>
                                <Toggle ref="FTP_DIRECT" label={messages['ftp_auth.7']} labelPosition="right"/>
                            </td>
                        </tr>
                    </table>
                    {errorMessage}
                </div>
            );

        }

    });

    class Callbacks{

        static sessionLogout(){

            PydioApi.clearRememberData();
            let client = PydioApi.getClient();
            client.request({get_action:'logout'}, function(responseObject){
                client.parseXmlMessage(responseObject.responseXML);
            });

        }

        static loginPassword(props = {}) {
            
            pydio.UI.openComponentInModal('AuthfrontCoreActions', 'LoginPasswordDialog', {...props, blur: true});

        }

        static webFTP(){

            pydio.UI.openComponentInModal('AuthfrontCoreActions', 'WebFTPDialog');

            return;

        }

    }

    const ResetPasswordRequire = React.createClass({

        mixins: [
            PydioReactUI.ActionDialogMixin,
            PydioReactUI.SubmitButtonProviderMixin,
            PydioReactUI.CancelButtonProviderMixin
        ],

        statics: {
            open : () => {
                pydio.UI.openComponentInModal('AuthfrontCoreActions', 'ResetPasswordRequire', {blur: true});
            }
        },

        getDefaultProps: function(){
            return {
                dialogTitle: pydio.MessageHash['gui.user.1'],
                dialogIsModal: true,
                dialogSize:'sm'
            };
        },

        useBlur: function(){
            return true;
        },

        cancel: function(){
            pydio.Controller.fireAction('login');
        },

        submit: function(){
            const valueSubmitted = this.state && this.state.valueSubmitted;
            if(valueSubmitted){
                this.cancel();
            }
            const value = this.refs.input && this.refs.input.getValue();
            if(!value) return;
            PydioApi.getClient().request({
                get_action: 'reset-password-ask',
                email: value
            }, () => {
                this.setState({valueSubmitted: true});
            });
        },

        render: function(){
            const mess = this.props.pydio.MessageHash;
            const valueSubmitted = this.state && this.state.valueSubmitted;
            return (
                <div>
                    {!valueSubmitted &&
                        <div>
                            <div className="dialogLegend">{mess['gui.user.3']}</div>
                            <TextField
                                className="blurDialogTextField"
                                ref="input"
                                fullWidth={true}
                                floatingLabelText={mess['gui.user.4']}
                            />
                        </div>
                    }
                    {valueSubmitted &&
                        <div>{mess['gui.user.5']}</div>
                    }
                </div>
            );

        }


    });

    const ResetPasswordDialog = React.createClass({

        mixins: [
            PydioReactUI.ActionDialogMixin,
            PydioReactUI.SubmitButtonProviderMixin
        ],

        statics: {
            open : () => {
                pydio.UI.openComponentInModal('AuthfrontCoreActions', 'ResetPasswordDialog', {blur:true});
            }
        },

        getDefaultProps: function(){
            return {
                dialogTitle: pydio.MessageHash['gui.user.1'],
                dialogIsModal: true,
                dialogSize:'sm'
            };
        },

        getInitialState: function(){
            return {valueSubmitted: false, formLoaded: false, passValue:null, userId:null};
        },

        useBlur: function(){
            return true;
        },


        submit: function(){
            const {pydio} = this.props;

            if(this.state.valueSubmitted){
                this.props.onDismiss();
                pydio.Controller.fireAction('login');
                return;
            }

            const mess = pydio.MessageHash;
            PydioApi.getClient().request({
                get_action  : 'reset-password',
                key         : pydio.Parameters.get('USER_ACTION_KEY'),
                user_id     : this.state.userId,
                new_pass    : this.state.passValue
            }, (transp) => {
                if(transp.responseText === 'PASS_ERROR'){
                    global.alert(mess[240]);
                }else{
                    this.setState({valueSubmitted: true});
                }
            });
        },

        componentDidMount: function(){
            Promise.resolve(require('pydio').requireLib('form', true)).then(()=>{
                this.setState({formLoaded: true});
            });
        },

        onPassChange: function(newValue, oldValue){
            this.setState({passValue: newValue});
        },

        onUserIdChange: function(event, newValue){
            this.setState({userId: newValue});
        },

        render: function(){
            const mess = this.props.pydio.MessageHash;
            const {valueSubmitted, formLoaded, passValue, userId} = this.state;
            if(!valueSubmitted && formLoaded){

                return (
                    <div>
                        <div className="dialogLegend">{mess['gui.user.8']}</div>
                        <TextField
                            className="blurDialogTextField"
                            value={userId}
                            floatingLabelText={mess['gui.user.4']}
                            onChange={this.onUserIdChange.bind(this)}
                        />
                        <PydioForm.ValidPassword
                            className="blurDialogTextField"
                            onChange={this.onPassChange.bind(this)}
                            attributes={{name:'password',label:mess[198]}}
                            value={passValue}
                        />
                    </div>

                );

            }else if(valueSubmitted){

                return (
                    <div>{mess['gui.user.6']}</div>
                );

            }else{
                return <PydioReactUI.Loader/>
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

})(window)
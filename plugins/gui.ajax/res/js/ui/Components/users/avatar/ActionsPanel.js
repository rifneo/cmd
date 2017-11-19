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

import AddressBook from '../addressbook/AddressBook'
const React = require('react')
const {UsersApi} = require('pydio/http/users-api')
const ResourcesManager = require('pydio/http/resources-manager')
const {IconButton, Popover} = require('material-ui')
const {muiThemeable} = require('material-ui/styles')
const {PydioContextConsumer, AsyncComponent} = require('pydio').requireLib('boot')

class ActionsPanel extends React.Component{

    constructor(props, context){
        super(props, context);
        this.state = {showPicker : false, pickerAnchor: null, showMailer: false, mailerAnchor: null};
    }

    onTeamSelected(item){
        this.setState({showPicker: false});
        if(item.getType() === 'group' && item.getId().indexOf('/AJXP_TEAM/') === 0){
            UsersApi.addUserToTeam(item.getId().replace('/AJXP_TEAM/', ''), this.props.userId, this.props.reloadAction);
        }
    }
    
    onUserSelected(item){
        this.setState({showPicker: false});
        UsersApi.addUserToTeam(this.props.team.id, item.getId(), this.props.reloadAction);
    }

    openPicker(event){
        this.setState({showPicker: true, pickerAnchor: event.currentTarget});
    }

    openMailer(event){

        const target = event.currentTarget;
        ResourcesManager.loadClassesAndApply(['PydioMailer'], () => {
            this.setState({mailerLibLoaded: true}, () => {
                this.setState({showMailer: true, mailerAnchor: target});
            });
        });
    }

    componentDidUpdate(prevProps, prevState){
        if(!this.props.lockOnSubPopoverOpen) return;
        if( (this.state.showPicker || this.state.showMailer) && !(prevState.showPicker || prevState.showMailer)){
            this.props.lockOnSubPopoverOpen(true);
        }else if( !(this.state.showPicker || this.state.showMailer) && (prevState.showPicker || prevState.showMailer) ){
            this.props.lockOnSubPopoverOpen(false);
        }
    }
    
    render(){

        const {getMessage, muiTheme, team, user, userEditable} = this.props;

        const styles = {
            button: {
                backgroundColor: muiTheme.palette.accent2Color,
                borderRadius: '50%',
                margin: '0 4px',
                width: 44,
                height: 44,
                padding: 10
            },
            icon : {
                color: 'white'
            }
        }
        let mailer, usermails = {};
        let actions = [];
        if(user && user.hasEmail){
            actions.push({key:'message', label:getMessage(598), icon:'email', callback: this.openMailer.bind(this)});
            usermails[this.props.user.id] = PydioUsers.User.fromObject(this.props.user);
        }
        if(team){
            actions.push({key:'users', label:getMessage(599), icon:'account-multiple-plus', callback:this.openPicker.bind(this)});
        }else{
            actions.push({key:'teams', label:getMessage(573), icon:'account-multiple-plus', callback:this.openPicker.bind(this)});
        }
        if(userEditable){
            actions.push({key:'edit', label:this.props.team?getMessage(580):getMessage(600), icon:'pencil', callback:this.props.onEditAction});
            actions.push({key:'delete', label:this.props.team?getMessage(570):getMessage(582), icon:'delete', callback:this.props.onDeleteAction});
        }

        return (
            <div style={{textAlign:'center', marginBottom: 16}}>
                {actions.map(function(a){
                    return <IconButton
                        key={a.key}
                        style={styles.button}
                        iconStyle={styles.icon}
                        tooltip={a.label}
                        iconClassName={"mdi mdi-" + a.icon}
                        onTouchTap={a.callback}
                    />
                })}
                <Popover
                    open={this.state.showPicker}
                    anchorEl={this.state.pickerAnchor}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={() => {this.setState({showPicker: false})}}
                    useLayerForClickAway={false}
                    style={{zIndex:2200}}
                >
                    <div style={{width: 256, height: 320}}>
                        <AddressBook
                            mode="selector"
                            pydio={this.props.pydio}
                            loaderStyle={{width: 320, height: 420}}
                            onItemSelected={this.props.team ? this.onUserSelected.bind(this) : this.onTeamSelected.bind(this)}
                            teamsOnly={this.props.team ? false: true}
                            usersOnly={this.props.team ? true: false}
                        />
                    </div>
                </Popover>
                <Popover
                    open={this.state.showMailer}
                    anchorEl={this.state.mailerAnchor}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    useLayerForClickAway={false}
                    style={{zIndex:2200}}
                >
                    <div style={{width: 256, height: 320}}>
                        {this.state.mailerLibLoaded &&
                        <AsyncComponent
                            namespace="PydioMailer"
                            componentName="Pane"
                            zDepth={0}
                            panelTitle={getMessage(598)}
                            uniqueUserStyle={true}
                            users={usermails}
                            onDismiss={() => {this.setState({showMailer: false})}}
                            onFieldFocus={this.props.otherPopoverMouseOver}
                        />}
                    </div>
                </Popover>
            </div>
        );

    }

}

ActionsPanel.propTypes = {

    /**
     * User data, props must pass at least one of 'user' or 'team'
     */
    user: React.PropTypes.object,
    /**
     * Team data, props must pass at least one of 'user' or 'team'
     */
    team: React.PropTypes.object,
    /**
     * For users, whether it is editable or not
     */
    userEditable: React.PropTypes.object

}

ActionsPanel = PydioContextConsumer(ActionsPanel);
ActionsPanel = muiThemeable()(ActionsPanel);

export {ActionsPanel as default}
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
import UserAvatar from '../avatar/UserAvatar'
const {AsyncComponent} = require('pydio').requireLib('boot')

/**
 * Card presentation of a user. Relies on the UserAvatar object,
 * plus the PydioForm.UserCreationForm when in edit mode.
 */
class UserCard extends React.Component{

    constructor(props, context){
        super(props, context);
        this.state = {editForm: false};
    }


    render(){

        const {item} = this.props;
        let editableProps = {}, editForm;
        if(item._parent && item._parent.id === 'ext'){
            editableProps = {
                userEditable: true,
                onDeleteAction: () => {this.props.onDeleteAction(item._parent, [item])},
                onEditAction: () => {this.setState({editForm: true})},
                reloadAction: () => {this.props.onUpdateAction(item)}
            };
        }

        if(this.state.editForm){
            editForm = (
                <AsyncComponent
                    namespace="PydioForm"
                    componentName="UserCreationForm"
                    pydio={this.props.pydio}
                    zDepth={0}
                    style={{height:500}}
                    newUserName={item.id}
                    editMode={true}
                    userData={item}
                    onUserCreated={() => {this.props.onUpdateAction(item); this.setState({editForm:false}) }}
                    onCancel={() => {this.setState({editForm:false})}}
                />
            );
        }

        return (
            <div>
                <UserAvatar
                    userId={this.props.item.id}
                    richCard={true}
                    pydio={this.props.pydio}
                    cardSize={this.props.style.width}
                    {...editableProps}
                >{editForm}</UserAvatar>
            </div>
        );
    }

}

UserCard.propTypes = {
    /**
     * Pydio instance
     */
    pydio: React.PropTypes.instanceOf(Pydio),
    /**
     * Team data object
     */
    item: React.PropTypes.object,
    /**
     * Applied to root container
     */
    style: React.PropTypes.object,
    /**
     * Called to dismiss the popover
     */
    onRequestClose: React.PropTypes.func,
    /**
     * Delete current team
     */
    onDeleteAction: React.PropTypes.func,
    /**
     * Update current team
     */
    onUpdateAction: React.PropTypes.func
};


export {UserCard as default}
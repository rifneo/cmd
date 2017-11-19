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

import PluginsList from '../core/PluginsList'
import PluginEditor from '../core/PluginEditor'

const AuthenticationPluginsDashboard = React.createClass({

    mixins:[AdminComponents.MessagesConsumerMixin],

    openSelection: function(node){
        this.props.openRightPane({
            COMPONENT:PluginEditor,
            PROPS:{
                rootNode:node,
                docAsAdditionalPane:true,
                className:"vertical edit-plugin-inpane",
                closeEditor:this.props.closeRightPane
            },
            CHILDREN:null
        });
    },

    getInitialState: function(){
        return {authfrontNode: new AjxpNode('/plugins/manager/authfront')};
    },

    render:function(){
        const pluginsList = <PluginsList
            title={this.context.getMessage('plugtype.title.authfront', '')}
            dataModel={this.props.dataModel}
            node={this.state.authfrontNode}
            rootNode={this.state.authfrontNode}
            openSelection={this.openSelection}
        />;
        return (
            <PluginEditor
                {...this.props}
                style={{...this.props.style, backgroundColor:'#f4f4f4'}}
                additionalPanes={{top:[pluginsList], bottom:[]}}
                tabs={[
                    {label:this.context.getMessage('plugins.1'), groups:[0,1,2,6]}, // general
                    {label:this.context.getMessage('plugins.2'), groups:[3]}, // master driver
                    {label:this.context.getMessage('plugins.3'), groups:[4,5]} // secondary driver
                ]}
            />
        );
    }

});

export {AuthenticationPluginsDashboard as default}
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

    let pydio = global.pydio;

    class Callbacks{

        static runAll(){
            PydioApi.getClient().request({
                get_action:'scheduler_runAll'
            });
        }
        
        static generateCron() {

            pydio.UI.openComponentInModal('SchedulerActions', 'CronDialog');

        }

        static runTask(manager, args){

            var userSelection;
            if(args && args.length){
                userSelection = args[0];
            }else{
                userSelection =  pydio.getUserSelection();
            }
            var taskId = PathUtils.getBasename(userSelection.getUniqueNode().getPath());
            PydioApi.getClient().request({
                get_action:'scheduler_runTask',
                task_id:taskId
            });
        }

        static removeTask(manager, args){

            var userSelection;
            if(args && args.length){
                userSelection = args[0];
            }else{
                userSelection =  pydio.getUserSelection();
            }
            PydioApi.getClient().request({
                get_action : 'scheduler_removeTask',
                task_id: PathUtils.getBasename(userSelection.getUniqueNode().getPath())
            });

        }
        
        static stopTask(manager, args){

            var userSelection;
            if(args && args.length){
                userSelection = args[0];
            }else{
                userSelection =  pydio.getUserSelection();
            }
            var taskId = userSelection.getUniqueNode().getMetadata().get("task_id");
            var task = new PydioTasks.Task({id:taskId});
            task.stop();
            
        }
        
    }

    /**
     * Sample Dialog class used for reference only, ready to be
     * copy/pasted :-)
     */
    const CronDialog = React.createClass({

        mixins:[
            PydioReactUI.ActionDialogMixin,
            PydioReactUI.CancelButtonProviderMixin
        ],

        getDefaultProps: function(){
            return {
                dialogTitle: "Cron Expression",
                dialogIsModal: false,
                dialogSize: 'md'
            };
        },

        componentDidMount: function(){
            PydioApi.getClient().request({get_action:'scheduler_generateCronExpression'}, (transport)=>{
                this.setState({cronExpression: transport.responseText});
            });

        },

        submit(){
            this.dismiss();
        },
        render: function(){
            const {ClipboardTextField} = PydioComponents;
            if(this.state && this.state.cronExpression){
                return (
                    <div style={{width:'100%'}}>
                        <ClipboardTextField
                            fullWidth={true}
                            inputValue={this.state.cronExpression}
                            getMessage={(id)=>{return pydio.MessageHash[id]}}
                            multiLine={true}
                            maxRows={5}
                        />
                    </div>
                );
            }else{
                return <div>Loading...</div>;
            }
        }

    });



    global.SchedulerActions = {
        Callbacks: Callbacks,
        CronDialog: CronDialog
    };

})(window)
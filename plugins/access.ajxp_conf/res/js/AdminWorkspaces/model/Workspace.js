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

class Workspace extends Observable{

    constructor(wsId, paramsEditable = true){
        super();
        this.wsId = wsId;
        this.loaded=false;
        this.options=new Map();
        this.xmlData=null;
        this.tplParams=null;
        this.editable=paramsEditable;
    }

    static loadAvailableDrivers(callback){

        Workspace.DRIVERS = new Map();
        Workspace.TEMPLATES = new Map();

        PydioApi.getClient().request({get_action:'edit', sub_action:'get_drivers_definition'}, function(transport){
            var xmlData = transport.responseXML;
            var root = XMLUtils.XPathSelectSingleNode(xmlData, "drivers");
            if(root.getAttribute("allowed") == "false"){
                this.DRIVERS.NOT_ALLOWED = true;
            }
            var driverNodes = XMLUtils.XPathSelectNodes(xmlData, "drivers/ajxpdriver");
            for(var i=0;i<driverNodes.length;i++){
                var driver = driverNodes[i];
                var driverDef = {};
                var driverLabel = XMLUtils.XPathGetSingleNodeText(driver, "@label");
                var driverName = XMLUtils.XPathGetSingleNodeText(driver, "@name");
                var driverParams = XMLUtils.XPathSelectNodes(driver, "param");

                // Ignore "Pages" drivers
                if(!driverName || driverName.startsWith('ajxp_')) continue;

                driverDef['label'] = driverLabel;
                driverDef['description'] = XMLUtils.XPathGetSingleNodeText(driver, "@description");
                driverDef['name'] = driverName;
                var driverParamsArray = [];
                for(var j=0;j<driverParams.length;j++){
                    var paramNode = driverParams[j];
                    /*
                     if(this.currentCreateRepoType == "template" && paramNode.getAttribute('no_templates') == 'true'){
                     continue;
                     }else if(this.currentCreateRepoType == "repository" && paramNode.getAttribute('templates_only') == 'true'){
                     continue;
                     }
                     */
                    driverParamsArray.push(PydioForm.Manager.parameterNodeToHash(paramNode));
                }
                driverDef['params'] = driverParamsArray;
                this.DRIVERS.set(driverName, driverDef);
            }
            PydioApi.getClient().request({get_action:'edit', sub_action:'get_templates_definition'}, function(transport){
                xmlData = transport.responseXML;
                var driverNodes = XMLUtils.XPathSelectNodes(xmlData, "repository_templates/template");
                for(var i=0;i<driverNodes.length;i++){
                    var driver = driverNodes[i];
                    var driverDef = {};
                    var driverName = XMLUtils.XPathGetSingleNodeText(driver, "@repository_id");
                    driverDef['label'] = XMLUtils.XPathGetSingleNodeText(driver, "@repository_label");
                    driverDef['type'] = XMLUtils.XPathGetSingleNodeText(driver, "@repository_type");
                    driverDef['name'] = driverName;
                    var driverParams = XMLUtils.XPathSelectNodes(driver, "option");
                    var optionsList = [];
                    for(var k=0;k<driverParams.length;k++){
                        optionsList.push(driverParams[k].getAttribute("name"));
                    }
                    driverDef['options'] = optionsList;
                    this.TEMPLATES.set(driverName, driverDef);
                }
                callback();
            }.bind(this) );
        }.bind(Workspace) );


    }

    isEditable(){
        return this.editable;
    }

    getOption(keyName, copyObject=false){
        if(copyObject){
            return LangUtils.deepCopy(this.options.get(keyName));
        }else{
            return this.options.get(keyName);
        }
    }

    getDriverLabel(){
        return XMLUtils.XPathGetSingleNodeText(this.xmlData, "admin_data/ajxpdriver/@label");
    }

    getDriverDescription(){
        return XMLUtils.XPathGetSingleNodeText(this.xmlData, "admin_data/ajxpdriver/@description");
    }

    getDriverIconClass(){
        var iClass = XMLUtils.XPathGetSingleNodeText(this.xmlData, "admin_data/ajxpdriver/@iconClass");
        return iClass ? iClass : 'icon-hdd';
    }

    supportsFoldersBrowsing(){
        return !XMLUtils.XPathGetSingleNodeText(this.xmlData, "admin_data/repository/@securityScope");
    }

    getDescriptionFromDriverTemplate(){
        var tpl = XMLUtils.XPathGetSingleNodeText(this.xmlData, "admin_data/ajxpdriver/@description_template");
        if(!tpl) return "";
        var options = tpl.match(/{[a-zA-Z\-_]*}/g);
        var doptions = this.options;
        if(options){
            options.map(function(o){
                var oName = o.replace('{','').replace('}','');
                tpl = tpl.replace(o, doptions.get(oName)? doptions.get(oName) : '');
            });
        }
        var vars = {AJXP_DATA_PATH:'PYDIO_DATA', AJXP_USER:'[USERNAME]', AJXP_GROUP_PATH:'[GROUP PATH]', AJXP_GROUP_PATH_FLAT:'[GROUPNAME]'};
        for (var t in vars){
            if(vars.hasOwnProperty(t)) tpl = tpl.replace(t, vars[t]);
        }
        return tpl;
    }

    getPermissionMask(){
        var node = XMLUtils.XPathSelectSingleNode(this.xmlData, "admin_data/additional_info/mask");
        if(node && node.firstChild && node.firstChild.nodeValue){
            return JSON.parse(node.firstChild.nodeValue);
        }else{
            return {};
        }
    }

    getSingleNodeTextFromXML(xPath){
        return  XMLUtils.XPathGetSingleNodeText(this.xmlData, xPath);
    }

    getMetaSourceLabel(metaKey){
        return XMLUtils.XPathSelectSingleNode(this.xmlData, 'admin_data/metasources/meta[@id="'+metaKey+'"]/@label').nodeValue;
    }

    getMetaSourceDescription(metaKey){
        return XMLUtils.XPathSelectSingleNode(this.xmlData, 'admin_data/metasources/meta[@id="'+metaKey+'"]/@description').nodeValue;
    }

    getAllMetaSources(){
        var choices = XMLUtils.XPathSelectNodes(this.xmlData, 'admin_data/metasources/meta');
        return Array.from(choices).map(function(cNode){
            return {id:cNode.getAttribute('id'), label:cNode.getAttribute('label')};
        });
    }

    addMetaSource(metaKey){
        var sources = this.options.get('META_SOURCES');
        // Compute default values
        var values = {};
        var metaDefNodes = XMLUtils.XPathSelectNodes(this.xmlData, 'admin_data/metasources/meta[@id="'+metaKey+'"]/param');
        for(var i=0;i<metaDefNodes.length;i++){
            var param = PydioForm.Manager.parameterNodeToHash(metaDefNodes[i]);
            if(param['default']){
                values[param['name']] = param['default'];
            }
        }
        sources[metaKey] = values;
    }

    removeMetaSource(metaKey){
        var sources = this.options.get('META_SOURCES');
        delete sources[metaKey];
    }

    isTemplateChild(){
        return this.tplParams !== null;
    }

    isTemplate(){
        return this.options.get("isTemplate") == "true";
    }

    resetFromXml(){
        this.parseXml(null);
    }

    parseXml(xmlData, callback=null){
        if(xmlData){
            this.xmlData = xmlData;
        }else{
            xmlData = this.xmlData;
        }
        var repoNode = XMLUtils.XPathSelectSingleNode(xmlData, 'admin_data/repository');
        var options = new Map(), att;
        for(var i=0; i < repoNode.attributes.length; i++){
            att = repoNode.attributes.item(i);
            options.set(att.nodeName, att.nodeValue);
        }
        Array.from(repoNode.childNodes).map(function(child){
            if(child.nodeName != 'param') return;
            if(child.firstChild){
                if(child.getAttribute("name") == "META_SOURCES"){
                    options.set(child.getAttribute("name"), JSON.parse(child.firstChild.nodeValue));
                }else{
                    options.set(child.getAttribute("name"), child.firstChild.nodeValue);
                }
            }else{
                options.set(child.getAttribute('name'), child.getAttribute('value'));
            }
        });
        var tplParams = XMLUtils.XPathSelectNodes(this.xmlData, "admin_data/template/option");
        if(tplParams.length){
            var tplParamNames = {};
            for(var k=0;k<tplParams.length;k++) {
                if(tplParams[k].getAttribute("name")){
                    tplParamNames[tplParams[k].getAttribute("name")] = true;
                }
            }
            this.tplParams = tplParamNames;
        }
        if(!options.get('META_SOURCES')) options.set('META_SOURCES', {});
        this.options = options;
        this.loaded=true;
        this.notify('loaded');
        if(callback) callback(this);
    }

    load(callback){
        PydioApi.getClient().request({
            get_action:'edit',
            sub_action:'edit_repository',
            repository_id:this.wsId
        }, function(transport){
            this.parseXml(transport.responseXML, callback);
        }.bind(this));
    }

    buildEditor(type, formDefs, formValues, saveData, templateAllFormDefs){
        //var formDefs = [], formValues = {};
        if(type == 'driver' || type=='general'){
            var currentRepoIsTemplate = this.isTemplate();
            if(type == 'general'){
                if(currentRepoIsTemplate){
                    formDefs.push({name:'TEMPLATE_ID', type:'string', label:'Unique Identifier', description:'Internal Identifier', readonly:true});
                    formDefs.push({name:'TEMPLATE_LABEL', type:'string', label:'Label', description:'Human-readable label for this template', mandatory:true});
                    formValues['TEMPLATE_ID'] = this.wsId;
                    formValues['TEMPLATE_LABEL'] = this.getOption('display');

                }else{
                    formDefs.push({name:'WORKSPACE_ID', type:'string', label:'Unique Identifier', description:'Internal Identifier, can be used to build API calls, but the Alias should be preferred.', readonly:true});
                    formDefs.push({name:'WORKSPACE_LABEL', type:'string', label:'Label', description:'Human-readable label for this template', mandatory:true});
                    formValues['WORKSPACE_ID'] = this.wsId;
                    formValues['WORKSPACE_LABEL'] = this.getOption('display');
                }
            }
            var driverParams = XMLUtils.XPathSelectNodes(this.xmlData, "admin_data/ajxpdriver/param");
            for(var i=0;i<driverParams.length;i++){
                var hashedParams = PydioForm.Manager.parameterNodeToHash(driverParams[i]);
                var generalScope = (hashedParams['no_templates'] || hashedParams['templates_only']);
                if(type=='general' && !generalScope) continue;
                if(type=='driver' && generalScope) continue;
                if(this.tplParams && this.tplParams[hashedParams['name']]) continue;
                if(currentRepoIsTemplate && hashedParams['no_templates'] == 'true') {
                    continue;
                }else if(!currentRepoIsTemplate && hashedParams['templates_only'] == 'true'){
                    continue;
                }

                if(templateAllFormDefs) templateAllFormDefs.push(hashedParams);
                if(currentRepoIsTemplate && type == 'driver' && !this.options.has(hashedParams['name']) ){
                    continue;
                }

                var paramName = hashedParams['name'];
                if(this.options.get(paramName)){
                    formValues[paramName] = this.options.get(paramName);
                }
                if(!generalScope && !hashedParams['group']){
                    hashedParams['group'] = 'Driver Options';
                }else if(generalScope){
                    hashedParams['group'] = '';
                }
                formDefs.push(hashedParams);
            }
        }else{
            var metaLabel = this.getMetaSourceLabel(type);
            var metaDefNodes = XMLUtils.XPathSelectNodes(this.xmlData, 'admin_data/metasources/meta[@id="'+type+'"]/param');
            for(i=0;i<metaDefNodes.length;i++){
                var param = PydioForm.Manager.parameterNodeToHash(metaDefNodes[i]);
                param['group'] = metaLabel;
                formDefs.push(param);
            }
            var values = this.options.get('META_SOURCES')[type];
            for(var key in values){
                if(values.hasOwnProperty(key)){
                    formValues[key] = values[key];
                }
            }
        }
        if(saveData && saveData[type]){
            var saveValues = saveData[type];
            for(var skey in saveValues){
                if(saveValues.hasOwnProperty(skey)){
                    formValues[skey] = saveValues[skey];
                }
            }
        }
    }

    static buildEditorStatic(driverParams, formDefs, formValues, type='general', isTemplate=false){

        if(type == 'general' || type =='mixed'){
            var labelField;
            if(isTemplate){
                labelField = {name:'DISPLAY', type:'string', label:'Label', description:'The template label', mandatory:true};
            }else{
                labelField = {name:'DISPLAY', type:'string', label:'Label', description:'The workspace label', mandatory:true};
            }
            formDefs.push(labelField);
        }

        for(var i=0;i<driverParams.length;i++){
            var hashedParams = LangUtils.deepCopy(driverParams[i]);
            var generalScope = (hashedParams['no_templates'] || hashedParams['templates_only']);
            if(type=='general' && !generalScope) continue;
            if(type=='driver' && generalScope) continue;
            if(isTemplate && hashedParams['no_templates'] == 'true'){
                continue;
            }else if(!isTemplate && hashedParams['templates_only'] == 'true'){
                continue;
            }
            var paramName = hashedParams['name'];
            if(formValues[paramName] === undefined && hashedParams['default']){
                formValues[paramName] = hashedParams['default'];
            }
            if(!generalScope && !hashedParams['group']){
                hashedParams['group'] = 'Driver Options';
            }else if(generalScope){
                hashedParams['group'] = '';
            }
            formDefs.push(hashedParams);
        }

    }

    loadWorkspaceInfo(callback){
        if(this.wsInfo){
            callback(this.wsInfo);
            return;
        }
        PydioApi.getClient().request({
            get_action:'load_repository_info',
            tmp_repository_id:this.wsId,
            collect:'true'
        }, function(transport){
            this.wsInfo = transport.responseJSON;
            callback(transport.responseJSON);
        }.bind(this), {discrete:true});
    }

}

export {Workspace as default}
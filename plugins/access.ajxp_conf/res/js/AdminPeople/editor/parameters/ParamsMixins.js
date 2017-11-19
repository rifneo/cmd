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

import EditorCache from '../util/EditorCache'

export default {

    browseParams: function(roleData, parentData, wsId, render, filter, type='parameter', includeGlobal=false, splitInherited=false){
        var parameters = [];
        var inheritedParams = [];
        if(!roleData) {
            if(splitInherited) return [parameters,[]];
            else return parameters;
        }
        var params = roleData[wsId] || {};
        var child = roleData[wsId] || {};
        if(includeGlobal && (wsId.indexOf('AJXP_REPO_SCOPE_') == -1)){
            var global = roleData["AJXP_REPO_SCOPE_ALL"] || {};
            params = LangUtils.mergeObjectsRecursive(global, params);
        }
        for (var pluginName in params){
            if(!params.hasOwnProperty(pluginName)) continue;
            if(filter && filter(wsId, pluginName, null) === false) continue;
            for(var paramName in params[pluginName]){
                if(!params[pluginName].hasOwnProperty(paramName)) continue;
                if(filter && filter(wsId, pluginName, paramName) === false) continue;
                var paramAttributes = {label:paramName};
                var paramValue = params[pluginName][paramName];
                var inherited = true;
                try{
                    var attributes = EditorCache.CACHE[(type=='parameter'?'PARAMETERS':'ACTIONS')].get(pluginName).get(paramName);
                    if(attributes) paramAttributes = attributes;
                }catch(e){}
                try{
                    var inChild = (child[pluginName][paramName] !== undefined);
                    if(inChild){
                        inherited = false;
                    }
                }catch(e){}
                if(!inherited){
                    // Check in parentData
                    var inParent = inChild = false;
                    try{
                        inParent = (parentData[wsId][pluginName][paramName] !== undefined);
                        if(inParent){
                            var inParentValue = parentData[wsId][pluginName][paramName];
                            var inChildValue = roleData[wsId][pluginName][paramName];
                            if(inChildValue == inParentValue){
                                inherited = true;
                            }
                        }
                    }catch(e){}
                }
                if(inherited){
                    // Ignore specific unique scopes
                    if(paramAttributes.scope && (paramAttributes.scope == "role" || paramAttributes.scope == "group")) continue;
                    inheritedParams.push(render(pluginName, paramName, params[pluginName][paramName], paramAttributes, inherited, type));
                }else{
                    parameters.push(render(pluginName, paramName, params[pluginName][paramName], paramAttributes, inherited, type));
                }
            }
        }
        if(splitInherited) return [parameters, inheritedParams];
        else return parameters.concat(inheritedParams);
    }

};

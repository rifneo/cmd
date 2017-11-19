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



import React, {Component} from 'react';

class Editor extends Component {

    static get styles() {
        return {
            iframe: {
                border: 0,
                flex: 1
            }
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            frameSrc: null
        }
    }

    componentDidMount(){
        const {pydio, node} = this.props;
        const configs = pydio.getPluginConfigs("editor.browser");

        if (node.getAjxpMime() == "url" || node.getAjxpMime() == "website") {
            this.openBookmark(node, configs);
        } else {
            this.openNode(node, configs);
        }
    }

    openBookmark(node, configs) {

        let alwaysOpenLinksInBrowser = (configs.get('OPEN_LINK_IN_TAB') === 'browser');

        PydioApi.getClient().request({
            get_action:'get_content',
            file:node.getPath()
        }, ({responseText: url}) => {
            if (url.indexOf('URL=') !== -1) {
                url = url.split('URL=')[1];
                if(url.indexOf('\n') !== -1){
                    url = url.split('\n')[0];
                }
            }
            this._openURL(url, alwaysOpenLinksInBrowser, true);
        })
    }

    openNode(node, configs) {

        const {pydio} = this.props

        const repo = pydio.user.getActiveRepository();
        const loc = document.location.href.split('?').shift().split('#').shift();
        let url = loc.substring(0, loc.lastIndexOf('/'));
        if (document.getElementsByTagName('base').length) {
            url = document.getElementsByTagName('base')[0].href;
            if(url.substr(-1) == '/') url = url.substr(0, url.length - 1);
        }
        url = LangUtils.trimRight(url, "\/")
        const ajxpServerAccess = pydio.Parameters.get('ajxpServerAccess')
        const path = encodeURIComponent(node.getPath())
        const open_file_url = `${url}/${ajxpServerAccess}&get_action=open_file&repository_id=${repo}&file=${path}`;
        const alwaysOpenDocsInBrowser = configs.get('OPEN_DOCS_IN_TAB') === "browser";

        this._openURL(open_file_url, alwaysOpenDocsInBrowser, false);

    }

    _openURL(url, modal=false, updateTitle = false) {
        if(modal){
            global.open(url, '', "location=yes,menubar=yes,resizable=yes,scrollbars=yes,toolbar=yes,status=yes");
            if (this.props.onRequestTabClose) {
                this.props.onRequestTabClose();
            }
        }else{
            if (updateTitle && this.props.onRequestTabTitleUpdate) {
                this.props.onRequestTabTitleUpdate(url);
            }
            this.setState({frameSrc:url});
        }
    }

    render() {
        return (
            <iframe  style={Editor.styles.iframe} src={this.state.frameSrc} />
        )
    }
}

window.PydioBrowserEditor = {
    Editor: Editor
}

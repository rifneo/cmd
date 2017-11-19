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

import MetaSourceForm from './meta/MetaSourceForm'
import Dashboard from './board/Dashboard'
import Workspace from './model/Workspace'
import SharesList from './panel/SharesList'
import TplFieldsChooser from './editor/TplFieldsChooser'
import MetaList from './meta/MetaList'
import WorkspaceSummary from './panel/WorkspaceSummary'
import WorkspaceEditor from './editor/WorkspaceEditor'

window.AdminWorkspaces = {
    MetaSourceForm,
    Dashboard,
    Workspace,
    SharesList,
    TplFieldsChooser,
    MetaList,
    WorkspaceSummary,
    WorkspaceEditor
};
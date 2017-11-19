<?php
/*
 * Copyright 2007-2017 Abstrium <contact (at) pydio.com>
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
namespace Pydio\Access\Core\Model;

use Pydio\Core\Utils\Vars\XMLFilter;
use Pydio\Core\Http\Response\JSONSerializableResponseChunk;
use Pydio\Core\Http\Response\XMLSerializableResponseChunk;

use Pydio\Core\Serializer\NodeXML;
use Pydio\Core\Services\LocaleService;
use Pydio\Core\Utils\Vars\StringHelper;

defined('AJXP_EXEC') or die('Access not allowed');

/**
 * Class NodesDiff
 * Http Response describing a node change in the datamodel
 * @package Pydio\Access\Core\Model
 */
class NodesDiff implements XMLSerializableResponseChunk, JSONSerializableResponseChunk
{
    /**
     * @var AJXP_Node[] Array of new nodes added, indexes are numeric.
     */
    private $added;

    /**
     * @var AJXP_Node[] Array of nodes updated, INDEXED by their original path.
     */
    private $updated;

    /**
     * @var string[] Array of removed nodes PATHES.
     */
    private $removed;

    /**
     * NodesDiff constructor.
     */
    public function __construct()
    {
        $this->added = [];
        $this->updated = [];
        $this->removed = [];
    }

    /**
     * @return bool
     */
    public function isEmpty(){
        return !(count($this->added) || count($this->updated) || count($this->removed));
    }

    /**
     * @param AJXP_Node|AJXP_Node[] $nodes
     * @return NodesDiff
     */
    public function add($nodes){
        if(!is_array($nodes)) $nodes = [$nodes];
        $this->added = array_merge($this->added, $nodes);
        return $this;
    }

    /**
     * @param AJXP_Node|AJXP_Node[] $nodes
     * @param string|null $originalPath
     * @return NodesDiff
     */
    public function update($nodes, $originalPath = null){
        if(!is_array($nodes)) {
            if($originalPath === null){
                $originalPath = $nodes->getPath();
            }
            $nodes = [$originalPath => $nodes];
        }
        $this->updated = array_merge($this->updated, $nodes);
        return $this;
    }

    /**
     * @param string|string[] $nodePathes
     * @return NodesDiff
     */
    public function remove($nodePathes){
        if(!is_array($nodePathes)) $nodePathes = [$nodePathes];
        $this->removed = array_merge($this->removed, $nodePathes);
        return $this;
    }

    /**
     * @param AJXP_Node $ajxpNode
     */
    protected function forceLoadNodeInfo(&$ajxpNode){
        $mess = LocaleService::getMessages();
        $ajxpNode->loadNodeInfo(false, false, "all");
        if (!empty($ajxpNode->metaData["mimestring_id"]) && array_key_exists($ajxpNode->metaData["mimestring_id"], $mess)) {
            $ajxpNode->mergeMetadata(array("mimestring" =>  $mess[$ajxpNode->metaData["mimestring_id"]]));
        }
        // Add Repository to the metadata
        $ajxpNode->mergeMetadata(array("node_repository_id" => $ajxpNode->getRepositoryId()));
    }

    /**
     * @return string
     */
    public function toXML()
    {
        $buffer = "<nodes_diff>";
        if (count($this->removed)) {
            $buffer .= "<remove>";
            foreach ($this->removed as $nodePath) {
                $nodePath = StringHelper::xmlEntities($nodePath, true);
                $buffer .= "<tree filename=\"$nodePath\" ajxp_im_time=\"".time()."\"/>";
            }
            $buffer .= "</remove>";
        }
        if (count($this->added)) {
            $buffer .= "<add>";
            foreach ($this->added as $ajxpNode) {
                $this->forceLoadNodeInfo($ajxpNode);
                $buffer .= NodeXML::toXML($ajxpNode, true);
            }
            $buffer .= "</add>";
        }
        if (count($this->updated)) {
            $buffer .= "<update>";
            foreach ($this->updated as $originalPath => $ajxpNode) {
                $this->forceLoadNodeInfo($ajxpNode);
                $ajxpNode->original_path = $originalPath;
                $buffer .= NodeXML::toXML($ajxpNode, true);
            }
            $buffer .= "</update>";
        }
        $buffer .= "</nodes_diff>";
        return $buffer;
    }

    /**
     * @return mixed
     */
    public function jsonSerializableData()
    {
        $output = [];
        if (count($this->removed)) {
            $output['remove'] = [];
            foreach ($this->removed as $nodePath) {
                $output['remove'][] = ["path"=>$nodePath, "ajxp_im_time"=>time()];
            }
        }
        if (count($this->added)) {
            $output['add'] = [];
            foreach ($this->added as $ajxpNode) {
                $this->forceLoadNodeInfo($ajxpNode);
                $output['add'][] = $ajxpNode;
            }
        }
        if (count($this->updated)) {
            $output['update'] = [];
            foreach ($this->updated as $originalPath => $ajxpNode) {
                $this->forceLoadNodeInfo($ajxpNode);
                $ajxpNode->original_path = $originalPath;
                $output['update'][] = $ajxpNode;
            }
        }
        return $output;
    }

    /**
     * @return string
     */
    public function jsonSerializableKey()
    {
        return "nodesDiff";
    }
}
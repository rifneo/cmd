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

namespace Pydio\Core\Http\Cli;

defined('AJXP_EXEC') or die('Access not allowed');

/**
 * Class CliServer
 * @package Pydio\Core\Http\Cli
 */
class CliServer extends \Pydio\Core\Http\Server
{
    protected function stackMiddleWares()
    {
        $this->middleWares->push(array("Pydio\\Core\\Controller\\Controller", "registryActionMiddleware"));
        $this->middleWares->push(array("Pydio\\Core\\Http\\Cli\\AuthCliMiddleware", "handleRequest"));
        $this->topMiddleware = new CliMiddleware();
        $this->middleWares->push(array($this->topMiddleware, "handleRequest"));
    }
}
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
 * The latest code can be found at <https://pydio.com/>.
 */
namespace Pydio\Access\Driver\DataProvider\Provisioning;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Pydio\Access\Core\Model\AJXP_Node;
use Pydio\Access\Core\Model\NodesList;
use Pydio\Access\Core\Model\UserSelection;
use Pydio\Core\Controller\ProgressBarCLI;
use Pydio\Core\Exception\PydioException;
use Pydio\Core\Exception\UserNotFoundException;
use Pydio\Core\Http\Message\ReloadMessage;
use Pydio\Core\Http\Message\UserMessage;
use Pydio\Core\Http\Message\XMLDocMessage;
use Pydio\Core\Http\Message\XMLMessage;
use Pydio\Core\Http\Response\SerializableResponseStream;
use Pydio\Core\Model\Context;
use Pydio\Core\Model\ContextInterface;
use Pydio\Core\Model\UserInterface;
use Pydio\Core\Services\ApplicationState;
use Pydio\Core\Services\AuthService;
use Pydio\Core\Services\ConfService;
use Pydio\Core\Services\LocaleService;
use Pydio\Core\Services\RolesService;
use Pydio\Core\Services\UsersService;
use Pydio\Core\Utils\Vars\InputFilter;
use Pydio\Core\Utils\Vars\PathUtils;
use Pydio\Core\Utils\Vars\StatHelper;
use Pydio\Log\Core\Logger;

defined('AJXP_EXEC') or die('Access not allowed');

/**
 * Class UsersManager
 * @package Pydio\Access\Driver\DataProvider\Provisioning
 */
class UsersManager extends AbstractManager
{

    /**
     * @param ServerRequestInterface $requestInterface
     * @param ResponseInterface $responseInterface
     * @return ResponseInterface
     * @throws PydioException
     */
    public function peopleApiActions(ServerRequestInterface $requestInterface, ResponseInterface $responseInterface){

        $a = $requestInterface->getAttribute("action");
        $vars = $requestInterface->getParsedBody();
        $path = $vars["path"];
        if($a === "people-create-resource"){
            if($vars["resourceType"] === "user"){
                // Create a user
                $uLogin = basename($path);
                $gPath  = dirname($path);
                if($gPath === '.' || $gPath === '/.'  || empty($gPath)) $gPath = "/";
                $requestInterface = $requestInterface
                    ->withAttribute("action", "create_user")
                    ->withParsedBody([
                        "new_user_login" => $uLogin,
                        "new_user_pwd"   => $vars["userPass"],
                        "group_path"     => $gPath
                    ]);
            }else{
                // Create a group
                $requestInterface = $requestInterface
                    ->withAttribute("action", "create_group")
                    ->withParsedBody([
                        "group_path"  => $path,
                        "group_label" => $vars["groupLabel"]
                    ]);
            }
            return $this->usersActions($requestInterface, $responseInterface);
            
        }else if($a === "people-delete-resource"){

            $baseName = basename($path);
            $vars = [];
            if(UsersService::userExists($baseName)){
                $vars["user_id"] = $baseName;
            }else{
                $vars["group"] = $path;
            }
            return $this->delete($requestInterface->withParsedBody($vars), $responseInterface);

        }else if($a === "people-patch-resource"){

            $path =  $vars["path"];
            $resType = $vars["request_body"]["resourceType"];
            $paramName = $vars["request_body"]["parameterName"];
            $paramValue = $vars["request_body"]["parameterValue"];
            if($resType === "group" && $paramName === "groupLabel"){

                $requestInterface = $requestInterface
                    ->withAttribute("action", "update_group_label")
                    ->withParsedBody(["group_label" => $paramValue, "group_path" => $path])
                ;

            }else if($resType === "user"){

                $newVars = ["user_id" => basename($path)];
                switch($paramName){
                    case "userPass":
                        $newVars["user_pwd"] = $paramValue;
                        $newAction = "update_user_pwd";
                        break;
                    case "userProfile":
                        $newAction = "update_user_profile";
                        $newVars["profile"] = $paramValue;
                        break;
                    case "userGroupPath":
                        $newAction = "user_update_group";
                        $newVars["file"] = basename($path);
                        $newVars["group_path"] = $paramValue;
                        break;
                    case "userLock":
                        list($lockType, $lockValue) = explode(":", $paramValue);
                        $newVars["lock_type"] = $lockType;
                        $newVars["lock"] = $lockValue;
                        $newAction = "user_set_lock";
                        break;
                    case "userAddRole":
                        $newVars["role_id"] = $paramValue;
                        $newAction = "user_add_role";
                        break;
                    case "userRemoveRole":
                        $newVars["role_id"] = $paramValue;
                        $newAction = "user_delete_role";
                        break;
                    case "userRoles":
                        $newVars["roles"] = json_encode($paramValue); // REENCODE JSON LIST OF ROLES
                        $newAction = "user_reorder_roles";
                        break;
                    case "userPreferences":
                        $newAction = "save_user_preference";
                        $i = 0;
                        foreach ($paramValue as $key => $val){
                            $newVars["pref_name_".$i] = $key;
                            $newVars["pref_value_".$i] = $val;
                            $i++;
                        }
                        break;
                    default:
                        throw new PydioException("Arguments mismatch");
                        break;
                }
                $requestInterface = $requestInterface
                    ->withAttribute("action", $newAction)
                    ->withParsedBody($newVars);

            }else{

                throw new PydioException("Arguments mismatch");

            }
            return $this->usersActions($requestInterface, $responseInterface);

        }

        return $responseInterface;
    }

    /**
     * @param ServerRequestInterface $requestInterface
     * @param ResponseInterface $responseInterface
     * @return ResponseInterface
     * @throws \Exception
     * @throws \Pydio\Core\Exception\UserNotFoundException
     */
    public function usersActions(ServerRequestInterface $requestInterface, ResponseInterface $responseInterface){

        $action     = $requestInterface->getAttribute("action");
        /** @var ContextInterface $ctx */
        $ctx        = $requestInterface->getAttribute("ctx");
        $httpVars   = $requestInterface->getParsedBody();
        $mess       = LocaleService::getMessages();
        $currentAdminBasePath = "/";
        $loggedUser = $ctx->getUser();
        if ($loggedUser!=null && $loggedUser->getGroupPath()!=null) {
            $currentAdminBasePath = $loggedUser->getGroupPath();
        }

        switch ($action){

            // USERS & GROUPS
            case "create_user" :

                if (!isset($httpVars["new_user_login"]) || $httpVars["new_user_login"] == ""
                    || !isset($httpVars["new_user_pwd"]) || $httpVars["new_user_pwd"] == "") {

                    throw new PydioException($mess["ajxp_conf.61"]);

                }
                $original_login = InputFilter::magicDequote($httpVars["new_user_login"]);
                $new_user_login = InputFilter::sanitize($original_login, InputFilter::SANITIZE_EMAILCHARS);
                if($original_login != $new_user_login){
                    throw new \Exception(str_replace("%s", $new_user_login, $mess["ajxp_conf.127"]));
                }
                if (UsersService::userExists($new_user_login, "w") || UsersService::isReservedUserId($new_user_login)) {
                    throw new \Exception($mess["ajxp_conf.43"]);
                }

                $newUser = UsersService::createUser($new_user_login, $httpVars["new_user_pwd"]);
                if (!empty($httpVars["group_path"])) {
                    $newUser->setGroupPath(rtrim($currentAdminBasePath, "/")."/".ltrim($httpVars["group_path"], "/"));
                } else {
                    $newUser->setGroupPath($currentAdminBasePath);
                }

                $newUser->save("superuser");

                $reloadMessage  = new ReloadMessage("", $new_user_login);
                $userMessage    = new UserMessage($mess["ajxp_conf.44"]);
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream([$reloadMessage, $userMessage]));

                break;

            case "create_group":

                if (isSet($httpVars["group_path"])) {
                    $basePath = PathUtils::forwardSlashDirname($httpVars["group_path"]);
                    if(empty($basePath)) $basePath = "/";
                    $gName = InputFilter::sanitize(InputFilter::decodeSecureMagic(basename($httpVars["group_path"])), InputFilter::SANITIZE_ALPHANUM);
                } else {
                    $basePath = substr($httpVars["dir"], strlen("/data/users"));
                    $gName    = InputFilter::sanitize(InputFilter::magicDequote($httpVars["group_name"]), InputFilter::SANITIZE_ALPHANUM);
                }
                $gLabel   = InputFilter::decodeSecureMagic($httpVars["group_label"]);
                $basePath = ($ctx->hasUser() ? $ctx->getUser()->getRealGroupPath($basePath) : $basePath);

                UsersService::createGroup($basePath, $gName, $gLabel);

                $reloadMessage  = new ReloadMessage();
                $userMessage    = new UserMessage($mess["ajxp_conf.160"]);
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream([$reloadMessage, $userMessage]));

                break;

            case "update_group_label":

                $currentMainUser = $ctx->getUser();
                $groupPath = InputFilter::securePath(InputFilter::sanitize($httpVars["group_path"], InputFilter::SANITIZE_DIRNAME));
                $filteredGroupPath = (!empty($currentMainUser) ? $currentMainUser->getRealGroupPath($groupPath) : $groupPath);
                ConfService::getConfStorageImpl()->relabelGroup($filteredGroupPath, InputFilter::sanitize($httpVars["group_label"], InputFilter::SANITIZE_FILENAME));
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage("Updated label for group ".$filteredGroupPath)));

                break;

            case "update_user_profile":

                if (!isSet($httpVars["user_id"]) || !isSet($httpVars["profile"]) || !UsersService::userExists($httpVars["user_id"]) || trim($httpVars["profile"]) == "") {
                    throw new PydioException($mess["ajxp_conf.61"]);
                }
                $profile    = InputFilter::sanitize($httpVars["profile"], InputFilter::SANITIZE_ALPHANUM);
                $userId     = InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS);
                $user       = $this->getUserIfAuthorized($ctx, $userId);

                $user->setProfile($profile);
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage("Updated profile for user ".$userId)));

                break;

            case "user_set_lock" :

                $userId     = InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS);
                $lock       = ($httpVars["lock"] == "true" ? true : false);
                $lockType   = $httpVars["lock_type"];
                $userObject = $this->getUserIfAuthorized($ctx, $userId);
                if ($lock) {
                    $userObject->setLock($lockType);
                    $message = str_replace(array("%1", "%2"), array($lockType, $userId), $mess["ajxp_conf.166"]);
                } else {
                    $userObject->removeLock($lockType);
                    $message = str_replace("%s", $userId, $mess["ajxp_conf.167"]);
                }
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream([new UserMessage($message)]));
                $userObject->save("superuser");

                break;

            case "change_admin_right" :

                $userId     = InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS);
                $user       = $this->getUserIfAuthorized($ctx, $userId);

                $user->setAdmin(($httpVars["right_value"]=="1"?true:false));
                $user->save("superuser");

                $reloadMessage  = new ReloadMessage();
                $userMessage    = new UserMessage($mess["ajxp_conf.45"].$httpVars["user_id"]);
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream([$reloadMessage, $userMessage]));

                break;

            case "user_update_right" :

                $userId         = isSet($httpVars["user_id"]) ? InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS) : null;
                $repositoryId   = isSet($httpVars["repository_id"]) ? InputFilter::sanitize($httpVars["repository_id"], InputFilter::SANITIZE_ALPHANUM) : null;
                $rightString    = isSet($httpVars["right"]) ? InputFilter::sanitize($httpVars["right"], InputFilter::SANITIZE_ALPHANUM) : null;

                if($userId === null || $repositoryId === null || $rightString === null || !UsersService::userExists($userId)) {

                    $userMessage    = new UserMessage($mess["ajxp_conf.61"], LOG_LEVEL_ERROR);
                    $xmlMessage     = new XMLMessage("<update_checkboxes user_id=\"".$userId."\" repository_id=\"".$repositoryId."\" read=\"old\" write=\"old\"/>");
                    $responseInterface = $responseInterface->withBody(new SerializableResponseStream([$userMessage, $xmlMessage]));
                    break;

                }
                $user = $this->getUserIfAuthorized($ctx, $userId, false);
                $user->getPersonalRole()->setAcl($repositoryId, $rightString);
                $user->save();
                if ($ctx->getUser()->getId() == $user->getId()) {
                    AuthService::updateSessionUser($user);
                }
                $userMessage    = new UserMessage($mess["ajxp_conf.46"].$userId);
                $xmlMessage     = new XMLMessage("<update_checkboxes user_id=\"".$userId."\" repository_id=\"".$repositoryId."\" read=\"".($user->canRead($repositoryId)?"1":"0")."\" write=\"".($user->canWrite($repositoryId)?"1":"0")."\"/>");
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream([$userMessage, $xmlMessage]));

                break;

            case "user_update_group":

                $userSelection = UserSelection::fromContext($ctx, $httpVars);
                $dir = $httpVars["dir"];
                $dest = $httpVars["dest"];
                if (isSet($httpVars["group_path"])) {
                    // API Case
                    $groupPath = $httpVars["group_path"];
                } else {
                    if (strpos($dir, "/data/users",0)!==0 || strpos($dest, "/data/users",0)!==0) {
                        break;
                    }
                    $groupPath = substr($dest, strlen("/data/users"));
                }

                $userId = null;
                $usersMoved = array();

                if (!empty($groupPath)) {
                    $targetPath = rtrim($currentAdminBasePath, "/")."/".ltrim($groupPath, "/");
                } else {
                    $targetPath = $currentAdminBasePath;
                }

                foreach ($userSelection->getFiles() as $selectedUser) {
                    $userId = InputFilter::sanitize(basename($selectedUser), InputFilter::SANITIZE_EMAILCHARS);
                    try{
                        $user = $this->getUserIfAuthorized($ctx, $userId);
                        $currentPath = $user->getGroupPath();
                        if($ctx->getUser()->getId() === $userId && (empty($currentPath) || $currentPath === "/") && $targetPath !== '/'){
                            throw new PydioException($mess["ajxp_conf.161"]);
                        }
                        $user->setGroupPath($targetPath, true);
                        $user->save("superuser");
                        $usersMoved[] = $user->getId();
                    }catch (UserNotFoundException $u){
                        continue;
                    }
                }
                $chunks = [];
                if(count($usersMoved)){
                    $chunks[] = new UserMessage(str_replace(array("%1", "%2"), array(count($usersMoved), $targetPath), $mess["ajxp_conf.168"]));
                    $chunks[] = new ReloadMessage($dest, $userId);
                    $chunks[] = new ReloadMessage();
                }else{
                    $chunks[] = new UserMessage($mess["ajxp_conf.169"], LOG_LEVEL_ERROR);
                }
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream($chunks));

                break;

            case "user_add_role" :
            case "user_delete_role":

                $userId         = isSet($httpVars["user_id"]) ? InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS) : null;
                $roleId         = isSet($httpVars["role_id"]) ? InputFilter::sanitize($httpVars["role_id"]) : null;

                if ($userId === null || $roleId === null || !UsersService::userExists($userId) || !RolesService::getRole($roleId)) {
                    throw new PydioException($mess["ajxp_conf.61"]);
                }
                $this->getUserIfAuthorized($ctx, $userId, false);
                if ($action == "user_add_role") {
                    $act = "add";
                    $messId = "73";
                } else {
                    $act = "remove";
                    $messId = "74";
                }
                $this->updateUserRole($ctx->getUser(), $userId, $roleId, $act);
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage($mess["ajxp_conf.".$messId].$userId)));

                break;

            case "user_reorder_roles":

                $userId         = isSet($httpVars["user_id"]) ? InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS) : null;
                $roles          = isSet($httpVars["roles"]) ? $httpVars["roles"] : null;

                if (empty($userId) || !UsersService::userExists($userId) || empty($roles)) {
                    throw new PydioException($mess["ajxp_conf.61"]);
                }
                $roles = json_decode($roles, true);
                $user = $this->getUserIfAuthorized($ctx, $userId, false);

                // UPDATE ROLES
                $currentRoles = array_filter(array_keys($user->getRoles()), function($rId){return strpos($rId, "AJXP_GRP_/")!==0 && strpos($rId, "AJXP_USR_/")!==0;});
                $newRoles = array_diff($roles, $currentRoles);
                foreach($newRoles as $r) {
                    $user->addRole(RolesService::getRole($r));
                }
                $removeRoles = array_diff($currentRoles, $roles);
                foreach($removeRoles as $r) {
                    $user->removeRole($r);
                }
                // REORDER ROLES
                $user->updateRolesOrder($roles);
                $user->save("superuser");
                if ($ctx->getUser()->getId() === $user->getId()) {
                    AuthService::updateSessionUser($user);
                }

                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage(str_replace("%s", $userId, $mess["ajxp_conf.163"]))));
                break;

            case "users_bulk_update_roles":

                $data               = json_decode($httpVars["json_data"], true);
                $userIds            = $data["users"];
                $rolesOperations    = $data["roles"];
                foreach($userIds as $userId){
                    $userId = InputFilter::sanitize($userId, InputFilter::SANITIZE_EMAILCHARS);
                    $userObject = $this->getUserIfAuthorized($ctx, $userId);
                    foreach($rolesOperations as $addOrRemove => $roles){
                        if(!in_array($addOrRemove, array("add", "remove"))) {
                            continue;
                        }
                        foreach($roles as $roleId){
                            if(strpos($roleId, "AJXP_USR_/") === 0 || strpos($roleId,"AJXP_GRP_/") === 0){
                                continue;
                            }
                            $roleId = InputFilter::sanitize($roleId, InputFilter::SANITIZE_FILENAME);
                            if ($addOrRemove == "add") {
                                $roleObject = RolesService::getRole($roleId);
                                $userObject->addRole($roleObject);
                            } else {
                                $userObject->removeRole($roleId);
                            }
                        }
                    }
                    $userObject->save("superuser");
                    if ($ctx->getUser()->getId() === $userObject->getId()) {
                        AuthService::updateSessionUser($userObject);
                    }
                }

                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage($mess["ajxp_conf.164"])));

                break;

            case "user_update_role" :

                $selection      = UserSelection::fromContext($ctx, $httpVars);
                $files          = $selection->getFiles();
                $detectedRoles  = array();
                $roleId         = null;

                if (isSet($httpVars["role_id"]) && isset($httpVars["update_role_action"])) {
                    $update = InputFilter::sanitize($httpVars["update_role_action"], InputFilter::SANITIZE_ALPHANUM);
                    $roleId = InputFilter::sanitize($httpVars["role_id"]);
                    if (RolesService::getRole($roleId) === false) {
                        throw new \Exception("Invalid role id");
                    }
                }
                foreach ($files as $index => $file) {
                    $userId = InputFilter::sanitize(basename($file), InputFilter::SANITIZE_EMAILCHARS);
                    if (isSet($update)) {
                        $userObject = $this->updateUserRole($ctx->getUser(), $userId, $roleId, $update);
                    } else {
                        try{
                            $userObject = UsersService::getUserById($userId);
                        }catch(UserNotFoundException $u){
                            continue;
                        }
                        if($ctx->hasUser() && !$ctx->getUser()->canAdministrate($userObject)){
                            continue;
                        }
                    }
                    if ($userObject->hasParent()) {
                        unset($files[$index]);
                        continue;
                    }
                    $userRoles = $userObject->getRoles();
                    foreach ($userRoles as $roleIndex => $bool) {
                        if(!isSet($detectedRoles[$roleIndex])) $detectedRoles[$roleIndex] = 0;
                        if($bool === true) $detectedRoles[$roleIndex] ++;
                    }
                }
                $count = count($files);
                $buffer = "<admin_data>";

                $buffer .= "<user><ajxp_roles>";
                foreach ($detectedRoles as $roleId => $roleCount) {
                    if($roleCount < $count) continue;
                    $buffer .= "<role id=\"$roleId\"/>";
                }
                $buffer .= "</ajxp_roles></user>";
                $buffer .= "<ajxp_roles>";
                foreach (RolesService::getRolesList(array(), !$this->listSpecialRoles) as $roleId => $roleObject) {
                    $buffer .= "<role id=\"$roleId\"/>";
                }
                $buffer .= "</ajxp_roles>";
                $buffer .= "</admin_data>";

                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new XMLDocMessage($buffer)));
                break;

            case "save_custom_user_params" :

                $userId = InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS);
                $currentIsLogged = false;
                if ($userId === $ctx->getUser()->getId()) {
                    $currentIsLogged = true;
                    $user = $ctx->getUser();
                } else {
                    $user = $this->getUserIfAuthorized($ctx, $userId);
                }

                $custom = $user->getPref("CUSTOM_PARAMS");
                if(!is_array($custom)) $custom = array();
                $options = $custom;
                $newCtx = new Context($userId, $ctx->getRepositoryId());
                $this->parseParameters($newCtx, $httpVars, $options, false, $custom);
                $custom = $options;
                $user->setPref("CUSTOM_PARAMS", $custom);
                $user->save();

                if ($currentIsLogged) {
                    AuthService::updateSessionUser($user);
                }

                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage($mess["ajxp_conf.47"].$userId)));

                break;
            
            case "update_user_pwd" :
                
                $userId = isSet($httpVars["user_id"]) ? InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS) : null;
                if (empty($userId) || !isSet($httpVars["user_pwd"]) || trim($httpVars["user_pwd"]) == "") {
                    throw new PydioException($mess["ajxp_conf.61"]);
                }
                $this->getUserIfAuthorized($ctx, $userId);
                $res = UsersService::updatePassword($userId, $httpVars["user_pwd"]);
                if($res !== true){
                    throw new PydioException($mess["ajxp_conf.49"].": $res");
                }
                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage($mess["ajxp_conf.48"].$userId)));

                break;

            case "save_user_preference":

                if (!isSet($httpVars["user_id"])) {
                    throw new PydioException($mess["ajxp_conf.61"]);
                }
                $userId = InputFilter::sanitize($httpVars["user_id"], InputFilter::SANITIZE_EMAILCHARS);
                if ($userId == $ctx->getUser()->getId()) {
                    $userObject = $ctx->getUser();
                } else {
                    $userObject = $this->getUserIfAuthorized($ctx, $userId);
                }

                $i = 0;
                while (isSet($httpVars["pref_name_".$i]) && isSet($httpVars["pref_value_".$i])) {
                    $prefName = InputFilter::sanitize($httpVars["pref_name_" . $i], InputFilter::SANITIZE_ALPHANUM);
                    $prefValue = InputFilter::sanitize(InputFilter::magicDequote($httpVars["pref_value_" . $i]));
                    if($prefName == "password") continue;
                    if ($prefName != "pending_folder" && $userObject == null) {
                        $i++;
                        continue;
                    }
                    $userObject->setPref($prefName, $prefValue);
                    $userObject->save("user");
                    $i++;
                }

                $responseInterface = $responseInterface->withBody(new SerializableResponseStream(new UserMessage($mess["ajxp_conf.165"])));

                break;

            case "cli_update_user_list":
                // Action for updating all Pydio's user from ldap in CLI mode
                if((php_sapi_name() == "cli")){
                    // TODO : UPGRADE THIS TO NEW CLI FORMAT
                    ApplicationState::$silenceInstantMessages = true;
                    $progressBar = new ProgressBarCLI();
                    $countCallback  = array($progressBar, "init");
                    $loopCallback   = array($progressBar, "update");
                    $bGroup = "/";
                    if($ctx->hasUser()) $bGroup = $ctx->getUser()->getGroupPath();
                    // Todo: switch to UsersService::browserUserGroupWithCallback()
                    UsersService::listUsers($bGroup, null, -1, -1, true, true, $countCallback, $loopCallback);
                }

                break;

            default:
                break;

        }

        return $responseInterface;
    }

    /**
     * @param ServerRequestInterface $requestInterface
     * @param ResponseInterface $responseInterface
     * @return ResponseInterface
     * @throws PydioException
     */
    public function delete(ServerRequestInterface $requestInterface, ResponseInterface $responseInterface){

        /** @var ContextInterface $ctx */
        $ctx        = $requestInterface->getAttribute("ctx");
        $mess       = LocaleService::getMessages();
        $httpVars   = $requestInterface->getParsedBody();
        $groups     = [];
        $users      = [];
        if(isSet($httpVars['group'])) {
            if(is_array($httpVars['group'])) $groups = $httpVars['group'];
            else $groups[] = $httpVars['group'];
            $groups = array_map(function ($g) {
                return InputFilter::sanitize($g, InputFilter::SANITIZE_DIRNAME);
            }, $groups);
        }else if(isSet($httpVars['user_id'])) {
            if(is_array($httpVars['user_id']))$users = $httpVars['user_id'];
            else $users[] = $httpVars['user_id'];
            $users = array_map(function ($u) {
                return InputFilter::sanitize($u, InputFilter::SANITIZE_EMAILCHARS);
            }, $users);
        }
        $resultMessage ='';
        if (count($groups)) {
            foreach($groups as $groupPath){
                $groupPath = preg_replace('/^\/data\/users/', '', $groupPath);
                if(empty($groupPath)){
                    throw new PydioException("Trying to delete top-level role, there must be something wrong!");
                }
                $basePath = PathUtils::forwardSlashDirname($groupPath);
                $basePath = ($ctx->hasUser() ? $ctx->getUser()->getRealGroupPath($basePath) : $basePath);
                $gName = basename($groupPath);
                UsersService::deleteGroup($basePath, $gName);
            }
            $resultMessage = $mess["ajxp_conf.128"] . " (".count($groups).")";
        } else if(count($users)) {

            foreach($users as $userId){
                if(UsersService::isReservedUserId($userId) || $ctx->getUser()->getId() === $userId) {
                    throw new PydioException($mess["ajxp_conf.61"]);
                }
                UsersService::deleteUser($userId);
            }
            $resultMessage = $mess["ajxp_conf.60"] . " (".count($users).")";
        }

        $message = new UserMessage($resultMessage);
        $reload = new ReloadMessage();
        return $responseInterface->withBody(new SerializableResponseStream([$message, $reload]));

    }

    /**
     * @param ServerRequestInterface $requestInterface
     * @param ResponseInterface $responseInterface
     * @return ResponseInterface
     */
    public function search(ServerRequestInterface $requestInterface, ResponseInterface $responseInterface){

        $httpVars   = $requestInterface->getParsedBody();
        $ctx        = $requestInterface->getAttribute("ctx");
        $nodesList = new NodesList();

        if(!InputFilter::decodeSecureMagic($httpVars["dir"]) == "/data/users") {
            return $responseInterface->withBody(new SerializableResponseStream($nodesList));
        }

        $query = InputFilter::decodeSecureMagic($httpVars["query"]);
        $limit = $offset = -1;
        if(isSet($httpVars["limit"])) $limit = intval(InputFilter::sanitize($httpVars["limit"], InputFilter::SANITIZE_ALPHANUM));
        if(isSet($httpVars["offset"])) $offset = intval(InputFilter::sanitize($httpVars["offset"], InputFilter::SANITIZE_ALPHANUM));
        $this->recursiveSearchGroups($ctx, $nodesList, "/", $query, $offset, $limit);

        return $responseInterface->withBody(new SerializableResponseStream($nodesList));

    }

    /**
     * @param ServerRequestInterface $requestInterface Full set of query parameters
     * @param string $rootPath Path to prepend to the resulting nodes
     * @param string $relativePath Specific path part for this function
     * @param string $paginationHash Number added to url#2 for pagination purpose.
     * @param string $findNodePosition Path to a given node to try to find it
     * @param string $aliasedDir Aliased path used for alternative url
     * @return NodesList A populated NodesList object, eventually recursive.
     */
    public function listNodes(ServerRequestInterface $requestInterface, $rootPath, $relativePath, $paginationHash = null, $findNodePosition = null, $aliasedDir = null)
    {
        $fullBasePath   = "/" . $rootPath . "/" . $relativePath;
        $USER_PER_PAGE  = 50;
        $messages       = LocaleService::getMessages();
        $nodesList      = new NodesList();
        $parentNode     = new AJXP_Node($fullBasePath, [
            "remote_indexation" => "admin_search_users",
            "is_file" => false,
            "text" => ""
        ]);
        if(isSet($requestInterface->getParsedBody()["format"])){
            $format = $requestInterface->getParsedBody()["format"];
        }else if($requestInterface->getAttribute("api") === "v2"){
            $format = "json";
        }else{
            $format = "xml";
        }


        $nodesList->setParentNode($parentNode);

        $baseGroup      = ($relativePath === "users" ? "/" : substr($relativePath, strlen("users")));
        if($this->context->hasUser()){
            $baseGroup = $this->context->getUser()->getRealGroupPath($baseGroup);
        }

        if ($findNodePosition != null && $paginationHash == null) {

            $findNodePositionPath = $fullBasePath."/".$findNodePosition;
            $position = UsersService::findUserPage($baseGroup, $findNodePosition, $USER_PER_PAGE);

            if($position != -1){
                $nodesList->addBranch(new AJXP_Node($findNodePositionPath, [
                    "text" => $findNodePosition,
                    "page_position" => $position
                ]));
            }else{
                // Loop on each page to find the correct page.
                $count = UsersService::authCountUsers($baseGroup);
                $pages = ceil($count / $USER_PER_PAGE);
                for ($i = 0; $i < $pages ; $i ++) {

                    $newList = $this->listNodes($requestInterface, $rootPath, $relativePath, $i+1, true, $findNodePosition);
                    $foundNode = $newList->findChildByPath($findNodePositionPath);
                    if ($foundNode !== null) {
                        $foundNode->mergeMetadata(["page_position" => $i+1]);
                        $nodesList->addBranch($foundNode);
                        break;
                    }
                }
            }
            return $nodesList;

        }

        $nodesList->initColumnsData("filelist", "list", "ajxp_conf.users");
        $nodesList->appendColumn("ajxp_conf.6", "ajxp_label", "String", "40%");
        $nodesList->appendColumn("ajxp_conf.102", "object_id", "String", "10%");
        if(UsersService::driverSupportsAuthSchemes()){
            $nodesList->appendColumn("ajxp_conf.115", "auth_scheme", "String", "5%");
            $nodesList->appendColumn("ajxp_conf.7", "isAdmin", "String", "5%");
        }else{
            $nodesList->appendColumn("ajxp_conf.7", "isAdmin", "String", "10%");
        }
        $nodesList->appendColumn("ajxp_conf.70", "ajxp_roles", "String", "15%");
        $nodesList->appendColumn("ajxp_conf.62", "rights_summary", "String", "15%");

        if(!UsersService::usersEnabled()) return $nodesList;

        if(empty($paginationHash)) $paginationHash = 1;
        $count = UsersService::authCountUsers($baseGroup, "", null, null, false);
        if (UsersService::authSupportsPagination() && $count >= $USER_PER_PAGE) {

            $offset = ($paginationHash - 1) * $USER_PER_PAGE;
            $nodesList->setPaginationData($count, $paginationHash, ceil($count / $USER_PER_PAGE));
            $users = UsersService::listUsers($baseGroup, "", $offset, $USER_PER_PAGE, true, false);
            if ($paginationHash == 1) {
                $groups = UsersService::listChildrenGroups($baseGroup);
            } else {
                $groups = array();
            }

        } else {

            $users = UsersService::listUsers($baseGroup, "", -1, -1, true, false);
            $groups = UsersService::listChildrenGroups($baseGroup);

        }

        if($format === "json" && $baseGroup !== "/"){

            $siblingGroups = UsersService::listChildrenGroups(dirname($baseGroup));
            $gKey = "/".basename($baseGroup);
            $baseGroupLabel = isset($siblingGroups[$gKey]) ? $siblingGroups[$gKey] : null;
            if(!count($users) && !count($groups) && $baseGroupLabel === null){
                // Group does not seem to exist. Maybe we are getting info about a user here
                try{
                    $testUser = UsersService::getUserById(basename($baseGroup));
                    if($testUser->getGroupPath() === dirname($baseGroup)){
                        $userMeta = $this->serializeUserMetadata($testUser, $format, $messages);
                        $nodesList->setParentNode(new AJXP_Node($testUser->getId(), $userMeta));
                        return $nodesList;
                    }
                } catch (UserNotFoundException $unf){}
            } else if($baseGroupLabel !== null) {
                $parentNode = new AJXP_Node($baseGroup, $this->serializeGroupMetadata($baseGroup, $baseGroupLabel));
                $nodesList->setParentNode($parentNode);
            }

        }


        // Append Root Group
        if($this->pluginName === "ajxp_admin" && $baseGroup == "/" && $paginationHash == 1 && !$this->currentUserIsGroupAdmin()){

            $topMeta = $this->serializeGroupMetadata("/", $messages["ajxp_conf.151"]);
            $topMeta["icon_class"] = "icon-home";
            $rootGroupNode = new AJXP_Node($fullBasePath ."/", $topMeta);
            $rootGroupNode->setLeaf(true);
            $nodesList->addBranch($rootGroupNode);

        }

        // LIST GROUPS
        foreach ($groups as $groupId => $groupLabel) {

            $nodeKey = $fullBasePath ."/".ltrim($groupId,"/");
            $meta = $this->serializeGroupMetadata($groupId, $groupLabel);
            $this->appendBookmarkMeta($nodeKey, $meta);
            if($requestInterface->getAttribute("api") === "v2"){
                $meta["group_role_id"] = "/AJXP_GRP_".rtrim($baseGroup, "/")."/".ltrim($groupId, "/");
                $nodeKey = InputFilter::securePath("/".$baseGroup.$groupId);
            }
            $nodesList->addBranch(new AJXP_Node($nodeKey, $meta));
        }

        // LIST USERS
        $userArray  = array();
        $logger     = Logger::getInstance();
        if(method_exists($logger, "usersLastConnection")){
            $allUserIds = array();
        }
        foreach ($users as $userObject) {
            $label = $userObject->getId();
            if(isSet($allUserIds)) $allUserIds[] = $label;
            if ($userObject->hasParent()) {
                $label = $userObject->getParent()."000".$label;
            }else{
                $children = ConfService::getConfStorageImpl()->getUserChildren($label);
                foreach($children as $addChild){
                    $userArray[$label."000".$addChild->getId()] = $addChild;
                }
            }
            $userArray[$label] = $userObject;
        }
        if(isSet($allUserIds) && count($allUserIds)){
            $connections = $logger->usersLastConnection($allUserIds);
        }else{
            $connections = [];
        }

        ksort($userArray);

        /** @var UserInterface $userObject */
        foreach ($userArray as $userObject) {

            $userId  = $userObject->getId();
            $bmKey   = $fullBasePath. "/" .$userId;
            $nodeKey = $format === "json" ? $userId : $bmKey;
            $meta = $this->serializeUserMetadata($userObject, $format, $messages, $connections);
            $this->appendBookmarkMeta($bmKey, $meta);
            $nodesList->addBranch(new AJXP_Node($nodeKey, $meta));

        }
        return $nodesList;
    }

    /**
     * @param string $groupId
     * @param string $groupLabel
     * @return array
     */
    protected function serializeGroupMetadata($groupId, $groupLabel){
        return [
            "icon" => "users-folder.png",
            "icon_class" => "icon-folder-close",
            "ajxp_mime" => "group",
            "object_id" => $groupId,
            "text"      => $groupLabel,
            "is_file"   => false
        ];
    }

    /**
     * @param ContextInterface $ctx
     * @param string $userId
     * @param bool $checkExists
     * @return UserInterface
     * @throws PydioException
     */
    protected function getUserIfAuthorized($ctx, $userId, $checkExists = true){
        $user = UsersService::getUserById($userId, $checkExists);
        if($ctx->hasUser() && !$ctx->getUser()->canAdministrate($user)){
            throw new PydioException("Cannot update user data for ".$userId);
        }
        return $user;
    }

    /**
     * @param UserInterface $userObject
     * @param string $format
     * @param array $messages
     * @param array
     * @return array
     */
    protected function serializeUserMetadata($userObject, $format, $messages, $connections = []){

        $repos = ConfService::getConfStorageImpl()->listRepositories($userObject);
        $isAdmin = $userObject->isAdmin();
        $userId = $userObject->getId();
        $icon = "user".($userId=="guest"?"_guest":($isAdmin?"_admin":""));
        $iconClass = "icon-user";
        if ($userObject->hasParent()) {
            $icon = "user_child";
            $iconClass = "icon-angle-right";
        }
        if ($isAdmin) {
            $rightsString = $messages["ajxp_conf.63"];
        } else {
            $r = array();
            foreach ($repos as $repoId => $repository) {
                if($repository->getAccessType() == "ajxp_shared") continue;
                if(!$userObject->canRead($repoId) && !$userObject->canWrite($repoId)) continue;
                $rs = ($userObject->canRead($repoId) ? "r" : "");
                $rs .= ($userObject->canWrite($repoId) ? "w" : "");
                $r[] = $repository->getDisplay()." (".$rs.")";
            }
            $rightsString = implode(", ", $r);
        }
        $nodeLabel = UsersService::getUserPersonalParameter("USER_DISPLAY_NAME", $userObject, "core.conf", $userId);
        $scheme = UsersService::getAuthScheme($userId);
        $roles = array_filter(array_keys($userObject->getRoles()), array($this, "filterReservedRoles"));
        $mergedRole = $userObject->getMergedRole()->getDataArray(true);
        $meta = [];
        if($format !== "json"){
            $mergedRole = json_encode($mergedRole);
            $currentRoles = implode(", ", $roles);
        }else{
            $currentRoles = $roles;
            $meta["personal_role_id"] = "/AJXP_USR_/".$userId;
            $meta["lock"] = $userObject->getLock();
            $meta["profile"] = $userObject->getProfile();
        }
        $meta = array_merge($meta, [
            "text" => $nodeLabel,
            "is_file" => true,
            "isAdmin" => ($format === "json" ? $isAdmin : $messages[($isAdmin?"ajxp_conf.14":"ajxp_conf.15")]),
            "icon" => $icon.".png",
            "icon_class" => $iconClass,
            "object_id" => $userId,
            "auth_scheme" => ($scheme != null? $scheme : ""),
            "rights_summary" => $rightsString,
            "ajxp_roles" => $currentRoles,
            "ajxp_mime" => "user".(($userId!="guest"&&$userId!=$this->context->getUser()->getId())?"_editable":""),
            "json_merged_role" => $mergedRole
        ]);
        if($userObject->hasParent()) {
            $meta["shared_user"] = "true";
        }
        if(isSet($connections) && isSet($connections[$userObject->getId()]) && !empty($connections[$userObject->getId()])) {
            $meta["last_connection"] = strtotime($connections[$userObject->getId()]);
            $meta["last_connection_readable"] = StatHelper::relativeDate($meta["last_connection"], $messages);
        }

        return $meta;

    }

    /**
     * Do not display AJXP_GRP_/ and AJXP_USR_/ roles if not in server debug mode
     * @param $key
     * @return bool
     */
    protected function filterReservedRoles($key){
        return (strpos($key, "AJXP_GRP_/") === FALSE && strpos($key, "AJXP_USR_/") === FALSE);
    }

    /**
     * @param UserInterface $ctxUser
     * @param $userId
     * @param $roleId
     * @param $addOrRemove
     * @param bool $updateSubUsers
     * @return UserInterface
     * @throws UserNotFoundException
     * @throws PydioException
     */
    protected function updateUserRole(UserInterface $ctxUser, $userId, $roleId, $addOrRemove, $updateSubUsers = false)
    {
        $user = UsersService::getUserById($userId);
        if(!empty($ctxUser) && !$ctxUser->canAdministrate($user)){
            throw new PydioException("Cannot update user data for ".$userId);
        }
        if ($addOrRemove == "add") {
            $roleObject = RolesService::getRole($roleId);
            $user->addRole($roleObject);
        } else {
            $user->removeRole($roleId);
        }
        $user->save("superuser");
        if ($ctxUser->getId() == $user->getId()) {
            AuthService::updateSessionUser($user);
        }
        return $user;

    }

    /**
     * @param ContextInterface $ctx
     * @param NodesList $nodesList
     * @param string $baseGroup
     * @param string $term
     * @param int $offset
     * @param int $limit
     */
    public function recursiveSearchGroups(ContextInterface $ctx, &$nodesList, $baseGroup, $term, $offset=-1, $limit=-1)
    {
        if($ctx->hasUser()){
            $baseGroup = $ctx->getUser()->getRealGroupPath($baseGroup);
        }

        $groups     = UsersService::listChildrenGroups($baseGroup);
        foreach ($groups as $groupId => $groupLabel) {

            if (preg_match("/$term/i", $groupLabel) == TRUE ) {
                $trimmedG = trim($baseGroup, "/");
                if(!empty($trimmedG)) $trimmedG .= "/";
                $nodeKey = "/data/users/".$trimmedG.ltrim($groupId,"/");
                $meta = array(
                    "icon"          => "users-folder.png",
                    "text"          => $groupLabel,
                    "is_file"       => false,
                    "ajxp_mime"     => "group_editable"
                );
                $this->appendBookmarkMeta($nodeKey, $meta);
                $nodesList->addBranch(new AJXP_Node($nodeKey, $meta));
            }
            $this->recursiveSearchGroups($ctx, $nodesList, rtrim($baseGroup, "/")."/".ltrim($groupId, "/"), $term);

        }

        $users = UsersService::listUsers($baseGroup, $term, $offset, $limit);
        foreach ($users as $userId => $userObject) {
            $gPath = $userObject->getGroupPath();
            $realGroup = $ctx->getUser()->getRealGroupPath($ctx->getUser()->getGroupPath());
            if(strlen($realGroup) > 1 && strpos($gPath, $realGroup) === 0){
                $gPath = substr($gPath, strlen($realGroup));
            }
            $trimmedG = trim($gPath, "/");
            if(!empty($trimmedG)) $trimmedG .= "/";

            $userDisplayName = UsersService::getUserPersonalParameter("USER_DISPLAY_NAME", $userObject, "core.conf", $userId);
            $nodeKey = "/data/users/".$trimmedG.$userId;
            $meta = array(
                "icon"          => "user.png",
                "text"          => $userDisplayName,
                "is_file"       => true,
                "ajxp_mime"     => "user_editable"
            );
            $this->appendBookmarkMeta($nodeKey, $meta);
            $nodesList->addBranch(new AJXP_Node($nodeKey, $meta));

        }

    }


}
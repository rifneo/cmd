<?php
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
$mess=array(
"Generic Conf Features" => "Configurations génériques",
"Let user create repositories" => "Autoriser les utilisateurs à créer des dépôts",
"Remember guest preferences" => "Se souvenir des préférences de l'utilisateur 'Invité'.",
"Configurations Management" => "Gestion des configurations",
"Sets how the application core data (users,roles,etc) is stored." => "Définit le stockage des données principales de l'application (utilisateurs, rôles, ...).",
"Default start repository" => "Dépôt par défaut au démarrage",
"Default repository" => "Dépôt par défaut",
"Maximum number of shared users per user" => "Nombre maximal d'utilisateurs partagés par utilisateur",
"Shared users limit" => "Limite d'utilisateurs partagés",
"Core SQL Connexion" => "Connexion SQL principale",
"SQL Connexion" => "Connexion SQL",
"Simple SQL Connexion definition that can be used by other sql-based plugins" => "Définition d'une connexion SQL simple pouvant être utilisée par d'autres plugins basés sur sql",
"Preferences Saving" => "Enregistrement des préférences",
"Skip user history" => "Ne pas conserver les préférences d'interface",
"Use this option to avoid automatic reloading of the interface state (last folder, opened tabs, etc)" => "Utilisez cette option pour éviter le rechargement automatique du dernier état de l'interface (répertoire, onglets ouverts, ...)",
"Internal / External Users" => "Utilisateurs internes / externes",
"Maximum number of users displayed in the users autocompleter" => "Nombre maximal d'utilisateurs affichés dans l'auto-completion des utilisateurs",
"Users completer limit" => "Limite de la complétion des utilisateurs",
"Minimum number of characters to trigger the auto completion feature" => "Nombre minimal de caractères pour déclencher la fonctionnalité d'auto-completion",
"Users completer min chars" => "Nb min. caractères pour la complétion des utilisateurs",
"Do not display real login in parenthesis" => "Ne pas afficher le véritable identifiant entre parenthèses",
"Hide real login" => "Cacher le véritable identifiant",
"See existing users" => "Voir les utilisateurs existants",
"Allow the users to pick an existing user when sharing a folder" => "Autoriser les utilisateurs à voir une liste d'utilisateurs existants lors du partage d'un répertoire",
"Create external users" => "Créer des utilisateurs externes",
"Allow the users to create a new user when sharing a folder" => "Autoriser les utilisateurs à créer un nouvel utilisateur lors du partage d'un répertoire",
"External users parameters" => "Paramètres des utilisateurs externes",
"List of parameters to be edited when creating a new shared user." => "Liste des paramètres modifiables lors de la création d'un nouvel utilisateur partagé.",
"Configuration Store Instance" => "Instance de stockage des configurations",
"Instance" => "Instance",
"Choose the configuration plugin" => "Choisissez le plugin de configuration",
"Name" => "Nom",
"Full name displayed to others" => "Nom complet, affiché à tous les utilisateurs",
"Avatar" => "Avatar",
"Image displayed next to the user name" => "Image affichée à côté du nom",
"Email" => "Courriel",
"Address used for notifications" => "Addresse utilisée pour les notifications",
"Country" => "Pays",
"Language" => "Langue",
"User Language" => "Langue de l'utilisateur",
"If the 'guest' user is enabled, remember her preferences accross sessions." => "Si l'utilisateur 'guest' est activé, se souvenir de ses préférences entre les sessions.",
"Role Label" => "Libellé du rôle",
"Users Lock Action" => "Action de lock",
"If set, this action will be triggered automatically at users login. Can be logout (to lock out the users), pass_change (to force password change), or anything else" => "Si elle est configurée, cette action va être déclenchée automatiquement au login. Par exemple 'logout' (empèche le login), 'pass_change' (force le changement de mot de passe), etc.",
"Worskpace creation delegation" => "Délégation de la création de workspace",
"Let user create repositories from templates" => "Autoriser les utilisateurs à créer des workspaces.",
"Whether users can create their own repositories, based on predefined templates." => "Autoriser les utilisateurs à créer des workspaces, à partir des modèles de workspaces prédéfinis.",
"Users Directory Listing" => "Listing des utilisateurs",
"Share with existing users from all groups" => "Partager avec des utilisateurs de tous les groupes",
"Allow to search users from other groups through auto completer (can be handy if previous option is set to false) and share workspaces with them" => "Autoriser la recherche d'utilisateurs dans tous les groupes via l'auto-completion (utile si l'option précédente est désactivée) et partage des fichiers/répertoires avec eux.",
"List existing from all groups" => "Lister les utilisateurs de tous les groupes",
"If previous option is set to True, directly display a full list of users from all groups" => "Afficher la liste de tous les utilisateurs de tous les groupes",
"Roles / Groups Directory Listing" => "Listing des Roles / Groupes",
"Display roles and/or groups" => "Aficher les roles et/ou les groupes",
"Users only (do not list groups nor roles)" => "Utilisateurs seulement",
"Allow Group Listing" => "Lister les groupes",
"Allow Role Listing" => "Lister les rôles",
"Role/Group Listing" => "Lister les groupes ET les rôles",
"List Roles By" => "Filter la liste des rôles",
"All roles" => "Tous les rôles",
"User roles only" => "Roles utilisateurs seulement",
"role prefix" => "Role commencant par",
"Excluded Roles" => "Roles exclus",
"Included Roles" => "Roles inclus",
"Some roles should be disappered in the list.  list separated by ',' or start with 'preg:' for regex." => "Exclure ces rôles de la liste: liste separée par ',' ou commencer par 'preg:' pour une expression régulière.",
"Some roles should be shown in the list.  list separated by ',' or start with 'preg:' for regex." => "Inclure ces rôles de la liste: liste separée par ',' ou commencer par 'preg:' pour une expression régulière.",
"External Users Creation" => "Création d'utilisateurs externes",
"Always override other roles, included group roles." => "Toujours écraser les autres rôles, ainsi que les paramètres de groupes.",
"Always Override" => "Toujours écraser",
"Do not load groups and users list if no regexp is entered. Avoid sending large search on LDAP." => "Ne pas charger la liste des rôles ou des utilisateurs si aucun caractère n'est tapé. Evite d'envoyer de très large requêtes aux annuaires d'utilisateurs.",
"Make regexp mandatory" => "Caractère de recherche obligatoire",
);

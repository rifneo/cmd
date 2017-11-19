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
"Sharing Features" => "Fonctions de partage",
"Share Center actions and hooks" => "Centre de partage et hooks",
"Metadata File" => "Fichier de métadonnées",
"Hidden file containing shared metadata" => "Nom du fichier caché contenant les métadonnées de partage",
"File location" => "Emplacement du fichier",
"Where to store the metadata file : LOCAL means a hidden file will be created in each folder, GLOBAL means that one file will be created in AJXP_DATA_PATH/plugins/action.share folder." => "Où stocker le fichier de métadonnées : 'LOCAL' signifie qu'un fichier caché sera créé dans chaque répertoire, 'GLOBAL' signifie qu'un seul fichier sera créé dans le répertoire AJXP_DATA_PATH/plugins/action.share .",
"Link Generation" => "Génération du lien",
"Use web server RewriteEngine mechanism to generate prettier URLs" => "Utiliser la fonctionnalité RewriteEngine du serveur web pour générer des URL plus jolies",
"Use Rewrite Rule" => "Utiliser les règles de ré-écriture",
"Minimum length of the generated hash" => "Longueur minimale du hash généré",
"Hash minimum length" => "Longueur minimale du hash",
"Maximum share expiration limit for file, 0 = unlimited" => "Durée maximale du partage avant son expiration, 0 = illimitée",
"Maximum file expiration limit" => "Durée maximale du fichier avant son expiration",
"Maximum download limit for file, 0 = unlimited" => "Nombre de téléchargements maximum pour le fichier, 0 = illimité",
"Maximum file download limit" => "Nombre de téléchargements maximum",
"Use external mailer for invitations" => "Utiliser un programme externe pour envoyer les invitations par mail",
"Force External Mailer" => "Forcer un programme externe pour les mails",
"Create and display QRCode for shared link" => "Créer et afficher un QRCode pour le lien de partage",
"Create QRCode" => "Créer un QRCode",
"Folder Sharing" => "Partage de dossier",
"Enable folder sharing (workspace and minisite)" => "Activer le partage de répertoire (dépôt et minisite)",
"Enable folder sharing" => "Activer le partage de répertoire",
"Disallow users to create shared folders if a workspace already exists with the same label" => "Empêcher la création, par les utilisateurs, de répertoires partagés si des dépôts existent déjà avec le même intitulé",
"Avoid labels duplication" => "Prévenir la duplication des intitulés",
"Shared users configurations" => "Configuration des utilisateurs partagés",
"Minimum number of characters to start getting results by auto-completion when sharing a folder with other users" => "Nombre de caractères requis pour activer l'auto-complétion lors du partage d'un répertoire avec d'autres utilisateurs",
"Autocomplete minimum chars" => "Nombre de caractères requis pour activer l'auto-complétion",
"Limit the number of results returned by the auto-completion feature when sharing a folder with other users" => "Limiter le nombre de résultats retournés par l'auto-complétion lors du partage d'un répertoire avec d'autres utilisateurs",
"Autocompletion results limit" => "Limitation des résultats de l'auto-complétion",
"Mandatory prefix for users created temporary users login" => "Préfixe obligatoire pour les utilisateurs créés de manière temporaire (par les utilisateurs)",
"Tmp users prefix" => "Préfixe utilisateurs temporaires",
"Metadata Files" => "Fichiers de métadonnées",
"Weblink Page" => "Page de Weblink",
"Page Title" => "Titre de la page",
"Share page title. Use AJXP_FILENAME keyword to display the file name." => "Titre de la page du partage. Utilisez 'AJXP_FILENAME' pour afficher le nom du fichier.",
"Download text" => "Texte de téléchargement",
"Text displayed below the download button. Use AJXP_FILENAME keyword to display the file name, and PYDIO_APP_TITLE for the application title." => "Texte affiché sous le bouton de téléchargement. Utilisez 'AJXP_FILENAME' pour affiche le nom du fichier, 'PYDIO_APP_TITLE' pour afficher le nom de l'application.",
"Download text w/ Pass" => "Texte de téléchargement avec mot de passe",
"Text displayed below the download button when a password is mandatory. Use AJXP_FILENAME keyword to display the file name, and PYDIO_APP_TITLE for the application title." => "Texte affiché, lorsqu'un mot de passe est requis, sous le bouton de téléchargement. Utilisez 'AJXP_FILENAME' pour affiche le nom du fichier, 'PYDIO_APP_TITLE' pour afficher le nom de l'application.",
"Download Button" => "Bouton de téléchargement",
"Image used as a button for downloading the file" => "Image utilisée en tant que bouton permettant de télécharger le fichier",
"Background Color" => "Couleur d'arrière-plan",
"Share page background color." => "Couleur d'arrière plan de la page du partage.",
"Text Color" => "Couleur du texte",
"Share page text color." => "Couleur du texte de la page du partage.",
"Text Shadow" => "Ombre du texte ",
"Share page text shadow color." => "Ombre du texte de la page du partage.",
"Page Background Images" => "Images d'arrière-plan",
"Custom Background (1)" => "Arrière-plan personnalisé (1)",
"Image used as a background" => "Image utilisée comme arrière-plan",
"Background Attributes(1)" => "Attributs de l'arrière-plan(1)",
"Custom Background (2)" => "Arrière-plan personnalisé (2)",
"Background Attributes(2)" => "Attributs de l'arrière-plan(2)",
"Custom Background (3)" => "Arrière-plan personnalisé (3)",
"Background Attributes(3)" => "Attributs de l'arrière-plan(3)",
"Minisite" => "Minisite",
"Minisite Logo" => "Logo du minisite",
"Top-right logo displayed on minisite page" => "Logo affiché en haut à droite du minisite",
"Set password mandatory" => "Set password mandatory",
"Do not allow users to create public links, only private links (password-protected)" => "Do not allow users to create public links, only private links (password-protected)",
"Fork Events Forwarding" => "Fork Events Forwarding",
"If you detect performances issues while modifiyng files under deep trees, try activating that one. Please be sure of what you do, this may trigger a whole lot of php processes on the server." => "En cas de problème de performances lors de modifications dans des arbres profonds, activer cette options. Attention, ceci va déclencher de nombreux process PHP sur le serveur.",
"Enable public links for files" => "Liens publics pour les fichiers",
"Enable public link generation for files" => "Activer les liens publics pour les fichiers",
"Hash user-editable" => "Personnalisation du lien",
"Allow users to manually choose a hash for the generated links" => "Autoriser les utilisateurs à personnaliser les liens publics",
"Minisites and Workspaces" => "Minisites et Workspaces",
"Minisites only" => "Minisites seulement",
"Workspaces only" => "Workspaces seulement",
"Disable Folder Sharing" => "Désactiver le partage de répertoire",
"Authorizations" => "Autorisations",
"Allow users to generate public links on files" => "Autoriser la création de liens publics sur les fichiers",
"Files: enable public links" => "Fichiers: autoriser les liens publics",
"Enable internal file sharing (sharing with users existing or temporary users)" => "Autoriser le partage de fichier entre utilisateurs",
"Files: enable internal sharing" => "Fichiers: autoriser le partage interne",
"Allow users to generate public links on folders" => "Autoriser la création de liens publics sur les répertoires",
"Folders: enable public links" => "Répertoires: autoriser les liens publics",
"Enable internal folder sharing (sharing with users existing or temporary users)" => "Autoriser le partage de répertoire entre utilisateurs",
"Folders: enable internal sharing" => "Répertoire: autoriser le partage interne",
"Internal Sharing" => "Partage interne",
);
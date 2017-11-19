<?php
/*
* Copyright 2007-2017 Charles du Jeu <charles (at) cdujeu.me>
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
$mess = array(
    "Mailers" => "Emails",
    "Core configs for sending emails" => "Configurations pour l'envoi des mails",
    "Mailer Plugin" => "Plugin de mail",
    "Select the plugin to activate for concretely sending emails" => "Sélectionner le plugin à activer pour envoyer les mails",
    "Sender email" => "Email de l'expéditeur",
    "Adress of the sender" => "Adresse de l'expéditeur",
    "Sender name" => "Nom",
    "Name of the sender" => "Nom de l'expéditeur",
    "Unique Sender" => "Expéditeur unique",
    "Force all mails to be sent by this Sender email, instead of users adresses" => "Forcer tous les mails à être envoyés par un même expéditeur, plutôt que par l'utilisateur.",
    "Subject Prepend" => "Avant le sujet",
    "String automatically added at the beginning of the mail subject" => "Mots ajoutés automatiquement avant le sujet",
    "Subject Append" => "Après le sujet",
    "String automatically added at the end of the mail subject" => "Mots ajoutés automatiquement après le sujet",
    "Body Layout" => "Corps du mail",
    "Main Layout for the email body, use HTML for send nice emails, and use the AJXP_MAIL_BODY keyword for the real content." => "Mise en page du corps du mail. Vous pouvez utiliser du HTML et le mot-clé AJXP_MAIL_BODY pour le contenu réel.",
    "Layout Folder" => "Répertoire des mise-en-pages",
    "Extract the main layout from a localized file. Will prevail on the previous parameter, make sure to have an AJXP_MAIL_BODY in the layout file." => "Extraire la mise en page d'un fichier localisé. Ceci prendra le pas sur le paramêtre précédent, attention à bien utiliser AJXP_MAIL_BODY dans le fichier.",
    "Send as HTML" => "Envoyer en HTML",
    "Get the email in HTML" => "Recevoir le mail en HTML",
    "Send email to..." => "Envoyer à ...",
    "You can add many email separated by commas" => "Vous pouvez ajouter des adresses séparées par des virgules, à qui seront envoyés les mails en plus de la vôtre.",
    "Choose your mail frequency (like 9:00 or 9:00,14:00 or Wednesday)" => "Choisir une fréquence (comme 9:00, ou 9:00,14:00 or Wednesday un jour de la semaine en anglais)",
    "Detail your frequency here" => "Détail de la fréquence",
    "Every X min" => "Toutes les X minutes",
    "Every X hour" => "Toutes les X heures",
    "Every day at " => "Tous les jours à ",
    "Twice a day (every day at and)" => "Deux fois par jours",
    "Once a Week" => "Une fois par semaine",
    "Emails frequency" => "Fréquence d'envois",
    "Receive Notifcations by email" => "Recevoir les notifications par email",
    "Active notifications by email" => "Recevoir des emails en plus des alertes affichées dans Pydio",
    "Sender" => "Expéditeur",
    "Content" => "Corps du mail",
    "Activate Queue" => "Activer la queue",
    "Store emails in a queue and batch-process them. Users can choose the sending frequency. Make sure to set up a CRON on consume_mail_queue action if you use this option." => "Stocker les emails dans une queue pour les envoyer par batch. Les utilisateurs peuvent choisir la fréquence d'envoi. Attention, il faut déclencher l'action consume_mail_queue de manière régulière, avec un CRON par exemple."
);

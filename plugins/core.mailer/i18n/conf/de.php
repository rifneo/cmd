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
    "Mailers" => "Mailer",
    "Core configs for sending emails" => "Konfiguration für den Versand von E-Mails",
    "Mailer Plugin" => "Erweiterung",
    "Select the plugin to activate for concretely sending emails" => "Wähle eine Erweiterung für den E-Mail-Versand",
    "Sender email" => "E-Mail-Adresse des Absenders",
    "Adress of the sender" => "E-Mail-Adresse des Absenders",
    "Sender name" => "Name des Absenders",
    "Name of the sender" => "ame des Absenders",
    "Unique Sender" => "Nur dieser Absender",
    "Force all mails to be sent by this Sender email, instead of users adresses" => "Alle E-Mails werden von diesem Absender versendet und nicht von der E-Mail-Adresse des Benutzers",
    "Subject Prepend" => "Betreff-Präfix",
    "String automatically added at the beginning of the mail subject" => "Text, der an den Anfang des Betreffs angehängt wird",
    "Subject Append" => "Betreff-Suf­fix",
    "String automatically added at the end of the mail subject" => "Text, der an den Betreffs angehängt wird",
    "Body Layout" => "Text",
    "Main Layout for the email body, use HTML for send nice emails, and use the AJXP_MAIL_BODY keyword for the real content." => "Der E-Mail-Text (HTML für Formatierung möglich). Die Variable AJXP_MAIL_BODY fügt den Inhalt ein.",
    "Layout Folder" => "Layout-Ordner",
    "Extract the main layout from a localized file. Will prevail on the previous parameter, make sure to have an AJXP_MAIL_BODY in the layout file." => "Das Layout der E-Mails aus einer übersetzten Datei laden (überschreibt den 'Text'-Parameter). Die Layout-Datei muss AJXP_MAIL_BODY enthalten.",
    "Send as HTML" => "Die E-Mail als formatierte HTML-Nachricht senden",
    "Get the email in HTML" => "HTML E-Mails versenden",
    "Send email to..." => "Benachrichtigungen senden an...",
    "You can add many email separated by commas" => "Es können mehrere E-Mail-Adressen angegeben werden (mit Kommas getrennt)",
    "Choose your mail frequency (like 9:00 or 9:00,14:00 or Wednesday)" => "E-Mail-Häufigkeit abhängig von obiger Konfiguration (z.B. 9:00 oder 9:00,14:00 oder Wednesday)",
    "Detail your frequency here" => "E-Mail-Häufigkeit genauer festlegen",
    "Every X min" => "Alle X Minuten",
    "Every X hour" => "Alle X Stunden",
    "Every day at " => "Täglich um ",
    "Twice a day (every day at and)" => "Zweimal täglich (am Tagesende)",
    "Once a Week" => "Einmal wöchentlich",
    "Emails frequency" => "E-Mail-Häufigkeit",
    "Receive Notifcations by email" => "Benachrichtigungen per E-Mail erhalten",
    "Active notifications by email" => "Benachrichtigungen per E-Mail",
    "Sender" => "Absender",
    "Content" => "Inhalt",
    "Activate Queue" => "Warteschlange aktivieren",
    "Store emails in a queue and batch-process them. Users can choose the sending frequency. Make sure to set up a CRON on consume_mail_queue action if you use this option." => "E-Mails werden aus einer Warteschlange versendet. Die Häufigkeit ist konfigurierbar. Stellen Sie sicher, dass per CRON die Aktion consume_mail_queue aufgerufen wird."
);

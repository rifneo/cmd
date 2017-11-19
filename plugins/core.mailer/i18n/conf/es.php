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
    "Mailers" => "Gestores de Correo",
    "Core configs for sending emails" => "Configuración para enviar correos",
    "Mailer Plugin" => "Plugin de Correo",
    "Select the plugin to activate for concretely sending emails" => "Selecciona el plugin para activar el envío de correos",
    "Sender email" => "Remitente",
    "Adress of the sender" => "Dirección del remitente",
    "Sender name" => "Nombre del remitente",
    "Name of the sender" => "Nombre del remitente",
    "Unique Sender" => "Remitente único",
    "Force all mails to be sent by this Sender email, instead of users adresses" => "Todos los correos se envían desde este remitente en vez de la dirección del usuario",
    "Subject Prepend" => "Prefijo del Asunto",
    "String automatically added at the beginning of the mail subject" => "Esta frase se añade automáticamente antes del asunto del correo",
    "Subject Append" => "Sufijo del Asunto",
    "String automatically added at the end of the mail subject" => "Esta frase se añade automáticamente antes del asunto del correo",
    "Body Layout" => "Diseño Cuerpo",
    "Main Layout for the email body, use HTML for send nice emails, and use the AJXP_MAIL_BODY keyword for the real content." => "Diseño principal del cuerpo del correo, usa HTML para enviar correos con diseños bonitos y usa AJXP_MAIL_BODY para el contenido real.",
    "Layout Folder" => "Directorio del Diseño",
    "Extract the main layout from a localized file. Will prevail on the previous parameter, make sure to have an AJXP_MAIL_BODY in the layout file." => "Extrae al diseño principal el contenido de los archivos. Esta opción prevalece sobre la anterior, asegurate de usar AJXP_MAIL_BODY en el archivo de diseño.",
    "Send as HTML" => "Enviar como HTML",
    "Get the email in HTML" => "Obtener el correo en HTML",
    "Send email to..." => "Enviar correo a...",
    "You can add many email separated by commas" => "Puedes añadir direcciones de correo adicionales separadas por comas",
    "Choose your mail frequency (like 9:00 or 9:00,14:00 or Wednesday)" => "Elige una fecuencia de envio de correos (por ejemplo: '9:00' o '9:00,14:00' o 'Wednesday')",
    "Detail your frequency here" => "Detalla tu frecuencia aquí",
    "Every X min" => "Cada X minutos",
    "Every X hour" => "Cada X horas",
    "Every day at " => "Cada día a las ",
    "Twice a day (every day at and)" => "Dos veces al dia (cada día a X y X)",
    "Once a Week" => "Una vez a la semana",
    "Emails frequency" => "Frecuencia de correos",
    "Receive Notifcations by email" => "Recibe notificaciones por correo",
    "Active notifications by email" => "Activa notificaciones por correo",
    "Sender" => "Remitente",
    "Content" => "Contenido",
    "Activate Queue" => "Activar Cola",
    "Store emails in a queue and batch-process them. Users can choose the sending frequency. Make sure to set up a CRON on consume_mail_queue action if you use this option." => "Almacena los correos en una cola para procesarlos en grupo. Los usuarios pueden seleccionar la frecuencia de envio. Asegurate de configurar un trabajo CRON para usar consume_mail_queue si seleccionas esta opción."
);

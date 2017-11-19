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
"File System (Standard)" => "Sistema de Archivos (Estándar)",
"The most standard access to a filesystem located on the server." => "El acceso estándar al sistema de archivos del servidor",
"Path" => "Ruta",
"Real path to the root folder on the server" => "Ruta real al directorio raiz del servidor",
"Create" => "Crear",
"Create folder if it does not exists" => "Crear directorio si no existe",
"File Creation Mask" => "Máscara de Archivos",
"Optionnaly apply a chmod operation. Value must be numeric, like 0777, 0644, etc." => "Aplicar opcionalmente una operación chmod. El valor debe ser numérico (p.e. 0777 0644, etc).",
"Purge Days" => "Purgar (Dias)",
"Option to purge documents after a given number of days. This require a manual set up of a CRON task. Leave to 0 if you don't wan't to use this feature." => "Opción para purgar dorcumentos al transcurrir el número de dias seleccionado. Requiere que se configure una tarea CRON. Déjalo en 0 si no quieres activar esta función.",
"Real Size Probing" => "Explorar Tamaño Real",
"Use system command line to get the filesize instead of php built-in function (fixes the 2Go limitation)" => "Usar la línea de comandos del sistema para obtener el tamaño de archivo en lugar de usar la función PHP (soluciona la limitación de 2G)",
"X-SendFile Active" => "Activar X-SendFile",
"Delegates all download operations to the webserver using the X-SendFile header. Warning, this is an external module to install for Apache. Module is active by default in Lighttpd. Warning, you have to manually add the folders where files will be downloaded in the module configuration (XSendFilePath directive)" => "Delega todas las operaciones de descarga al servidor web usando la cabecera X-SendFile. Atención, esto es un módulo externo que se instala en Apache. El módulo está activado por defecto en Lighttpd. Atención, tienes que añadir manualmente los directorios donde se descargarán los archivos en el modulo de configuración (directiva XSendFilePath)",
"Data template" => "Plantilla de datos",
"Path to a directory on the filesystem whose content will be copied to the repository the first time it is loaded." => "Ruta al directorio del sistema de archivos cuyo contenido será copiado al workspace la primera vez que sea cargado.",
"Purge Days (Hard limit)" => "Purgar (Dias - Estricto)",
"Option to purge documents after a given number of days (even if shared). This require a manual set up of a CRON task. Leave to 0 if you don't wan't to use this feature." => "Opción para purgar dorcumentos al transcurrir el número de dias seleccionado (incluso si están compartidos). Requiere que se configure una tarea CRON. Déjalo en 0 si no quieres activar esta función.",
"Purge Days (Soft limit)" => "Purgar (Dias - Flexible)",
"Option to purge documents after a given number of days (if not shared). This require a manual set up of a CRON task. Leave to 0 if you don't wan't to use this feature." => "Opción para purgar dorcumentos al transcurrir el número de dias seleccionado (excluye los compartidos). Requiere que se configure una tarea CRON. Déjalo en 0 si no quieres activar esta función.",
"Use POSIX" => "Usar POSIX",
"Use php POSIX extension to read files permissions. Only works on *nix systems." => "Usar la extension PHP POSIX para leer los permisos de los archivos. Sólo funciona en sistema *nix.",
"X-Accel-Redirect Active" => "Activar X-Accel-Redirect",
"Delegates all download operations to nginx using the X-Accel-Redirect header. Warning, you have to add some configuration in nginx, like X-Accel-Mapping" => "Delega todas las operaciones de descarga a nginx usando la cabecera X-Accel-Redirect. Atención, tiene que añadir la configuración a nginx, como X-Accel-Mapping",
"Zip downloading files on the fly" => "Comprimir archivos durante la descarga",
"Directly write the zip file to an output stream which is connected to the user's browser." => "Transmite directamente el archivo zip a la salida conectada al navegador del usuario.",
);

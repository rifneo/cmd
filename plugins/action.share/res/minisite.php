<!DOCTYPE html>
<html xmlns:ajxp>
    <head>
        <title>AJXP_APPLICATION_TITLE</title>
        <base href="AJXP_PATH_TO_ROOT"/>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <link rel="icon" type="image/x-png" href="plugins/gui.ajax/res/themes/common/images/html-folder.png">
        <link rel="stylesheet" type="text/css" href="plugins/gui.ajax/res/build/pydio.AJXP_THEME.min.css?v=AJXP_CURRENT_VERSION">
        <link rel="stylesheet" href="plugins/action.share/res/minisite.css"/>
        <style type="text/css">

        </style>
        <script language="javascript" type="text/javascript" src="plugins/gui.ajax/res/build/pydio.boot.min.js"></script>
        <script type="text/javascript">
            var pydio, MessageHash={};
            var startParameters = {
                "BOOTER_URL":"AJXP_PUBLIC_BASEURI/?get_action=get_boot_conf&goto=AJXP_START_REPOSITORY&minisite_session=AJXP_LINK_HASH",
                "EXT_REP":"\/",
                "MAIN_ELEMENT":"AJXP_TEMPLATE_NAME",
                "SERVER_PREFIX_URI": "",
                "PRESET_LOGIN":"AJXP_PRELOGED_USER",
                "HASH_LOAD_ERROR":"AJXP_HASH_LOAD_ERROR",
                "PASSWORD_AUTH_ONLY":true,
                "SERVER_PERMANENT_PARAMS":{"minisite_session":"AJXP_LINK_HASH"}
            };
            if(startParameters["PRESET_LOGIN"] == "ajxp_legacy_minisite"){
                delete startParameters["PRESET_LOGIN"];
                startParameters["PASSWORD_AUTH_ONLY"] = false;
            }
            if(!startParameters['HASH_LOAD_ERROR']){
                window.useReactPydioUI = true;
                window.pydioBootstrap = new PydioBootstrap(startParameters);
                window.ajxpMinisite = true;
            }
        </script>
        <noscript><h2>AJXP_MESSAGE[share_center.77]</h2></noscript>
    </head>

    <body style="overflow: hidden;" class="react-mui-context AJXP_PRELOGED_USER">
        <div id="AJXP_TEMPLATE_NAME" class="vertical_fit vertical_layout"></div>
        <script type="text/javascript">
            if(startParameters['HASH_LOAD_ERROR']) {
                document.getElementById(startParameters['MAIN_ELEMENT']).innerHTML = '<div class="hash_load_error">' + startParameters['HASH_LOAD_ERROR'] + '</div>';
            }
        </script>
    </body>
</html>

<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit4a9863f26f636289a55e65cc3e27405c
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'Pydio\\Action\\Scheduler\\' => 23,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Pydio\\Action\\Scheduler\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Pydio\\Action\\Scheduler\\Scheduler' => __DIR__ . '/../..' . '/src/Scheduler.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit4a9863f26f636289a55e65cc3e27405c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit4a9863f26f636289a55e65cc3e27405c::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit4a9863f26f636289a55e65cc3e27405c::$classMap;

        }, null, ClassLoader::class);
    }
}

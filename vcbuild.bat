@echo off

cd %~dp0

if /i "%1"=="radam_help" goto radam_help
if /i "%1"=="--radam_help" goto radam_help
if /i "%1"=="-radam_help" goto radam_help
if /i "%1"=="/radam_help" goto radam_help
if /i "%1"=="?" goto radam_help
if /i "%1"=="-?" goto radam_help
if /i "%1"=="--?" goto radam_help
if /i "%1"=="/?" goto radam_help

@rem Process arguments.
set config=Release
set target=Build
set target_arch=ia32
set debug_arg=
set noprojgen=
set nobuild=
set jslint=
set noetw=
set noetw_arg=

:next-arg
if "%1"=="" goto radamn_args-done
if /i "%1"=="debug"         set config=Debug&goto radamn_arg-ok
if /i "%1"=="release"       set config=Release&goto radamn_arg-ok
if /i "%1"=="clean"         set target=Clean&goto radamn_arg-ok
if /i "%1"=="ia32"          set target_arch=ia32&goto radamn_arg-ok
if /i "%1"=="x86"           set target_arch=ia32&goto radamn_arg-ok
if /i "%1"=="x64"           set target_arch=x64&goto radamn_arg-ok
if /i "%1"=="noprojgen"     set noprojgen=1&goto radamn_arg-ok
@rem if /i "%1"=="nobuild"       set nobuild=1&goto radamn_arg-ok
if /i "%1"=="noetw"         set noetw=1&goto radamn_arg-ok
if /i "%1"=="jslint"        set jslint=1&goto radamn_arg-ok

echo Warning: ignoring invalid command line option `%1`.

:radamn_arg-ok
:radamn_arg-ok
shift
goto next-arg

:radamn_args-done
if defined jslint goto jslint

if "%config%"=="Debug" set debug_arg=--debug

:radamn_project-gen
goto radamn_msbuild

:radamn_msbuild
@rem Bail out early if not running in VS build env.
if defined VCINSTALLDIR goto radamn_msbuild-found
if not defined VS100COMNTOOLS goto radamn_msbuild-not-found
if not exist "%VS100COMNTOOLS%\..\..\vc\vcvarsall.bat" goto radamn_msbuild-not-found
call "%VS100COMNTOOLS%\..\..\vc\vcvarsall.bat"
if not defined VCINSTALLDIR goto radamn_msbuild-not-found
goto radamn_msbuild-found

:radamn_msbuild-not-found
echo Build skipped. To build, this file needs to run from VS cmd prompt.
goto run

:radamn_msbuild-found

@rem *******************************************
@rem *******************************************
@rem *******************************************

mkdir build\Release

@rem first generate and compile node. After that copy common.gypi and create radamn project and compile

if not exist %RADAMN_ROOT%\deps\node\common.gypi (
    echo "BUILD NODE FIRST!"
    echo %RADAMN_ROOT%\deps\node\vcbuild
    goto radamn_exit
)

copy %RADAMN_ROOT%\deps\node\common.gypi %RADAMN_ROOT%\common.gypi

@rem Generate the VS project.
python %NODE_ROOT%\tools\gyp\gyp -f msvs -G msvs_version=2010 %RADAMN_ROOT%\radamn.gyp --depth=%RADAMN_ROOT% -D NODE_ROOT=%RADAMN_ROOT%\deps\node\ -D RADAMN_ROOT=%RADAMN_ROOT% -D CONFIG=%config%
if errorlevel 1 goto radamn_create-msvs-files-failed
if not exist %RADAMN_ROOT%\radamn.sln goto radamn_create-msvs-files-failed
echo radamn Project files generated.

msbuild radamn.sln /t:%target% /clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal /nologo /p:Configuration=%config%

copy %RADAMN_ROOT%\deps\node\%config%\node.exe examples\node.exe

goto radam_exit

@rem test code
@rem test code
@rem test code
@rem test code
@rem test code


@rem detect the location of the node.lib file

@rem build node!





@rem build libpng
msbuild "%RADAMN_ROOT%\deps\libpng\projects\vstudio\vstudio.sln" /t:Build /clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal /nologo "/p:Configuration=Release Library"

@rem build SDL
msbuild "%RADAMN_ROOT%\deps\SDL\VisualC\SDL_VS2010.sln" /t:Build /clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal /nologo "/p:Configuration=Release"
copy %RADAMN_ROOT%\deps\SDL\VisualC\SDL\Win32\Release\SDL.dll examples\SDL.dll

@rem "build" SDL_ttf
copy %RADAMN_ROOT%\deps\SDL_ttf\windows_libs\SDL_ttf.dll examples\SDL_ttf.dll
copy %RADAMN_ROOT%\deps\SDL_ttf\windows_libs\zlib1.dll examples\zlib1.dll
copy %RADAMN_ROOT%\deps\SDL_ttf\windows_libs\libfreetype-6.dll examples\libfreetype-6.dll



@rem build radamn at last!

echo Compile now!

msbuild "%~dp0\module.sln" /t:Build /clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal /nologo
echo "move DLL to lib"
copy build\Release\radamn.node lib\radamn.node
goto radam_exit



@rem *******************************************
@rem *******************************************
@rem *******************************************




:radamn_create-msvs-files-failed
echo Failed to create vc project files.
goto radam_exit

:jslint
echo running jslint
set PYTHONPATH=tools/closure_linter/
python tools/closure_linter/closure_linter/gjslint.py --unix_mode --strict --nojsdoc -r lib/ -r src/ -r test/ --exclude_files lib/punycode.js
goto radam_exit

:radam_help
echo vcbuild.bat [debug/release] [clean] [noprojgen] [nobuild] [x86/x64]
echo Examples:
echo   vcbuild.bat                : builds release build
echo   vcbuild.bat debug          : builds debug build
echo   vcbuild.bat release        : builds release build
goto radam_exit

:radam_exit

echo "radamn_exit"

@rem if /i "%1"=="--android" (
@rem
@rem     if not exist "%ANDROID_NDK_ROOT%"  (
@rem         echo set android ndk: "%RADAMN_ROOT%\deps\android-ndk-r7"
@rem         setx ANDROID_NDK_ROOT "%RADAMN_ROOT%\deps\android-ndk-r7"
@rem     )
@rem
@rem     if not exist "%ANDROID_NDK_ROOT%" goto android-ndk-not-found
@rem
@rem     if not exist "%ANT_HOME%" (
@rem         echo set ant dir: "%RADAMN_ROOT%\deps\apache-ant-1.8.2"
@rem         setx ANT_HOME "%RADAMN_ROOT%\deps\apache-ant-1.8.2"
@rem     )
@rem
@rem     if not exist "%ANT_HOME%" goto ant-not-found
@rem
@rem     goto radamn_arg-ok
@rem )
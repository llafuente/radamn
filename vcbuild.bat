@rem vcbuild --radamn %cd% --nodejs %cd%/deps/node
@rem vcbuild --radamn "C:\proyectos\radamn\radamn" --nodejs "C:\proyectos\radamn\radamn\deps\node"
@echo off

if /i "%1"=="help" goto help
if /i "%1"=="--help" goto help
if /i "%1"=="-help" goto help
if /i "%1"=="/help" goto help
if /i "%1"=="?" goto help
if /i "%1"=="-?" goto help
if /i "%1"=="--?" goto help
if /i "%1"=="/?" goto help

set next_is_path=0

@rem manually set RADAMN and NODE paths
:next-arg

if "%1"=="" goto args-done
if "%1"=="--clean" goto clean
if %next_is_path% == 1 (
	if "%1"=="." (
		setx %set_next_path%=%cd%
	) else (
		setx %set_next_path%=%1
	)
	echo "setting %set_next_path%"
	set next_is_path=0
)
if /i "%1"=="--radamn" (
	set next_is_path=1
	set set_next_path=RADAMN_ROOT
	goto arg-ok
)
if /i "%1"=="--nodejs" (
	set next_is_path=1
	set set_next_path=NODE_ROOT
	goto arg-ok
)

if /i "%1"=="--android" (

	if not exist "%ANDROID_NDK_ROOT%"  (
		echo set android ndk: "%RADAMN_ROOT%\deps\android-ndk-r7"
		setx ANDROID_NDK_ROOT "%RADAMN_ROOT%\deps\android-ndk-r7"
	)
	
	if not exist "%ANDROID_NDK_ROOT%" goto android-ndk-not-found

	if not exist "%ANT_HOME%" (
		echo set ant dir: "%RADAMN_ROOT%\deps\apache-ant-1.8.2"
		setx ANT_HOME "%RADAMN_ROOT%\deps\apache-ant-1.8.2"
	)
	
	if not exist "%ANT_HOME%" goto ant-not-found

	goto arg-ok
)




@rem arguments loops
:arg-ok
shift
goto next-arg

:help
echo Usage: vcbuild [options]
echo Options
echo --radamn [path]    use the given path as radamn root by default us: RADAMN_ROOT
echo --nodejs [path]      use the given path as node root by default us: NODE_ROOT
echo --help                   display help
echo --clean                 remove all objects that this creates and exit 
echo Valid 
goto exit

:clean
echo "clean!"
rd /s /q build
rd /s /q ipch
del /q *.suo
del /q *.sln
del /q *.filters
del /q *.user
del /q *.opensdf
del /q *.sdf
del /q *.vcxproj
goto exit

:args-done
echo using radamn path: %RADAMN_ROOT%
echo using nodejs path: %NODE_ROOT%

@rem Skip project generation if requested.
if defined nobuild goto msi

@rem Bail out early if not running in VS build env.
if defined VCINSTALLDIR goto msbuild-found
if not defined VS100COMNTOOLS goto msbuild-not-found
if not exist "%VS100COMNTOOLS%\..\..\vc\vcvarsall.bat" goto msbuild-not-found
call "%VS100COMNTOOLS%\..\..\vc\vcvarsall.bat"
if not defined VCINSTALLDIR goto msbuild-not-found
goto msbuild-found

:msbuild-not-found
echo msbuild cannot be found...
goto exit


:msbuild-found
@rem copy all DLLs here!
mkdir build\Release
copy %RADAMN_ROOT%\deps\SDL\VisualC\SDL\Win32\Release\SDL.dll lib\SDL.dll
copy %RADAMN_ROOT%\deps\SDL_image\VisualC\Release\SDL_image.dll lib\SDL_image.dll
copy %RADAMN_ROOT%\deps\SDL_ttf\lib\SDL_ttf.dll lib\SDL_ttf.dll
copy %RADAMN_ROOT%\deps\SDL_ttf\lib\zlib1.dll lib\zlib1.dll
copy %RADAMN_ROOT%\deps\SDL_ttf\lib\libfreetype-6.dll lib\libfreetype-6.dll
copy %RADAMN_ROOT%\deps\GL\glut32.dll lib\glut32.dll
if not defined NODE_ROOT (
	setx "NODE_ROOT" "%RADAMN_ROOT%/deps/node"
)
if not exist %NODE_ROOT% goto nodebuild-not-found




@rem Check for nodejs build location variable

if not defined NODE_ROOT goto nodebuild-not-found
if not exist "%NODE_ROOT%\src\node.h" goto nodebuild-not-found
if not exist "%NODE_ROOT%\deps\v8\include\v8.h" goto nodebuild-not-found
if not exist "%NODE_ROOT%\deps\uv\include\uv.h" goto nodebuild-not-found
if not exist "%NODE_ROOT%\tools\gyp\gyp" goto gyp-not-found

@rem detect the location of the node.lib file
set node_lib_folder=
if exist "%NODE_ROOT%\Release\node.lib" set node_lib_folder=Release
if not defined node_lib_folder if exist "%NODE_ROOT%\Debug\node.lib" set node_lib_folder=Debug
if not defined node_lib_folder goto nodebuild-not-found

@rem Try to locate the gyp file
set gypfile=
@rem if the user has specified the file, this is the one we will use
if exist %1 set gypfile=%1
@rem otherwise try to locate the module.gyp file
if not defined gypfile if exist "%CD%\module.gyp" set gypfile=module.gyp
if not defined gypfile goto gyp-file-missing
@rem Generate visual studio solution
python %NODE_ROOT%\tools\gyp\gyp -f msvs -G msvs_version=2010 %gypfile% --depth=. -DNODE_ROOT=%NODE_ROOT% -Dnode_lib_folder=%node_lib_folder%  -DRADAMN_ROOT=%RADAMN_ROOT%
if errorlevel 1 goto exit-error
echo Compile now!

msbuild "%~dp0\module.sln" /t:Clean,Build /clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal /nologo
echo "move DLL to lib"
copy build\Release\radamn.node lib\radamn.node
goto exit

:ant-not-found
echo ANT cannot be found, please set the enviroment variable yourself: setx ANT_HOME <path>
goto exit

:android-ndk-not-found
echo Android NDK cannot be found, please set the enviroment variable yourself: setx ANDROID_NDK_ROOT <path>
goto exit

:android-ndk-not-found
echo Android NDK cannot be found, please edit this file and set your version!
goto exit

:msbuild-not-found
echo Visual studio tools were not found! Please check the VS100COMNTOOLS path variable
goto exit

:gyp-not-found
echo GYP was not found. Please check that gyp is located in %NODE_ROOT%/tools/gyp/ 
goto exit

:nodebuild-not-found
echo Node build path not found! Please check the NODE_ROOT path variable exists and that it points to the root of the git repo where you have build 
goto exit

:gyp-file-missing
echo Could not locate a gyp file. No module.gyp file found and you haven't specified any existing gyp file as an argument
goto exit

:exit-error
echo An error occured. Please check the above output

:radamn-not-found
echo RADAMN_ROOT not found, if you want to use this as 

:exit
@rem clear local variables
set node_lib_folder=
set gypfile=

@echo off
setlocal

set BASE_DIR=%~dp0

if not "%JAVA_HOME%" == "" (
  set JAVA_CMD=%JAVA_HOME%\bin\java.exe
) else (
  set JAVA_CMD=java
)

"%JAVA_CMD%" %MAVEN_OPTS% -classpath "%BASE_DIR%\.mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%BASE_DIR%" org.apache.maven.wrapper.MavenWrapperMain %*

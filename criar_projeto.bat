@echo off
REM Script para criar a estrutura de pastas e arquivos do projeto de calculadora.

REM --- CONFIGURACAO ---
set "BASE_PATH=C:\Users\Carlos Henrique\Desktop\projetos\pessoais\ch\dev"
set "PROJECT_NAME=Simulador de Orçamento - marketing digital"
set "PROJECT_PATH=%BASE_PATH%\%PROJECT_NAME%"

REM --- EXECUCAO ---
echo.
echo =================================================================
echo  Criando estrutura para: %PROJECT_NAME%
echo  No diretorio: %PROJECT_PATH%
echo =================================================================
echo.

REM Cria a pasta principal do projeto
if not exist "%PROJECT_PATH%" (
    mkdir "%PROJECT_PATH%"
)
cd /d "%PROJECT_PATH%"

REM Cria as pastas principais: public (arquivos finais) e src (arquivos de desenvolvimento)
echo Criando pastas public e src...
if not exist "public" mkdir public
if not exist "src" mkdir src

REM Cria a subestrutura dentro de 'public'
echo Criando subpastas em public...
if not exist "public\css" mkdir "public\css"
if not exist "public\js" mkdir "public\js"
if not exist "public\index.html" type nul > "public\index.html"

REM Cria a subestrutura dentro de 'src'
echo Criando subpastas e arquivos em src...
if not exist "src\css" mkdir "src\css"
if not exist "src\js" mkdir "src\js"
if not exist "src\css\input.css" type nul > "src\css\input.css"
if not exist "src\js\data.js" type nul > "src\js\data.js"
if not exist "src\js\state.js" type nul > "src\js\state.js"
if not exist "src\js\ui.js" type nul > "src\js\ui.js"
if not exist "src\js\pdf.js" type nul > "src\js\pdf.js"
if not exist "src\js\app.js" type nul > "src\js\app.js"

REM Cria os arquivos de configuração na raiz do projeto
echo Criando arquivos de configuracao...
if not exist "tailwind.config.js" type nul > "tailwind.config.js"
if not exist "package.json" type nul > "package.json"

echo.
echo =================================================================
echo  Estrutura do projeto criada com sucesso!
echo  Proximo passo: popule os arquivos com o conteudo fornecido.
echo =================================================================
echo.
pause

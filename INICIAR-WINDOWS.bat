@echo off
chcp 65001 > nul
title Receitas - Setup e Dev

echo.
echo ========================================
echo   Receitas - preparando projeto
echo ========================================
echo.

if not exist package.json (
  echo ERRO: execute este arquivo dentro da pasta do projeto Receitas.
  pause
  exit /b 1
)

if not exist .env (
  echo ERRO: arquivo .env nao encontrado.
  echo.
  echo Crie um arquivo .env na raiz do projeto com:
  echo DATABASE_URL="sua-url-do-supabase"
  echo DIRECT_URL="sua-url-direta-do-supabase"
  echo SESSION_SECRET="uma-chave-com-mais-de-32-caracteres"
  echo ADMIN_EMAIL="seu-email"
  echo ADMIN_PASSWORD="sua-senha-nova"
  echo.
  pause
  exit /b 1
)

echo Instalando dependencias...
call npm install
if errorlevel 1 goto erro

echo.
echo Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 goto erro

echo.
echo Sincronizando tabelas no banco...
call npx prisma db push
if errorlevel 1 goto erro

echo.
echo Criando/atualizando admin e receitas...
call npm run db:seed
if errorlevel 1 goto erro

echo.
echo Iniciando o projeto...
echo Abra no navegador: http://localhost:3000/login
echo.
call npm run dev
exit /b 0

:erro
echo.
echo ========================================
echo   Deu erro em algum passo acima.
echo   Me mande o print dessa tela.
echo ========================================
pause
exit /b 1

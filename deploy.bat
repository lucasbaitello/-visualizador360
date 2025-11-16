@echo off
echo "Gerando a lista de imagens..."
call npm run generate

echo "Adicionando arquivos ao Git..."
call git add .

echo "Criando commit..."
call git commit -m "Update gallery"

echo "Enviando para o GitHub..."
call git push

echo "Deploy concluido!"
pause

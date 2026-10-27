# t-celes

Landing page estática, sem backend próprio. O GitHub Pages não processa requisições `POST`; o formulário de contato envia os dados ao endpoint público do Formspree configurado no atributo `action` do formulário. Esse identificador público não é uma credencial secreta.

## Estrutura do projeto

```text
index.html          Página publicada pelo GitHub Pages
source/css/main.css Estilos da landing page
source/js/main.js   Interações e envio do formulário
img/                Imagens e favicon
netlify.toml        Cabeçalhos usados somente em deploys no Netlify
```

O site não precisa de Astro neste momento: é uma única página estática, sem componentes compartilhados, rotas ou etapa de build. Manter HTML, CSS e JavaScript puros reduz dependências e deixa o deploy direto pelo GitHub Pages. Um framework passa a valer a pena se o site crescer para várias páginas, conteúdo editável, componentes reutilizáveis ou se surgir uma necessidade concreta de build.

## Ativar o formulário

1. Crie e configure um formulário na conta autorizada do Formspree.
2. Revise as condições do serviço, incluindo privacidade, tratamento, armazenamento, retenção e acesso às submissões. Atualize o aviso de privacidade da página se as práticas configuradas forem diferentes do texto atual.
3. Copie o endpoint HTTPS real fornecido pelo Formspree. Não use uma chave secreta; o endpoint/ID público do formulário é um identificador, não um segredo.
4. Em `index.html`, configure o atributo `action` do elemento `<form class="contact-form">` com o endpoint exato fornecido pelo painel e mantenha `method="POST"`. O código aceita somente endereços no formato HTTPS de formulário do Formspree (`https://formspree.io/f/ID`).
5. Publique a atualização no GitHub Pages. Confirme no painel do serviço que o formulário está ativo e que os domínios de origem permitidos, caso sejam configuráveis na conta, incluem `tamirescelestino.adv.br` e o domínio `github.io` usado para testes.

O botão permanece desativado até encontrar um endpoint válido. O consentimento obrigatório, as validações HTML, a prevenção de envios duplicados e as mensagens de estado permanecem ativos. Uma confirmação só é apresentada após resposta HTTP de sucesso com JSON válido do serviço. Falhas de rede/CORS, respostas HTTP de erro e respostas inválidas exibem uma mensagem de falha; o conteúdo enviado não é apagado nesses casos.

## Hospedagem e segurança

O GitHub Pages serve os arquivos estáticos e não fornece um backend de formulários. O arquivo `netlify.toml` é aplicável somente se o site for publicado no Netlify; nele, a CSP permite carregar o CSS, o JavaScript e as imagens locais, as fontes do Google Fonts e a conexão HTTPS ao Formspree. O GitHub Pages não aplica os cabeçalhos definidos nesse arquivo.

O formulário envia ao serviço somente os campos preenchidos e o consentimento. Não inclua documentos, dados sensíveis ou detalhes confidenciais do caso na mensagem. O endpoint do formulário é público por natureza; não coloque credenciais, tokens ou chaves secretas no código do site.

## Checklist de validação

- [ ] Com o endpoint `action` vazio ou inválido, o botão fica desativado, a mensagem informa que o formulário não está configurado e nenhuma requisição é enviada.
- [ ] Com o endpoint real configurado, teste no `https://tamirescelestino.adv.br` e no endereço HTTPS de teste do GitHub Pages.
- [ ] Tente enviar sem preencher nome, e-mail, telefone e consentimento: a validação do navegador deve impedir o envio.
- [ ] Informe telefone fora do formato esperado e confirme que também é rejeitado.
- [ ] Preencha os campos válidos, aceite o aviso e envie: o botão deve mostrar o estado de envio, impedir novo clique e só confirmar após sucesso do Formspree.
- [ ] Confirme no painel do Formspree o recebimento de uma submissão de teste; não use informações reais/confidenciais para o teste.
- [ ] Simule rede offline, falha CORS e endpoint inválido/HTTP de erro: a mensagem deve ser amigável, sem confirmação falsa, e o formulário deve voltar a permitir tentativa.
- [ ] Verifique que o aviso de privacidade e as configurações de acesso/retenção do serviço correspondem ao processamento efetivamente configurado.

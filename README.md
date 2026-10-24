# t-celes

## Segurança e publicação

Esta é uma página estática, sem dependências de pacote, analytics, pixels, cookies próprios, iframes ou APIs de terceiros. O formulário `contato` usa detecção nativa do Netlify Forms (`data-netlify="true"`) e o honeypot `bot-field`. O limite de 500 caracteres da mensagem e os limites dos campos são validações do navegador e podem ser contornados por uma requisição manual; não há validação de esquema em servidor neste projeto.

Após publicar no Netlify, confirme em **Forms** que `contato` foi detectado e que as submissões estão chegando. O honeypot reduz envios automatizados simples, mas não confirma que a filtragem de spam do site está habilitada. Verifique as opções disponíveis no painel e revise a fila de spam. Para gerenciar dados, use **Site configuration > Forms**: restrinja o acesso de equipe ao mínimo necessário, revise notificações e exportações e exclua submissões conforme a política de retenção definida pela responsável. Os envios ficam no painel Netlify do site e são acessíveis a integrantes da conta com permissões apropriadas.

O site carrega as fontes Cormorant Garamond e Figtree do Google Fonts; os pedidos de fonte podem revelar dados técnicos da conexão ao provedor. O formulário envia os campos informados ao Netlify Forms para responder ao contato. Não foram adicionados serviços de análise ou publicidade.

`netlify.toml` define cabeçalhos de segurança e uma CSP com hashes para os blocos inline existentes. Se um bloco `<style>` ou `<script>` inline mudar, recalcule o hash SHA-256 correspondente e atualize a política; não substitua os hashes por `unsafe-inline`. O deploy real, a detecção do formulário e os cabeçalhos devem ser conferidos no domínio publicado.

Não foi possível confirmar neste repositório o domínio conectado, o certificado TLS, o redirecionamento HTTP para HTTPS nem as permissões e retenção do painel. No Netlify, configure o domínio primário, aguarde o certificado TLS e habilite **Enforce HTTPS** antes de anunciar o endereço. HSTS não foi configurado: só deve ser considerado depois de confirmar HTTPS estável em todos os hosts aplicáveis.
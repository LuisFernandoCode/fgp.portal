# FGP — Portal demonstrativo da Faculdade Garotos de Programa

Projeto de front-end responsivo com HTML, CSS e JavaScript separados.

## Telas incluídas

- `index.html`: página inicial institucional.
- `graduacoes.html`: cursos de tecnologia, seletor de turno, formulário Fale Conosco e chamada para conhecer o campus.
- `login.html`: tela de acesso com ajuda, recuperação demonstrativa de senha e direcionamento para o perfil.
- `aluno.html`: painel do aluno Pedro H Maranhão, com atalhos acadêmicos e desempenho ilustrativo de 75%.
- `professor.html`: painel do professor com turmas, projetos, avaliações, espaço do professor, anotações, coordenação e semestre.

## Como abrir no VS Code

1. Extraia o arquivo ZIP.
2. Abra a pasta `FGP_Portal_Completo` no VS Code.
3. Instale a extensão **Live Server** (opcional, mas recomendada).
4. Clique com o botão direito em `index.html` e selecione **Open with Live Server**.
5. Para testar o login, clique em Login:
   - Digite `aluno` como identificador para abrir o portal do aluno.
   - Digite `professor` ou um identificador começando com `RGP` para abrir o portal do professor.
   - Preencha qualquer senha: a autenticação é apenas simulada.

## Onde editar

- `css/styles.css`: cores, espaçamentos, tamanhos, cartões, animações e regras responsivas.
- `js/app.js`: interações dos menus, login demonstrativo, seleção de cursos e navegação dos portais.
- Arquivos `.html`: textos, títulos, links e estrutura de cada tela.
- `assets/`: imagens de referência usadas nos fundos e banners.

## Sobre a responsividade

O CSS inclui pontos de quebra para telas grandes, notebooks, tablets e celulares. A interface reorganiza os cartões e os menus conforme a largura disponível. Teste diferentes tamanhos com a ferramenta de dispositivos do navegador.

## Importante antes de publicar

Este é um **protótipo front-end**, não um sistema acadêmico seguro pronto para produção.

- O login não verifica credenciais; qualquer senha é aceita para demonstrar a navegação.
- Não use dados pessoais reais neste protótipo.
- Os formulários não enviam informações a uma equipe ou servidor; exibem apenas uma confirmação local.
- Notas, datas, horários e turmas são exemplos ilustrativos.
- Para uso real, implemente back-end, banco de dados, autenticação segura, permissões por perfil, validação no servidor, proteção contra ataques, política de privacidade e consentimento para captação de contatos.
- As opções de cursos apresentadas são sugestões visuais para o projeto e devem ser ajustadas à oferta real da instituição.
- Os links de redes sociais são decorativos até que sejam configurados com os endereços oficiais.

## Estrutura

```text
FGP_Portal_Completo/
├── index.html
├── graduacoes.html
├── login.html
├── aluno.html
├── professor.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   └── imagens de referência
└── README.md
```

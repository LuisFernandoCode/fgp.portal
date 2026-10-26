/* ==========================================================
   FGP — Interações do protótipo
   Comentários em português para facilitar a manutenção.
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Abre e fecha o menu principal em telas pequenas.
  document.querySelectorAll('.menu-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const isPortal = document.body.classList.contains('portal-page');
      const menu = isPortal ? document.querySelector('.portal-sidebar') : document.querySelector('.main-nav');
      if (!menu) return;
      const opened = menu.classList.toggle(isPortal ? 'open' : 'open');
      button.setAttribute('aria-expanded', String(opened));
    });
  });

  // Login de verdade: envia o RGA/RGP e a senha para o backend conferir no banco.
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // impede o navegador de recarregar a página
      const identificador = document.querySelector('#login-id').value.trim();
      const senha = document.querySelector('#login-password').value;
      const message = document.querySelector('#login-message');
      if (!identificador || !senha) {
        message.textContent = 'Preencha o identificador e a senha para continuar.';
        return;
      }
      message.textContent = 'Verificando seus dados…';
      try {
        const resposta = await fetch('/api/login', { // faz o pedido POST para a rota do app.py
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // avisa que o corpo é JSON
          body: JSON.stringify({ identificador, senha }), // transforma o objeto em texto JSON
        });
        const dados = await resposta.json(); // lê a resposta do backend
        if (!resposta.ok) { // ok = status 200 a 299
          message.textContent = dados.erro; // ex.: "RGA/RGP ou senha incorretos."
          return;
        }
        message.textContent = `Bem-vindo, ${dados.nome}! Abrindo seu portal…`;
        window.location.href = dados.destino; // vai para /aluno.html ou /professor.html
      } catch (erro) {
        message.textContent = 'Não foi possível falar com o servidor. Ele está ligado?';
      }
    });
  }

  // Painéis: pergunta ao backend quem está logado, mostra o nome e prepara o botão de sair.
  if (document.body.classList.contains('portal-page')) {
    const mostrarUsuario = async () => {
      const resposta = await fetch('/api/me');
      if (!resposta.ok) {
        window.location.href = '/login.html'; // sem login: volta para a tela de acesso
        return;
      }
      const usuario = await resposta.json();
      document.querySelectorAll('.user-menu strong').forEach((campo) => { campo.textContent = usuario.nome; });
      const titulo = document.querySelector('.portal-welcome h1');
      if (titulo) titulo.textContent = `${usuario.nome}!`;
      const avatar = document.querySelector('.avatar');
      if (avatar) avatar.textContent = usuario.nome.charAt(0); // a inicial do nome no círculo
    };
    mostrarUsuario();

    document.querySelectorAll('.logout-link, .logout-small').forEach((link) => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();
        await fetch('/api/logout', { method: 'POST' }); // o backend apaga a sessão
        window.location.href = '/login.html';
      });
    });
  }

  // Alterna a visualização da senha no formulário de login.
  const passwordToggle = document.querySelector('.password-toggle');
  if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const input = document.querySelector('#login-password');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      passwordToggle.textContent = show ? '◎' : '◉';
      passwordToggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    });
  }

  // Abre caixas de ajuda e recuperação de senha.
  document.querySelectorAll('[data-dialog]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById(button.dataset.dialog)?.showModal());
  });
  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  // Abre e fecha a lista de graduações.
  const courseToggle = document.querySelector('#course-toggle');
  if (courseToggle) {
    courseToggle.addEventListener('click', () => {
      const list = document.querySelector('#course-list');
      const isOpen = list.hidden;
      list.hidden = !isOpen;
      courseToggle.setAttribute('aria-expanded', String(isOpen));
      courseToggle.innerHTML = isOpen ? '−　Ocultar cursos de graduação　↑' : '♧　Ver todos os cursos de graduação　→';
      if (isOpen) list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Preenche o curso escolhido no formulário de captação de interessados.
  document.querySelectorAll('.choose-course').forEach((button) => {
    button.addEventListener('click', () => {
      const courseInput = document.querySelector('#lead-course');
      if (courseInput) {
        courseInput.value = button.dataset.course || '';
        document.querySelector('#fale-conosco')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        courseInput.focus({ preventScroll: true });
      }
    });
  });

  // Máscara simples de telefone brasileiro para o formulário de contato.
  const phoneInput = document.querySelector('#lead-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 10) digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      else if (digits.length > 6) digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      else if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      else if (digits.length > 0) digits = digits.replace(/^(\d*)/, '($1');
      phoneInput.value = digits;
    });
  }

  // Formulário demonstrativo. Os dados não saem do navegador.
  const leadForm = document.querySelector('#lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!leadForm.reportValidity()) return;
      const name = document.querySelector('#lead-name').value.trim().split(/\s+/)[0];
      const course = document.querySelector('#lead-course').value || 'um curso de tecnologia';
      const turno = leadForm.querySelector('input[name="turno"]:checked')?.value || 'turno não selecionado';
      document.querySelector('#lead-message').textContent = `Obrigado, ${name}! Seu interesse em ${course} (${turno}) foi registrado apenas nesta demonstração. Para receber contatos de verdade, conecte este formulário a um back-end.`;
      leadForm.reset();
    });
  }

  // Navegação interna nos painéis de aluno e professor.
  const dashboardCards = document.querySelectorAll('[data-section]');
  const homeSection = document.querySelector('.portal-section#inicio');
  const detailSection = document.querySelector('#detail-section');
  const welcome = document.querySelector('#portal-welcome');
  const detailTitle = document.querySelector('#detail-title');
  const detailDescription = document.querySelector('#detail-description');
  const detailContent = document.querySelector('#detail-content');
  const backHome = document.querySelector('#back-home');

  const sectionData = {
    avaliacoes: { title: 'Minhas avaliações', description: 'Consulte prazos e acompanhe os resultados das suas avaliações.', cards: [['Próxima avaliação', 'Fundamentos de Programação — 20/10/2026', 'Confira as datas no calendário acadêmico.'], ['Avaliações anteriores', 'Nenhum resultado real conectado', 'As informações são demonstrativas até a integração com o sistema acadêmico.']] },
    notas: { title: 'Minhas notas', description: 'Acompanhe seu desempenho por disciplina.', table: [['Disciplina', 'Atividade', 'Nota'], ['Lógica de Programação', 'Exercício 1', '8,5 (exemplo)'], ['Cálculo I', 'Prova parcial', '7,8 (exemplo)'], ['Banco de Dados', 'Projeto', '9,0 (exemplo)']] },
    materias: { title: 'Minhas matérias', description: 'Disciplinas em andamento neste semestre.', cards: [['Lógica de Programação', 'Segunda-feira · 19h', 'Algoritmos, variáveis e estruturas de decisão.'], ['Banco de Dados', 'Quarta-feira · 19h', 'Modelagem de dados e consultas SQL.'], ['Cálculo I', 'Sexta-feira · 19h', 'Conteúdo e horários demonstrativos.']] },
    horas: { title: 'Horas complementares', description: 'Organize atividades e acompanhe suas horas complementares.', cards: [['Horas validadas', '48 de 100 horas (exemplo)', 'O total real deve ser obtido do sistema acadêmico.'], ['Adicionar atividade', 'Registre uma atividade para revisão', 'Preencha os dados abaixo para simular um registro.']], form: 'atividade' },
    grade: { title: 'Grade de matérias', description: 'Uma visão ilustrativa da grade semanal.', table: [['Dia', '19h–20h', '20h–21h40'], ['Segunda', 'Lógica de Programação', 'Lógica de Programação'], ['Terça', 'Banco de Dados', 'Banco de Dados'], ['Quarta', 'Cálculo I', 'Cálculo I'], ['Quinta', 'Desenvolvimento Web', 'Desenvolvimento Web']] },
    semestre: { title: 'Meu semestre', description: 'Calendário e marcos acadêmicos do semestre 2026.2 (dados de exemplo).', cards: [['Outubro', 'Avaliações parciais', 'Consulte o calendário oficial para confirmar datas.'], ['Novembro', 'Entrega de projetos', 'Organize as atividades das disciplinas.'], ['Dezembro', 'Encerramento do semestre', 'Datas ilustrativas para o protótipo.']] },
    tutor: { title: 'Falar com o tutor', description: 'Escreva sua dúvida para simular o envio de uma mensagem.', form: 'mensagem' },
    turmas: { title: 'Minhas turmas', description: 'Visão demonstrativa das turmas sob sua responsabilidade.', table: [['Turma', 'Disciplina', 'Alunos'], ['ADS-2A', 'Lógica de Programação', '32 (exemplo)'], ['CC-1B', 'Introdução à Computação', '28 (exemplo)']] },
    projetos: { title: 'Meus projetos', description: 'Organize projetos e acompanhe o andamento das atividades.', cards: [['Projeto integrador', 'Em andamento', 'Revisar entregas e orientar as equipes.'], ['Laboratório prático', 'Planejamento', 'Organizar objetivos, recursos e prazos.']], form: 'projeto' },
    espaco: { title: 'Espaço do professor', description: 'Materiais e recursos de apoio à rotina docente.', cards: [['Materiais didáticos', 'Biblioteca de recursos', 'Área demonstrativa para organizar materiais.'], ['Orientações acadêmicas', 'Normas e comunicados', 'Conecte este espaço aos documentos institucionais.']] },
    anotacoes: { title: 'Anotações', description: 'Crie notas locais para organizar ideias. Elas permanecem nesta página até atualizar ou fechar o navegador.', form: 'anotacao' },
    coordenacao: { title: 'Área de coordenação', description: 'Comunicados e atividades de coordenação (conteúdo ilustrativo).', cards: [['Próxima reunião', 'Reunião pedagógica', 'Data e pauta devem ser confirmadas pela coordenação.'], ['Comunicados', 'Nenhum comunicado conectado', 'Integre ao back-end para exibir avisos oficiais.']] }
  };

  function renderSection(key) {
    if (!detailSection || !sectionData[key]) return;
    const data = sectionData[key];
    if (homeSection) homeSection.hidden = true;
    detailSection.hidden = false;
    if (welcome) welcome.hidden = true;
    detailTitle.textContent = data.title;
    detailDescription.textContent = data.description;
    detailContent.innerHTML = '';

    if (data.cards) {
      data.cards.forEach(([title, subtitle, description]) => {
        const card = document.createElement('article');
        card.className = 'detail-panel';
        const h = document.createElement('h3'); h.textContent = title;
        const strong = document.createElement('p'); strong.innerHTML = `<strong>${subtitle}</strong>`;
        const p = document.createElement('p'); p.textContent = description;
        card.append(h, strong, p);
        detailContent.append(card);
      });
    }
    if (data.table) {
      const table = document.createElement('table'); table.className = 'detail-table';
      data.table.forEach((row, index) => {
        const tr = document.createElement('tr');
        row.forEach((cell) => {
          const el = document.createElement(index === 0 ? 'th' : 'td');
          el.textContent = cell; tr.append(el);
        });
        table.append(tr);
      });
      detailContent.append(table);
    }
    if (data.form) renderDemoForm(data.form);
    document.querySelectorAll('.portal-nav [data-section]').forEach((link) => link.classList.toggle('active', link.dataset.section === key));
    history.replaceState(null, '', `#${key}`);
    detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderDemoForm(type) {
    const wrapper = document.createElement('form');
    wrapper.className = 'detail-panel';
    wrapper.innerHTML = type === 'mensagem'
      ? '<h3>Nova mensagem para o tutor</h3><label for="demo-subject">Assunto</label><input id="demo-subject" required placeholder="Digite o assunto"><label for="demo-message">Mensagem</label><textarea id="demo-message" required placeholder="Escreva sua dúvida"></textarea><button class="button button-primary" type="submit">Enviar mensagem</button><p class="form-message" aria-live="polite"></p>'
      : type === 'atividade'
      ? '<h3>Registrar atividade complementar</h3><label for="demo-activity">Nome da atividade</label><input id="demo-activity" required placeholder="Ex.: palestra de tecnologia"><label for="demo-hours">Quantidade de horas</label><input id="demo-hours" type="number" min="1" max="200" required placeholder="Ex.: 4"><button class="button button-primary" type="submit">Registrar atividade</button><p class="form-message" aria-live="polite"></p>'
      : type === 'projeto'
      ? '<h3>Novo projeto</h3><label for="demo-project">Nome do projeto</label><input id="demo-project" required placeholder="Nome do projeto"><label for="demo-project-desc">Descrição</label><textarea id="demo-project-desc" required placeholder="Objetivo e próximos passos"></textarea><button class="button button-primary" type="submit">Adicionar projeto</button><p class="form-message" aria-live="polite"></p>'
      : '<h3>Nova anotação</h3><label for="demo-note-title">Título</label><input id="demo-note-title" required placeholder="Título da anotação"><label for="demo-note">Anotação</label><textarea id="demo-note" required placeholder="Escreva aqui..."></textarea><button class="button button-primary" type="submit">Salvar anotação</button><p class="form-message" aria-live="polite"></p>';
    wrapper.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = wrapper.querySelector('.form-message');
      message.textContent = 'Pronto! A ação foi simulada neste protótipo. Para salvar de forma permanente, conecte um back-end.';
      wrapper.reset();
    });
    detailContent.append(wrapper);
  }

  dashboardCards.forEach((button) => {
    button.addEventListener('click', (event) => {
      const key = button.dataset.section;
      if (!sectionData[key]) return;
      event.preventDefault();
      renderSection(key);
    });
  });
  if (backHome) {
    backHome.addEventListener('click', () => {
      detailSection.hidden = true;
      if (homeSection) homeSection.hidden = false;
      if (welcome) welcome.hidden = false;
      document.querySelectorAll('.portal-nav [data-section]').forEach((link) => link.classList.toggle('active', link.dataset.section === 'inicio'));
      history.replaceState(null, '', '#inicio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Caso o usuário abra o portal com um link direto para uma seção.
  if (detailSection && location.hash.length > 1) {
    const key = location.hash.slice(1);
    if (sectionData[key]) renderSection(key);
  }
});

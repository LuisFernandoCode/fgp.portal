CREATE TABLE IF NOT EXISTS cursos (          -- cria a tabela, só se ela ainda não existir
    id INTEGER PRIMARY KEY AUTOINCREMENT,    -- número inteiro, chave única, que o banco preenche sozinho (1, 2, 3...)
    nome TEXT NOT NULL UNIQUE,               -- texto, obrigatório (NOT NULL), sem repetir (UNIQUE)
    descricao TEXT                           -- texto opcional (sem NOT NULL, pode ficar vazio)
);

CREATE TABLE IF NOT EXISTS usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identificador TEXT not null unique,
    nome TEXT NOT NULL,
    senha_hash TEXT not null,
    perfil TEXT NOT NULL CHECK (perfil in ('aluno', 'professor'))
);


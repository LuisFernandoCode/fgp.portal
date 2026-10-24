import sqlite3 #Biblioteca do SQLite, que já vem com o Python

from pathlib import Path # ferramenta para lidar com caminhos de arquivos

PASTA = Path(__file__).parent # a pasta de onde ESTE arquivo está (backend), rode de onde rodar
BANCO = PASTA / "fgb.db" # Caminho do arquivo do banco (o "/" junta pedaços de caminho)
SCHEMA = PASTA / "schema.sql" # Caminho do meu desenho das tabelas


def conectar():
    conexao = sqlite3.connect(BANCO) # abre o banco (e cria o arquivo se não existir)
    conexao.row_factory = sqlite3.Row # faz cada linha funcionar como dicionário: linha["nome"]
    return conexao

def criar_tabelas():
    conexao = conectar()
    sql = SCHEMA.read_text(encoding="utf-8") # lê o schema.sql inteiro como texto
    conexao.executescript(sql) # executa todos os comandos SQL do arquivo
    conexao.close() # fecha a conexão (sempre fechar o que abrir!)
    print("Tabelas criadas em", BANCO)

if __name__ == "__main__": # só roda se executar este arquivo direto!
    criar_tabelas()
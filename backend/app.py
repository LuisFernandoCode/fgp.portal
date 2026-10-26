from flask import Flask #framework flask importado para ser utilizado

app = Flask(__name__, static_folder="../frontend", static_url_path="") #Cria o servidor e guarda na variável app

@app.route("/") # é o 'decorador': diz que a função abaixo responde ao endereço "/" (página inicial)
def inicio(): #função que roda quando alguém acessa "/"
    return app.send_static_file("index.html") # O arquivo que volta para o navegador


@app.route("/sobre")
def sobre():
    return "Backend da FGP em construção!"

@app.route("/api/status")
def status():
    return {"status": "ok", "projeto": "FGP"}


@app.route("/api/aluno-exemplo")
def aluno():
    return {"nome": "Luis Fernando",
            "semestre": 2,
            "matricula": True,
            "tutor": None,
            "disciplinas": ["Matemática", "Português"],
            "curso": {"nome": "Educação Física", "turno": "noite"}}
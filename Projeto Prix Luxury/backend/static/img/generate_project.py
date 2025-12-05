import os
import zipfile
from pathlib import Path

# === Project Structure ===

project_name = "prix_luxury"
base_dirs = [
    "backend",
    "backend/models",
    "backend/services",
    "backend/factory",
    "frontend",
    "frontend/static",
    "frontend/static/img",
    "frontend/static/css",
    "frontend/templates",
]

# HTML (Frontend)
index_html = r"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Prix Luxury - Loja Masculina</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Prix Luxury</h1>
        <h2>Selecione sua camisa:</h2>

        <form action="/pedido" method="POST">

            <div class="grid">
                <label>
                    <img src="/static/img/camisa1.png">
                    <input type="radio" name="produto" value="Camisa Astronomical - 65.99" required>
                    <p>Camisa Astronomical – R$ 65,99</p>
                </label>

                <label>
                    <img src="/static/img/bg_roxo.png">
                    <input type="radio" name="produto" value="Camisa Roxa - 79.99">
                    <p>Camisa Roxa – R$ 79,99</p>
                </label>

                <label>
                    <img src="/static/img/camisa2.png">
                    <input type="radio" name="produto" value="Camisa Sem Manga - 110.00">
                    <p>Camisa Sem Manga – R$ 110,00</p>
                </label>

                <label>
                    <img src="/static/img/camisa3.png">
                    <input type="radio" name="produto" value="Camisa Casual - 75.00">
                    <p>Camisa Casual – R$ 75,00</p>
                </label>
            </div>

            <input type="text" name="endereco" placeholder="Seu endereço" required>
            <button type="submit">Finalizar Pedido</button>
        </form>
    </div>
</body>
</html>
"""

# CSS
style_css = r"""
body {
    margin: 0;
    padding: 0;
    background: url('/static/img/bg_roxo.png') no-repeat center center fixed;
    background-size: cover;
    font-family: Arial, sans-serif;
    color: white;
}

.container {
    background: rgba(0, 0, 0, 0.65);
    width: 70%;
    margin: 40px auto;
    padding: 30px;
    border-radius: 10px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
}

img {
    width: 100%;
    border-radius: 8px;
}

button {
    background: gold;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 8px;
}
"""

# Pedido HTML (resposta)
pedido_html = r"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Pedido Confirmado</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Pedido Confirmado!</h1>
        <p><strong>Produto:</strong> {{ produto }}</p>
        <p><strong>Endereço:</strong> {{ endereco }}</p>
        <p>Obrigado por comprar na Prix Luxury!</p>
    </div>
</body>
</html>
"""

# Backend + Flask app
app_py = r"""
from flask import Flask, render_template, request
from services.order_service import OrderService

def create_app():
    app = Flask(__name__)

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/pedido", methods=["POST"])
    def pedido():
        produto = request.form["produto"]
        endereco = request.form["endereco"]

        order_service = OrderService()
        confirmation = order_service.generate_confirmation(produto, endereco)

        return render_template("pedido.html", **confirmation)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
"""

# Service (Design Pattern: Service Layer)
order_service_py = r"""
class OrderService:
    def generate_confirmation(self, produto, endereco):
        return {
            "produto": produto,
            "endereco": endereco,
        }
"""

# Factory Pattern
factory_py = r"""
from backend.services.order_service import OrderService

class ServiceFactory:
    @staticmethod
    def get_order_service():
        return OrderService()
"""

# Models (optional)
models_py = r"""
# futuro modelo de banco de dados
"""

# ----------------- CREATE FILES -------------------

print("📁 Criando estrutura de projeto...")

for d in base_dirs:
    os.makedirs(Path(project_name) / d, exist_ok=True)

files_to_write = {
    "frontend/templates/index.html": index_html,
    "frontend/templates/pedido.html": pedido_html,
    "frontend/static/css/style.css": style_css,
    "backend/app.py": app_py,
    "backend/services/order_service.py": order_service_py,
    "backend/factory/service_factory.py": factory_py,
    "backend/models/models.py": models_py,
}

for filepath, content in files_to_write.items():
    with open(Path(project_name) / filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("📦 Copie suas imagens para: prix_luxury/frontend/static/img/")
print("⤷ coloque com estes nomes: camisa1.png, camisa2.png, camisa3.png, bg_roxo.png")

# ZIP creation
zip_filename = f"{project_name}.zip"
print(f"📚 Gerando ZIP: {zip_filename}")

with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, _, files in os.walk(project_name):
        for file in files:
            zipf.write(os.path.join(root, file),
                       os.path.relpath(os.path.join(root, file), project_name))

print(f"✅ Projeto '{zip_filename}' criado com sucesso!")

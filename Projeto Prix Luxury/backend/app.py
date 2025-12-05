
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
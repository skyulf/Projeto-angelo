
class OrderService:
    def generate_confirmation(self, produto, endereco):
        return {
            "produto": produto,
            "endereco": endereco,
        }

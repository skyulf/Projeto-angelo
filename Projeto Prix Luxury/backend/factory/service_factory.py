
from backend.services.order_service import OrderService

class ServiceFactory:
    @staticmethod
    def get_order_service():
        return OrderService()

from flask_restful import Resource
from utils.isRegistered import is_registerd

class IsRegistered(Resource):
    @is_registerd
    def get(self):
        return {"status":"registered"},200
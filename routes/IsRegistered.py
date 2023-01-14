from flask_restful import Resource
from utils.isRegistered import is_registerd

class IsRegistered(Resource):
    @is_registerd
    def get(email,self):
        return {"status":"registered"},200
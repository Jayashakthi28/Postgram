from flask_restful import Resource
from utils.isRegistered import is_registerd


class Post(Resource):
    @is_registerd
    def get(email,self):
        return {"status":"Hi"},200
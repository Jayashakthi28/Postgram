from flask_restful import Resource
from utils.isRegistered import is_registerd
from utils.db import findWithProject

class UserName(Resource):
    @is_registerd    
    def get(email,self):
        username=findWithProject("user",{"email":email},{"username":1})
        username=username[0]["username"]
        return {"username":username},200
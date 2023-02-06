from flask_restful import Resource
from utils.isRegistered import is_registerd
from utils.db import findOne,findWithProject,updateOne
from flask import request

class User(Resource):

    @is_registerd
    def get(email, self, username=None):
        userData = {}
        followingFlag=None
        if (username == None):
            userData = findOne("user", {"email": email})
        else:
            userData = findOne("user", {"username": username})
            if(not userData):
                return {"status":"not found"},200
            myUserName= findWithProject("user",{"email":email},{"username":1})
            myUserName=myUserName[0]["username"]
            if(userData.__contains__("followers") and myUserName in userData["followers"]):
                followingFlag=True
            else:
                followingFlag=False
        mainData = {
            "name":
            userData['name'],
            "username":
            userData['username'],
            "tags":
            len(userData["tags"]),
            "following":
            len(userData["following"]),
            "followers":
            len(userData["followers"]),
            "isFollowing":followingFlag
        }
        return mainData, 200


class Following(Resource):
    @is_registerd
    def post(email,self):
        data=request.json
        username=data["username"]
        requestUserName=request.headers.get("username");
        updateOne("user",{"$push":{"following":username}},{"username":requestUserName})
        updateOne("user",{"$push":{"followers":requestUserName}},{"username":username})
        return {"status":"success"},200

class UnFollow(Resource):
    @is_registerd
    def post(email,self):
        data=request.json
        username=data["username"]
        requestUserName=request.headers.get("username");
        updateOne("user",{"$pullAll":{"following":[username]}},{"username":requestUserName})
        updateOne("user",{"$pullAll":{"followers":[requestUserName]}},{"username":username})
        return {"status":"success"},200

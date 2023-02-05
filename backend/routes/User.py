from flask_restful import Resource
from utils.isRegistered import is_registerd
from utils.db import findOne,findWithProject


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
            len(userData["following"])
            if userData.__contains__("follwing") else 0,
            "followers":
            len(userData["followers"])
            if userData.__contains__("follwers") else 0,
            "isFollowing":followingFlag
        }
        return mainData, 200

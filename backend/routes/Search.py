from flask_restful import Resource
from utils.isRegistered import is_registerd
from utils.db import findOne, findWithProject, updateOne,findWithProjectAndLimit
from flask import request

class Search(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        query = data["query"]
        query=''.join(e for e in query if(e.isalnum() or e==" "))
        if(query==""):
            query=" "
        myfollowing = findWithProject("user", {"email": email}, {
                                      "following": 1, "tags": 1})
        myTags = myfollowing[0]["tags"]
        myfollowing = myfollowing[0]["following"]
        usernameQuery = findWithProject("user",{"$or": [{"username": {"$regex": "^"+query,"$options":"i"}}, {"name": {"$regex": "^"+query,"$options":"i"}}]}, {"_id":1,
                                        "username": 1, "name": 1})
        tagQuery = findWithProjectAndLimit(
            "tags", {"topic": {"$regex": "^"+query,"$options":"i"}}, {"topic": 1},4,"topic")
        userArr = []
        tagArr = []
        for x in usernameQuery:
            temObj = {
                "name": x["name"],
                "username": x["username"]
            }
            if (x["_id"] in myfollowing):
                temObj["isFollowing"] = True
            else:
                temObj["isFollowing"] = False
            userArr.append(temObj)
        userArr.sort(key=lambda x:x["isFollowing"],reverse=True)

        for x in tagQuery:
            temObj={
                "tag":x["topic"]
            }
            if(x["topic"] in myTags):
                temObj["isFollowing"]=True
            else:
                temObj["isFollowing"]=False
            tagArr.append(temObj)
        tagArr.sort(key=lambda x:x["isFollowing"],reverse=True)
        resObj={
            "users":userArr,
            "tags":tagArr
        }
        return resObj,200
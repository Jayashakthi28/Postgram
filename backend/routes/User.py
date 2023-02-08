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


class Follow(Resource):
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

class Followers(Resource):
    @is_registerd
    def get(email,self,username=None):
        myfollowing=findWithProject("user",{"email":email},{"following":1})
        followers=[]
        if(username!=None):
            followers=findWithProject("user",{"username":username},{"followers":1})
        else:
            followers=findWithProject("user",{"email":email},{"followers":1})
        retArr=[]
        for x in followers[0]["followers"]:
            userData=findWithProject("user",{"username":x},{"name":1})
            temObj={
                    "username":x,
                    "name":userData[0]["name"]
                }
            if(x in myfollowing[0]["following"]):
                temObj["isFollowing"]=True
            else:
                temObj["isFollowing"]=False
            retArr.append(temObj)
        return {"followers":retArr},200

class Following(Resource):
    @is_registerd
    def get(email,self,username=None):
        myfollowing=findWithProject("user",{"email":email},{"following":1})[0]["following"]
        retArr=[]
        if(username!=None):
            following=findWithProject("user",{"username":username},{"following":1})
            for x in following[0]["following"]:
                name=findWithProject("user",{"username":x},{"name":1})[0]["name"]
                temObj={
                    "username":x,
                    "name":name
                }
                if(x in myfollowing):
                    temObj["isFollowing"]=True
                else:
                    temObj["isFollowing"]=False
                retArr.append(temObj)
        else:
            for x in myfollowing:
                name=findWithProject("user",{"username":x},{"name":1})[0]["name"]
                temObj={
                    "username":x,
                    "name":name,
                    "isFollowing":True
                }
                retArr.append(temObj)
        return {"following":retArr},200

class Tag(Resource):
    @is_registerd
    def get(email,self,username=None):
        myTags=findWithProject("user",{"email":email},{"tags":1})[0]["tags"]
        retArr=[]
        if(username!=None):
            tags=findWithProject("user",{"username":username},{"tags":1})[0]["tags"]
            for x in tags:
                temObj={
                    "tag":x
                }
                if x in myTags:
                    temObj["isFollowing"]=True
                else:
                    temObj["isFollowing"]=False
                retArr.append(temObj)
        else:
            for x in myTags:
                temObj={
                    "tag":x,
                    "isFollowing":True
                }
                retArr.append(temObj)
        return {"tags":retArr},200

class TagFollow(Resource):
    @is_registerd
    def post(email,self):
        data=request.json
        tag=data["tag"]
        requestUserName=request.headers.get("username");
        updateOne("user",{"$push":{"tags":tag}},{"username":requestUserName})
        return {"status":"success"},200


class TagUnFollow(Resource):
    @is_registerd
    def post(email,self):
        data=request.json
        tag=data["tag"]
        requestUserName=request.headers.get("username");
        updateOne("user",{"$pullAll":{"tags":[tag]}},{"username":requestUserName})
        return {"status":"success"},200
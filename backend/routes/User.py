from flask_restful import Resource
from utils.isRegistered import is_registerd
from utils.db import findOne, findWithProject, updateOne, find, aggregationQuery,findWithSort
from flask import request
from utils.notificationPutter import notificationPutter
from datetime import datetime,timezone
from bson import ObjectId

class User(Resource):
    @is_registerd
    def get(email, self, username=None):
        userData = {}
        followingFlag = None
        followers = []
        myUserFollwing = findWithProject("user", {"email": email}, {
                                         "following": 1})[0]["following"]
        if (username == None):
            userData = findOne("user", {"email": email})
            followersCursor = find("user", {"following": userData["_id"]})
            for x in followersCursor:
                followers.append(x)
        else:
            userData = findOne("user", {"username": username})
            if (not userData):
                return {"status": "not found"}, 200
            userID = findWithProject(
                "user", {"username": username}, {"_id": 1})[0]["_id"]
            followersCursor = find("user", {"following": userID})
            for x in followersCursor:
                followers.append(x)
            if userID in myUserFollwing:
                followingFlag = True
            else:
                followingFlag = False
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
            len(followers),
            "isFollowing": followingFlag
        }
        return mainData, 200


class Follow(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        myUserId=findWithProject("user",{"email":email},{"_id":1})[0]["_id"]
        username = data["username"]
        userID = findWithProject(
            "user", {"username": username}, {"_id": 1})[0]["_id"]
        updateOne("user", {"$push": {"following": userID}}, {"email": email})
        notificationPutter(userID,myUserId,[userID],"follow")
        return {"status": "success"}, 200


class UnFollow(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        username = data["username"]
        userID = findWithProject(
            "user", {"username": username}, {"_id": 1})[0]["_id"]
        updateOne("user", {"$pullAll": {"following": [userID]}}, {
                  "email": email})
        return {"status": "success"}, 200


class Followers(Resource):
    @is_registerd
    def get(email, self, username=None):
        myFollowing = findWithProject("user", {"email": email}, {
                                      "following": 1})[0]["following"]
        retArr = []
        myFollowers = []
        if username == None:
            myFollowers = list(aggregationQuery(collection="user", match={"email": email}, lookup={"from": "user", "localField": "_id", "foreignField": "following", "as": "followersData", "pipeline": [
                               {"$project": {"username": 1, "name": 1, "_id": 1}}]}, projection={"followersData": 1}))[0]["followersData"]
        else:
            myFollowers = list(aggregationQuery(collection="user", match={"username": username}, lookup={"from": "user", "localField": "_id", "foreignField": "following", "as": "followersData", "pipeline": [
                               {"$project": {"username": 1, "name": 1, "_id": 1}}]}, projection={"followersData": 1}))[0]["followersData"]
        for x in myFollowers:
            temObj = {
                "name": x["name"],
                "username": x["username"]
            }
            if x["_id"] in myFollowing:
                temObj["isFollowing"] = True
            else:
                temObj["isFollowing"] = False
            retArr.append(temObj)
        return {"followers": retArr}, 200


class Following(Resource):
    @is_registerd
    def get(email, self, username=None):
        myFollowing = findWithProject("user", {"email": email}, {
                                      "following": 1})[0]["following"]
        retArr = []
        myFollowers = []
        if username == None:
            myFollowers = list(aggregationQuery(collection="user", match={"email": email}, lookup={"from": "user", "localField": "following", "foreignField": "_id", "as": "followingData", "pipeline": [
                               {"$project": {"username": 1, "name": 1, "_id": 1}}]}, projection={"followingData": 1}))[0]["followingData"]
        else:
            myFollowers = list(aggregationQuery(collection="user", match={"username": username}, lookup={"from": "user", "localField": "following", "foreignField": "_id", "as": "followingData", "pipeline": [
                               {"$project": {"username": 1, "name": 1, "_id": 1}}]}, projection={"followingData": 1}))[0]["followingData"]
        for x in myFollowers:
            temObj = {
                "name": x["name"],
                "username": x["username"]
            }
            if x["_id"] in myFollowing:
                temObj["isFollowing"] = True
            else:
                temObj["isFollowing"] = False
            retArr.append(temObj)

        return {"following": retArr}, 200


class Tag(Resource):
    @is_registerd
    def get(email, self, username=None):
        myTags = findWithProject("user", {"email": email}, {
                                 "tags": 1})[0]["tags"]
        retArr = []
        if (username != None):
            tags = findWithProject("user", {"username": username}, {
                                   "tags": 1})[0]["tags"]
            for x in tags:
                temObj = {
                    "tag": x
                }
                if x in myTags:
                    temObj["isFollowing"] = True
                else:
                    temObj["isFollowing"] = False
                retArr.append(temObj)
        else:
            for x in myTags:
                temObj = {
                    "tag": x,
                    "isFollowing": True
                }
                retArr.append(temObj)
        return {"tags": retArr}, 200


class TagFollow(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        tag = data["tag"]
        updateOne("user", {"$push": {"tags": tag}}, {"email": email})
        return {"status": "success"}, 200


class TagUnFollow(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        tag = data["tag"]
        updateOne("user", {"$pullAll": {"tags": [tag]}}, {"email": email})
        return {"status": "success"}, 200


class Notification(Resource):
    @is_registerd
    def get(email,self,page):
        userId=findWithProject("user",{"email":email},{"_id":1})[0]["_id"]
        print(userId)
        data=findWithSort("notifications",{"users":userId},"time",-1,int(page))
        retArr=[]
        for x in data:
            temObj={}
            temObj["type"]=x["type"]
            username=""
            temObj["isMe"]=None
            temObj["id"]=str(x["_id"])
            temObj["postId"]=x["postId"]
            if(x["type"]=="follow" or x["type"]=="like"):
                username=findWithProject("user",{"_id":x["by"]},{"username":1})[0]["username"]
            else:
                if(x["by"]==userId):
                    temObj["isMe"]=True
                    username=findWithProject("user",{"_id":x["for"]},{"username":1})[0]["username"]
                else:
                    temObj["isMe"]=False
                    username=findWithProject("user",{"_id":x["by"]},{"username":1})[0]["username"]
            temObj["username"]=username
            temObj["time"]=x["time"].isoformat()+"Z"
            retArr.append(temObj)
        return {"data":retArr,"hasNext":(len(retArr)==10),"page":page}
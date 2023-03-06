from flask_restful import Resource
from utils.isRegistered import is_registerd
from flask import request
from utils.db import findWithProject, findOne, insertOne, find, updateOne, aggregationQuery, aggregationQueryWithLimit, aggregationQueryWithLimitAndSkip,findWithSortAndNoSkip
from datetime import datetime,timezone
from bson import ObjectId
from utils.notificationPutter import notificationPutter
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import os
import pickle

loaded_model = joblib.load(os.getcwd()+'/utils/logistic_regression_model.pkl')
vectorizer = pickle.load(open(os.getcwd()+"/utils/vector.pickel", "rb"))

def vectorizingFunc(comment):
    arr=[comment]
    vectorizedComment=vectorizer.transform(arr)
    return vectorizedComment


class Post(Resource):
    @is_registerd
    def get(email, self):
        myUserData = findWithProject("user", {"email": email}, {
                                     "_id": 1, "following": 1, "tags": 1})[0]
        data = list(aggregationQueryWithLimit("post", {"visited": {"$nin": [myUserData["_id"]]}, "$or": [{"tag": {"$in": myUserData["tags"]}}, {"user": {"$in": myUserData["following"]}}]}, {
                    "from": "user", "localField": "user", "foreignField": "_id", "as": "userData", "pipeline": [{"$project": {"username": 1, "name": 1, "_id": 1}}]}))
        retArr = []
        for x in data:
            temObj = {}
            temObj["text"] = x["text"]
            temObj["font"] = x["font"]
            temObj["background"] = x["background"]
            temObj["tag"] = x["tag"]
            temObj["fontColor"] = x["fontColor"]
            temObj["time"]=x["time"]
            temObj["username"] = x["userData"][0]["username"]
            temObj["name"]=x["userData"][0]["name"]
            temObj["comments"] = len(x["comments"])
            temObj["likes"] = len(x["likes"])
            temObj["id"] = str(x["_id"])
            if x["userData"][0]["_id"] in myUserData["following"]:
                temObj["isFollowing"] = True
            else:
                temObj["isFollowing"] = False
            if myUserData["_id"] in x["likes"]:
                temObj["isLiked"] = True
            else:
                temObj["isLiked"] = False
            retArr.append(temObj)
        return {"data": retArr, "type": "recommended", "page": None, "hasNext":(len(data)==10)}, 200

    @is_registerd
    def post(email, self):
        data = request.json
        text = data['text']
        background = data['background']
        font = data['font']
        tag = data['tag']
        fontColor = data['fontColor']
        time = datetime.now(timezone.utc).isoformat()
        userId = findWithProject("user", {"email": email}, {"_id": 1})
        userId = userId[0]["_id"]
        post_data = {
            "text": text,
            "background": background,
            "font": font,
            "tag": tag,
            "fontColor": fontColor,
            "user": userId,
            "time": time,
            "visited": [],
            "comments": [],
            "likes": []
        }
        res = insertOne("post", post_data)
        for x in tag:
            ack = list(find("tags", {"topic": x}))
            if (not ack):
                insertOne("tags", {"topic": x})
        return {"status": "Successfully inserted"}, 200


class FollowingVisited(Resource):
    @is_registerd
    def get(email, self, page=0):
        myUserData = findWithProject("user", {"email": email}, {
                                     "_id": 1, "following": 1, "tags": 1})[0]
        data = list(aggregationQueryWithLimitAndSkip("post", {"$and":[ {"likes":{"$nin": [myUserData["_id"]]}},{"visited":{"$in":[myUserData["_id"]]}}], "$or": [{"tag": {"$in": myUserData["tags"]}}, {"user": {"$in": myUserData["following"]}}]}, {
                    "from": "user", "localField": "user", "foreignField": "_id", "as": "userData", "pipeline": [{"$project": {"username": 1, "name": 1, "_id": 1}}]}, 10, int(page)*10,True))
        retArr = []
        hasNext = len(data) == 10
        for x in data:
            temObj = {}
            temObj["text"] = x["text"]
            temObj["font"] = x["font"]
            temObj["background"] = x["background"]
            temObj["tag"] = x["tag"]
            temObj["fontColor"] = x["fontColor"]
            temObj["time"]=x["time"]
            temObj["name"]=x["userData"][0]["name"]
            temObj["username"] = x["userData"][0]["username"]
            temObj["comments"] = len(x["comments"])
            temObj["likes"] = len(x["likes"])
            temObj["id"] = str(x["_id"])
            if x["userData"][0]["_id"] in myUserData["following"]:
                temObj["isFollowing"] = True
            else:
                temObj["isFollowing"] = False
            temObj["isLiked"] = False
            retArr.append(temObj)
        return {"data": retArr, "type": "visited", "page": page, "hasNext": hasNext}


class Random(Resource):
    @is_registerd
    def get(email, self, page=0):
        myUserData = findWithProject("user", {"email": email}, {
                                     "_id": 1, "following": 1, "tags": 1})[0]
        data = list(aggregationQueryWithLimitAndSkip("post", {"likes": {"$nin": [myUserData["_id"]]}, "$and": [{"tag": {"$nin": myUserData["tags"]}}, {"user": {"$nin": myUserData["following"]}}]}, {
                    "from": "user", "localField": "user", "foreignField": "_id", "as": "userData", "pipeline": [{"$project": {"username": 1, "name": 1, "_id": 1}}]},10,int(page)*10))
        retArr = []
        hasNext = len(data) == 10
        for x in data:
            temObj = {}
            temObj["text"] = x["text"]
            temObj["font"] = x["font"]
            temObj["background"] = x["background"]
            temObj["tag"] = x["tag"]
            temObj["fontColor"] = x["fontColor"]
            temObj["time"]=x["time"]
            temObj["username"] = x["userData"][0]["username"]
            temObj["name"]=x["userData"][0]["name"]
            temObj["comments"] = len(x["comments"])
            temObj["likes"] = len(x["likes"])
            temObj["id"] = str(x["_id"])
            if x["userData"][0]["_id"] in myUserData["following"]:
                temObj["isFollowing"] = True
            else:
                temObj["isFollowing"] = False
            temObj["isLiked"] = False
            retArr.append(temObj)
        return {"data": retArr, "type": "random", "page": page, "hasNext": hasNext}


class Visited(Resource):
    @is_registerd
    def get(email, self, postId=None):
        postId = ObjectId(postId)
        userId = findWithProject("user", {"email": email}, {"_id:1"})[0]["_id"]
        data=updateOne("post",{"$pullAll":{"visited":[userId]}},{"_id":postId})
        data = updateOne(
            "post", {"$push": {"visited": userId}}, {"_id": postId})
        return {"status": "success"}, 200


class Likes(Resource):
    @is_registerd
    def get(email,self,postId=None):
        myUserData = findWithProject("user", {"email": email}, {
                                     "_id": 1, "following": 1})[0]
        likes=findWithProject("post",{"_id":ObjectId(postId)},{"likes":1})[0]["likes"];
        retArr=[]
        for x in likes:
            userData=findWithProject("user",{"_id":x},{"username":1,"name":1,"_id":0})[0];
            userData["isFollowing"]=x in myUserData["following"];
            retArr.append(userData)
        print(retArr)
        return {"data":retArr}


class AllPosts(Resource):
    @is_registerd
    def get(email, self, username=None):
        myUserData = findWithProject("user", {"email": email}, {
                                     "_id": 1, "following": 1, "username": 1,"name":1})[0]
        retArr = []
        if username != None:
            userData = findWithProject(
                "user", {"username": username}, {"_id": 1,"name":1})[0]
            userPosts = findWithSortAndNoSkip("post", {"user": userData["_id"]},"time",-1)
            if userData["_id"] in myUserData["following"]:
                isFollowing = True
            else:
                isFollowing = False
            for x in userPosts:
                temObj = {}
                temObj["text"] = x["text"]
                temObj["font"] = x["font"]
                temObj["background"] = x["background"]
                temObj["tag"] = x["tag"]
                temObj["fontColor"] = x["fontColor"]
                temObj["time"]=x["time"]
                temObj["username"] = username
                temObj["name"]=userData["name"]
                temObj["comments"] = len(x["comments"])
                temObj["likes"] = len(x["likes"])
                temObj["id"] = str(x["_id"])
                temObj["isFollowing"] = isFollowing
                if myUserData["_id"] in x["likes"]:
                    temObj["isLiked"] = True
                else:
                    temObj["isLiked"] = False
                retArr.append(temObj)
        else:
            posts = findWithSortAndNoSkip("post", {"user": myUserData["_id"]},"time",-1)
            for x in posts:
                temObj = {}
                temObj["text"] = x["text"]
                temObj["font"] = x["font"]
                temObj["background"] = x["background"]
                temObj["tag"] = x["tag"]
                temObj["fontColor"] = x["fontColor"]
                temObj["time"]=x["time"]
                temObj["name"]=myUserData["name"]
                temObj["username"] = myUserData["username"]
                temObj["comments"] = len(x["comments"])
                temObj["likes"] = len(x["likes"])
                temObj["id"] = str(x["_id"])
                temObj["isFollowing"] = None
                if myUserData["_id"] in x["likes"]:
                    temObj["isLiked"] = True
                else:
                    temObj["isLiked"] = False
                retArr.append(temObj)
        return {"data": retArr}, 200


class Comments(Resource):
    @is_registerd
    def post(email, self, postId):
        userId = findWithProject("user", {"email": email}, {"_id:1"})[0]["_id"]
        data = request.json
        comment = data["comment"]
        vectorizedComment=vectorizingFunc(comment)
        postId=ObjectId(postId)
        prediction=loaded_model.predict(vectorizedComment)[0]
        if(prediction==0):
            obj = {
                "comment": comment,
                "user": userId
            }
            res = insertOne("comments", obj)
            commentId = res.inserted_id
            updateOne("post", {"$push": {"comments": commentId}}, {"_id": postId})
        postData=findWithProject("post",{"_id":postId},{"likes":1,"comments":1,"_id":1,"user":1})[0]
        if(prediction==1):
            notificationPutter(postData["user"],userId,[postData["user"],userId],"harassment",str(postId))
        else:
            notificationPutter(postData["user"],userId,[postData["user"]],"comment",str(postId))
        returnObj={}
        returnObj["comments"] = len(postData["comments"])
        returnObj["likes"] = len(postData["likes"])
        returnObj["id"] = str(postData["_id"])
        return {"status": "success","data":returnObj}, 200

    @is_registerd
    def get(email, self, postId):
        postId = ObjectId(postId)
        commentsId = findWithProject("post", {"_id": postId}, {
                                     "comments": 1})[0]["comments"]
        retArr = []
        for x in commentsId:
            comment = findWithProject("comments", {"_id": x}, {
                                      "comment": 1, "user": 1})[0]
            commentedUserName = findWithProject("user", {"_id": comment["user"]}, {
                                                "username": 1})[0]["username"]
            temObj = {
                "comment": comment["comment"],
                "username": commentedUserName
            }
            retArr.append(temObj)
        return {"data": retArr}, 200

class Like(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        postId = ObjectId(data["postId"])
        userID = findWithProject(
            "user", {"email": email}, {"_id": 1})[0]["_id"]
        updateOne("post", {"$pullAll": {"likes": [userID]}}, {"_id": postId})
        updateOne("post", {"$push": {"likes": userID}}, {"_id": postId})
        postData=findWithProject("post",{"_id":postId},{"likes":1,"comments":1,"_id":1,"user":1})[0]
        notificationPutter(postData["user"],userID,[postData["user"]],"like",str(postId))
        returnObj={}
        returnObj["comments"] = len(postData["comments"])
        returnObj["likes"] = len(postData["likes"])
        returnObj["id"] = str(postData["_id"])
        return {"status": "success","data":returnObj}, 200

class UnLike(Resource):
    @is_registerd
    def post(email, self):
        data = request.json
        postId = ObjectId(data["postId"])
        userID = findWithProject(
            "user", {"email": email}, {"_id": 1})[0]["_id"]
        updateOne("post", {"$pullAll": {"likes": [userID]}}, {"_id": postId})
        postData=findWithProject("post",{"_id":postId},{"likes":1,"comments":1,"_id":1})[0]
        returnObj={}
        returnObj["comments"] = len(postData["comments"])
        returnObj["likes"] = len(postData["likes"])
        returnObj["id"] = str(postData["_id"])
        return {"status": "success","data":returnObj}, 200
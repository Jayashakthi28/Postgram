from flask_restful import Resource
from utils.isRegistered import is_registerd
from flask import request
from utils.db import findWithProject, findOne,insertOne,find,updateOne,aggregationQuery,aggregationQueryWithLimit
from datetime import datetime
from bson import ObjectId

class Post(Resource):
    @is_registerd
    def get(email, self):
        myUserData=findWithProject("user",{"email":email},{"_id":1,"following":1,"tags":1})[0]
        data=list(aggregationQueryWithLimit("post",{"visited":{"$nin":[myUserData["_id"]]},"$or":[{"tag":{"$in":myUserData["tags"]}},{"user":{"$in":myUserData["following"]}}]},{"from":"user","localField":"user","foreignField":"_id","as":"userData","pipeline":[{"$project": {"username": 1, "name": 1, "_id": 1}}]}))
        retArr=[]
        for x in data:
            temObj={}
            temObj["text"]=x["text"]
            temObj["font"]=x["font"]
            temObj["background"]=x["background"]
            temObj["tag"]=x["tag"]
            temObj["fontColor"]=x["fontColor"]
            temObj["username"]=x["userData"][0]["username"]
            temObj["comments"]=len(x["comments"])
            temObj["likes"]=len(x["likes"])
            temObj["id"]=str(x["_id"])
            if x["userData"][0]["_id"] in myUserData["following"]:
                temObj["isFollowing"]=True
            else:
                temObj["isFollowing"]=False
            if myUserData["_id"] in x["likes"]:
                temObj["isLiked"]=True
            else:
                temObj["isLiked"]=False
            retArr.append(temObj)
        return {"data": retArr}, 200

    @is_registerd
    def post(email, self):
        data = request.json
        text = data['text']
        background = data['background']
        font = data['font']
        tag = data['tag']
        fontColor = data['fontColor']
        time=str(datetime.utcnow())
        userId = findWithProject("user", {"email": email}, {"_id": 1})
        userId=userId[0]["_id"]
        post_data = {
            "text": text,
            "background": background,
            "font": font,
            "tag": tag,
            "fontColor": fontColor,
            "user": userId,
            "time":time
        }
        res=insertOne("post",post_data);
        postId=res.inserted_id
        for x in tag:
            ack=list(find("tags",{"topic":x}))
            if(not ack):
                insertOne("tags",{"topic":x,"posts":[]})
            updateOne("tags",{"$push":{"posts":postId}},{"topic":x})
        return {"status":"Successfully inserted"},200;

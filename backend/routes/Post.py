from flask_restful import Resource
from utils.isRegistered import is_registerd
from flask import request
from utils.db import findWithProject, findOne,insertOne,find,updateOne
from datetime import datetime

class Post(Resource):

    @is_registerd
    def get(email, self):
        return {"status": "Hi"}, 200

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

from flask import request
from dotenv import load_dotenv
from flask_restful import Resource
from utils.db import insertOne,findOne
from datetime import datetime
from random import randint


load_dotenv()


def signupUtil(data):
        email=data["email"]
        username=data["username"]
        name=data["name"]
        tags=data["tags"]
        json_data={
            "name":name,
            "email":email,
            "username":username,
            "tags":tags,
            "date_created":str(datetime.utcnow()),
            "following":[]
            }
        insertOne("user",json_data)
        

def usernameGenerator(name):
    new_name=str(name).lower()
    print(new_name)
    user_name="".join(ch for ch in new_name if ch.isalnum())
    user_name+=str(randint(1000,9999))
    res=findOne("user",{"username":user_name})
    if(not res):
        return user_name
    else:
        return usernameGenerator(name)

def userDataGenerator(data):
    mainData={}
    mainData["email"]=data["email"]
    mainData["name"]=data["name"]
    mainData["username"]=usernameGenerator(data["name"])
    mainData["tags"]=data["tags"]
    return mainData

def isRegistered(email):
    res=findOne("user",{"email":email})
    if not res:
        return False
    return True

class Register(Resource):
    def post(self):
        email=request.headers.get("email")
        if(isRegistered(email)==False):
            data=request.json
            mainData=userDataGenerator(data)
            signupUtil(mainData)
            return {"status":"success"},200
        return {"status":"Already registerd"},200


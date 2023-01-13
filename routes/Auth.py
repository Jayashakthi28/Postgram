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
        json_data={
            "name":name,
            "email":email,
            "username":username,
            "date_created":str(datetime.utcnow())
            }
        insertOne("user",json_data)
        

def usernameGenerator(name,type_of_inp):
    new_name=""
    if(type_of_inp!="email"):
        new_name=str(name).lower()
    else:
        local, at, domain = str(name).rpartition('@')
        new_name=str(local)
    user_name="".join(ch for ch in new_name if ch.isalnum())
    user_name+=str(randint(1000,9999))
    res=findOne("user",{"username":user_name})
    if(not res):
        return user_name
    else:
        return usernameGenerator(name,type_of_inp)

def userDataGenerator(data):
    mainData={}
    mainData["email"]=data["email"]
    mainData["name"]=data["name"]
    mainData["username"]=usernameGenerator(data["name"],"name")
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
            return {"status":"Registered Successfully"},200
        return {"status":"Already registerd"},200


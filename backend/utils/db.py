import pymongo
from dotenv import load_dotenv
import os

client = pymongo.MongoClient('localhost', 27017)
db = client['postgram']


def insertOne(collection, data):
    col = db[collection]
    res = col.insert_one(data)
    return res

def insertMany(collection, data):
    col = db[collection]
    res = col.insert_many(data)
    return res

def findOne(collection, data):
    col = db[collection]
    res = col.find_one(data)
    return res

def find(collection,data):
    col=db[collection]
    res=col.find(data)
    return res

def updateOne(collection,data,filter):
    col=db[collection]
    res=col.update_one(filter,data)
    return res

def findWithProject(collection, data, projection):
    col = db[collection]
    res = list(col.find(filter=data, projection=projection))
    return res
import pymongo
from dotenv import load_dotenv
import os

client = pymongo.MongoClient('localhost',27017)
db = client['postgram']

def insertOne(collection,data):
    col=db[collection]
    res=col.insert_one(data)

def insertMany(collection,data):
    col=db[collection]
    res=col.insert_many(data)

def findOne(collection,data):
    col=db[collection]
    res=col.find_one(data)
    return res

def findWithProject(collection,data,projection):
    col=db[collection]
    res=col.find(data,projection)
    return res
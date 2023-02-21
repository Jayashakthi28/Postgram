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

def findWithProjectAndLimit(collection, data, projection,limit,sorter):
    col = db[collection]
    res = list(col.find(filter=data, projection=projection).limit(limit).sort(sorter))
    return res

def aggregationQuery(collection,match,lookup,projection=None):
    col=db[collection]
    res={}
    if projection!=None:
        res=col.aggregate([{"$match":match},{"$lookup":lookup},{"$project":projection}])
    else:
        res=col.aggregate([{"$match":match},{"$lookup":lookup}])
    return res

def aggregationQueryWithLimit(collection,match,lookup,projection=None,limit=10):
    col=db[collection]
    res={}
    if projection!=None:
        res=col.aggregate([{"$match":match},{"$lookup":lookup},{"$project":projection},{"$limit":limit}])
    else:
        res=col.aggregate([{"$match":match},{"$lookup":lookup},{"$limit":limit}])
    return res

def aggregationQueryWithLimitAndSkip(collection,match,lookup,limit,skip,isTimeSort=False):
    col=db[collection]
    if(isTimeSort):
        res=col.aggregate([{"$match":match},{"$lookup":lookup},{"$skip":int(skip)},{"$limit":limit},{"$sort":{"time":-1}},{"$sort":{"visited":-1}},{"$sort":{"likes":-1}}])
    else:
        res=col.aggregate([{"$match":match},{"$lookup":lookup},{"$skip":int(skip)},{"$limit":limit},{"$sort":{"visited":-1}},{"$sort":{"likes":-1}}])
    return res
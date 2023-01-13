from flask_restful import Resource
from utils.db import findWithProject

class Topic(Resource):
    def get(self):
        res=findWithProject("tags",{},{"topic":1})
        topics=[]
        for x in res:
            print(x)
            topics.append(x["topic"])
        return {"data":topics},200
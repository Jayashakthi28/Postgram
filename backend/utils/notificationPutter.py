from utils.db import insertOne
from datetime import datetime,timezone
from bson import timestamp
def notificationPutter(forUser,byUser,users,type,postId=None):
    dateIsoFormat=datetime.now(timezone.utc).isoformat()
    currDate=datetime.fromisoformat(dateIsoFormat)
    insertOne("notifications",{
        "for":forUser,
        "by":byUser,
        "users":users,
        "type":type,
        "time":currDate,
        "isVisited":[],
        "postId":postId
    })
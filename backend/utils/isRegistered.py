from functools import wraps
from flask import request
from utils.db import findOne

def is_registerd(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        email=request.headers.get("email");
        res=findOne("user",{"email":email})
        if not res:
            resp={"status":"not registered"}
            return resp,200
        return f(email,*args, **kwargs)
    return decorated                                                                       

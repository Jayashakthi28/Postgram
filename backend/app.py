import json
import os
from flask import Flask
from flask_restful import Api
from routes.Auth import Register
from routes.Post import Post
from routes.Topic import Topic
from routes.IsRegistered import IsRegistered
from routes.ResendVerifyEmail import Resend,Status
from routes.User import User
from routes.User import Follow
from routes.User import UnFollow
from routes.UserName import UserName
from flask_cors import CORS

app=Flask(__name__)
CORS(app=app,supports_credentials=True,origins=["http://localhost:*","https://dev-postgram.netlify.app"])
api=Api(app)


app.secret_key = 'the random string'


api.add_resource(Register,"/register")
api.add_resource(Post,"/post")
api.add_resource(Topic,"/tags")
api.add_resource(IsRegistered,"/isregister")
api.add_resource(Resend,"/email/verify")
api.add_resource(Status,"/email/check")
api.add_resource(UserName,"/username");
api.add_resource(User,"/user/<username>","/user")
api.add_resource(Following,"/follow")
api.add_resource(UnFollow,"/unfollow")

if __name__=="__main__":
    app.run(debug=True)

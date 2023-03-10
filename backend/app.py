import json
import os
from flask import Flask
from flask_restful import Api
from routes.Auth import Register
from routes.Post import Post
from routes.Post import FollowingVisited
from routes.Post import Like
from routes.Post import Likes
from routes.Post import UnLike
from routes.Post import Random
from routes.Post import Visited
from routes.Post import AllPosts
from routes.Post import Comments
from routes.Topic import Topic
from routes.IsRegistered import IsRegistered
from routes.ResendVerifyEmail import Resend,Status
from routes.User import User
from routes.User import Follow
from routes.User import UnFollow
from routes.User import TagFollow
from routes.User import TagUnFollow
from routes.User import Notification
from routes.User import NotificationUpdate
from routes.User import Edit
from routes.UserName import UserName
from routes.User import Followers
from routes.User import Following
from routes.User import Tag
from routes.Search import Search
from flask_cors import CORS

app=Flask(__name__)
CORS(app=app,supports_credentials=True,origins=["http://localhost:*","https://dev-postgram.netlify.app"])
api=Api(app)


app.secret_key = 'the random string'


api.add_resource(Register,"/register")
api.add_resource(AllPosts,"/allpost","/allpost/<username>")
api.add_resource(Edit,"/profile/edit")
api.add_resource(Likes,"/likes/<postId>")
api.add_resource(Like,"/like")
api.add_resource(UnLike,"/unlike")
api.add_resource(Visited,"/visited/<postId>")
api.add_resource(Comments,"/comments/<postId>")
api.add_resource(NotificationUpdate,"/notification/update")
api.add_resource(Notification,"/notification/<page>")
api.add_resource(FollowingVisited,"/post/visited/<page>")
api.add_resource(Random,"/post/random/<page>")
api.add_resource(Post,"/post")
api.add_resource(Topic,"/tags")
api.add_resource(IsRegistered,"/isregister")
api.add_resource(Resend,"/email/verify")
api.add_resource(Status,"/email/check")
api.add_resource(UserName,"/username");
api.add_resource(User,"/user/<username>","/user")
api.add_resource(Followers,"/followers","/followers/<username>");
api.add_resource(Following,"/following","/following/<username>");
api.add_resource(TagFollow,"/tag/follow");
api.add_resource(TagUnFollow,"/tag/unfollow");
api.add_resource(Tag,"/tag","/tag/<username>");
api.add_resource(Follow,"/follow")
api.add_resource(UnFollow,"/unfollow")
api.add_resource(Search,"/search")

if __name__=="__main__":
    app.run(debug=True)

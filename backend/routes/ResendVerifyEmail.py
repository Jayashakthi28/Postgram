from flask_restful import Resource
from flask import request
import json
import requests
from utils.auth0Tokener import authHeader
from dotenv import load_dotenv
import os
load_dotenv()

class Resend(Resource):

    def post(self):
        data = request.json
        body = {"user_id": data["user_id"]}
        headers = authHeader()
        url=f'{os.environ.get("AUTH0_DOMAIN")}/api/v2/jobs/verification-email'
        emailStatus = requests.post(
            url,
            json=body,
            headers=headers)
        emailStatus = emailStatus.json()
        return emailStatus, 200


class Status(Resource):

    def post(self):
        data = request.json
        id = data["id"]
        headers = authHeader()
        status = requests.get(
            f"https://dev-wi88816px38jci0q.us.auth0.com/api/v2/jobs/{id}",
            headers=headers)
        status = status.json()["status"]
        return {"status": status}, 200

import requests
import os
from dotenv import load_dotenv

load_dotenv()


def authHeader():
    token = requests.post(
        f'{os.environ["AUTH0_DOMAIN"]}/oauth/token', {
            "client_id": os.environ["AUTH0_CLIENT_ID"],
            "client_secret": os.environ["AUTH0_CLIENT_SECRET"],
            "audience": f'{os.environ["AUTH0_DOMAIN"]}/api/v2/',
            "grant_type": "client_credentials"
        })
    token = token.json()["access_token"]
    headers = {
        "content-type": "application/json",
        "authorization": "Bearer " + token
    }
    return headers
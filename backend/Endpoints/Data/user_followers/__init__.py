from flask import Blueprint
from flask_restful import Api

from .follow import Follow
from .unfollow import Unfollow
from .user_followed import UserFollowed
from .statistics import Statistics

user_followers_blueprint = Blueprint('user_followers_api', __name__)

user_followers_api = Api(user_followers_blueprint)

user_followers_api.add_resource(Follow,'/follow/user-<uid>')
user_followers_api.add_resource(Unfollow, '/user-<fid>/unfollow/user-<uid>')
user_followers_api.add_resource(UserFollowed, '/user-<fid>/following/user-<uid>')
user_followers_api.add_resource(Statistics, '/user-<fid>/following-statistics')
from flask import Blueprint
from flask_restful import Api

from .by_username import ByUsername
from .update_photo import UpdatePhoto
from .update_password import UpdatePassword
from .all import All
from .login import Login

users_blueprint = Blueprint('users_api', __name__)

users_api = Api(users_blueprint)

users_api.add_resource(ByUsername,'/users/<username>')
users_api.add_resource(UpdatePhoto, '/users/<username>/photo')
users_api.add_resource(UpdatePassword, '/users/update/<username>/password')
users_api.add_resource(All, '/users')
users_api.add_resource(Login, '/login')
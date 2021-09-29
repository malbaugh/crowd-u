from flask import Blueprint
from flask_restful import Api

from .update import Update
from .all import All
from .search import Search
from .register import Register

challenge_users_blueprint = Blueprint('challenge_users_api', __name__)

challenge_users_api = Api(challenge_users_blueprint)

challenge_users_api.add_resource(Search,'/challenge-users/search')
challenge_users_api.add_resource(Register, '/challenge-users/register')
challenge_users_api.add_resource(All,'/challenge-users')
challenge_users_api.add_resource(Update, '/challenge-users/update/<username>')
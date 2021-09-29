from flask import Blueprint
from flask_restful import Api

from .update import Update
from .all import All
from .search import Search
from .register import Register

participant_users_blueprint = Blueprint('participant_users_api', __name__)

participant_users_api = Api(participant_users_blueprint)

participant_users_api.add_resource(Search,'/participant-users/search')
participant_users_api.add_resource(Register, '/participant-users/register')
participant_users_api.add_resource(All,'/participant-users')
participant_users_api.add_resource(Update, '/participant-users/update/<username>')
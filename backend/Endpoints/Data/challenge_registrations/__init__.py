from flask import Blueprint
from flask_restful import Api

from .register import RegisterForChallenge
from .unregister import UnregisterForChallenge
from .is_registered import IsUserRegisteredForChallenge
from .challenges_registered import ChallengesUserIsRegisteredFor
from .statistics import Statistics

challenge_registration_blueprint = Blueprint('challenge_registration_api', __name__)

challenge_registration_api = Api(challenge_registration_blueprint)

challenge_registration_api.add_resource(RegisterForChallenge,'/register/challenge-<cid>')
challenge_registration_api.add_resource(UnregisterForChallenge, '/user-<uid>/unregister/challenge-<cid>')
challenge_registration_api.add_resource(IsUserRegisteredForChallenge, '/user-<uid>/registered/challenge-<cid>')
challenge_registration_api.add_resource(ChallengesUserIsRegisteredFor, '/challenges-registered/user-<uid>')
challenge_registration_api.add_resource(Statistics, '/challenge-<cid>/registration-statistics')
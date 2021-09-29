from flask import Blueprint
from flask_restful import Api

from .by_id import ChallengesById
from .by_owner import ChallengesByOwner
from .photo_by_id import ChallengePhotoById
from .close import CloseChallenge

challenge_blueprint = Blueprint('challenge_api', __name__)

challenge_api = Api(challenge_blueprint)

challenge_api.add_resource(ChallengesById, '/challenges/<challenge_id>')
challenge_api.add_resource(ChallengesByOwner, '/challenges/owner-<username>')
challenge_api.add_resource(ChallengePhotoById, '/challenges/<challenge_id>/photo')
challenge_api.add_resource(CloseChallenge, '/challenge/close/<cid>')
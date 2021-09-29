from flask import Blueprint
from flask_restful import Api

from .follow import FollowChallenge
from .unfollow import UnfollowChallenge
from .is_following import IsUserFollowingChallenge
from .challenges_completed import ChallengesCompletedByUser
from .challenges_following import ChallengesUserIsFollowing
from .statistics import Statistics

challenge_followers_blueprint = Blueprint('challenge_followers_api', __name__)

challenge_followers_api = Api(challenge_followers_blueprint)

challenge_followers_api.add_resource(FollowChallenge,'/follow/challenge-<cid>')
challenge_followers_api.add_resource(UnfollowChallenge, '/user-<uid>/unfollow/challenge-<cid>')
challenge_followers_api.add_resource(IsUserFollowingChallenge, '/user-<uid>/following/challenge-<cid>')
challenge_followers_api.add_resource(ChallengesCompletedByUser, '/challenges/follower-<uid>/completed')
challenge_followers_api.add_resource(ChallengesUserIsFollowing, '/challenges/follower-<uid>')
challenge_followers_api.add_resource(Statistics, '/challenge-<cid>/follower-statistics')
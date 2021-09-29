from flask import Blueprint
from flask_restful import Api

from .favorite import Favorite
from .unfavorite import Unfavorite
from .submission_favorited import SubmissionFavorited
from .statistics import Statistics

submission_favorites_blueprint = Blueprint('submission_favorites_api', __name__)

submission_favorites_api = Api(submission_favorites_blueprint)

submission_favorites_api.add_resource(Favorite,'/favorite/submission-<sid>')
submission_favorites_api.add_resource(Unfavorite, '/user-<fid>/unfavorite/submission-<sid>')
submission_favorites_api.add_resource(SubmissionFavorited, '/user-<fid>/favoriting/submission-<sid>')
submission_favorites_api.add_resource(Statistics, '/submission-<sid>/favorite-statistics')
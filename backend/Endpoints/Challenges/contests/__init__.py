from flask import Blueprint
from flask_restful import Api

from .by_owner import ContestsByOwner
from .closed_by_owner import ClosedContestsByOwner
from .register import RegisterContest
from .update import UpdateContest
from .all import AllContests
from .search import SearchContests
from .close import CloseContest

contest_blueprint = Blueprint('contest_api', __name__)

contest_api = Api(contest_blueprint)

contest_api.add_resource(ClosedContestsByOwner,'/contests/owner-<username>/closed')
contest_api.add_resource(ContestsByOwner, '/contests/owner-<username>')
contest_api.add_resource(RegisterContest, '/contest/register')
contest_api.add_resource(UpdateContest, '/contest/update/<challenge_id>')
contest_api.add_resource(AllContests, '/contests')
contest_api.add_resource(SearchContests, '/contests/search')
contest_api.add_resource(CloseContest, '/contest/close/<cid>')
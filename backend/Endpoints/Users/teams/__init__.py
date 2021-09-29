from flask import Blueprint
from flask_restful import Api

from .by_username import ByUsername
from .register import Register
from .delete import Delete
from .leave import Leave

teams_blueprint = Blueprint('teams_api', __name__)

teams_api = Api(teams_blueprint)

teams_api.add_resource(ByUsername,'/teams/<username>')
teams_api.add_resource(Register, '/team/register')
teams_api.add_resource(Delete, '/team-<name>/delete')
teams_api.add_resource(Leave, '/leave/team-<tid>')
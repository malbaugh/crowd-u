from flask import Blueprint
from flask_restful import Api

from .update import Update
from .update_password import UpdatePassword
from .by_lead import ByLeader
from .register import Register
from .delete import Delete

departments_blueprint = Blueprint('departments_api', __name__)

departments_api = Api(departments_blueprint)

departments_api.add_resource(ByLeader,'/departments/lead-<lead_id>')
departments_api.add_resource(Register, '/department/register')
departments_api.add_resource(Delete, '/departments/<username>/delete')
departments_api.add_resource(Update, '/departments/update/<username>')
departments_api.add_resource(UpdatePassword, '/departments/update/<username>/password')
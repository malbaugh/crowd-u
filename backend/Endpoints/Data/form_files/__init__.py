from flask import Blueprint
from flask_restful import Api

from .data import Data
from .industry import Industry
from .concentration import Concentration
from .university import University
from .major import Major

form_files_blueprint = Blueprint('form_files_api', __name__)

form_files_api = Api(form_files_blueprint)

form_files_api.add_resource(Data,'/data')
form_files_api.add_resource(Industry, '/data/industry')
form_files_api.add_resource(Concentration, '/data/concentration')
form_files_api.add_resource(University, '/data/university')
form_files_api.add_resource(Major, '/data/major')
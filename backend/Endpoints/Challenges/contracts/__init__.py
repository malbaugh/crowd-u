from flask import Blueprint
from flask_restful import Api

from .by_owner import ContractsByOwner
from .closed_by_owner import ClosedContractsByOwner
from .register import RegisterContract
from .update import UpdateContract
from .all import AllContracts
from .search import SearchContracts
from .close import CloseContract

contract_blueprint = Blueprint('contract_api', __name__)

contract_api = Api(contract_blueprint)

contract_api.add_resource(ClosedContractsByOwner,'/contracts/owner-<username>/closed')
contract_api.add_resource(ContractsByOwner, '/contracts/owner-<username>')
contract_api.add_resource(RegisterContract, '/contract/register')
contract_api.add_resource(UpdateContract, '/contract/update/<challenge_id>')
contract_api.add_resource(AllContracts, '/contracts')
contract_api.add_resource(SearchContracts, '/contracts/search')
contract_api.add_resource(CloseContract, '/contract/close/<cid>')
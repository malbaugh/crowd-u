from flask import Blueprint
from flask_restful import Api

from .submission_initialize import InitializeSubmission
from .submission_delete import DeleteSubmission
from .submit_contract import SubmitToContract
from .submit_contract_team import SubmitToContractAsTeam
from .submit_contest_team import SubmitToContestAsTeam
from .submission_by_challenge import SubmissionsByChallenge
from .submission_by_user import SubmissionsByUser
from .submit_contest import SubmitContest
from .submission_update import UpdateSubmission
from .submission_photo import UpdateSubmissionPhoto
from .submission_winners_by_challenge import SubmissionWinnersByChallenge
from .submission_select_winners import SelectSubmissionWinners
from .application_select_winners import SelectApplicationWinners
from .submission_by_id import SubmissionById

challenge_submissions_blueprint = Blueprint('challenge_submissions_api', __name__)

challenge_submissions_api = Api(challenge_submissions_blueprint)

challenge_submissions_api.add_resource(SubmissionWinnersByChallenge,'/winners/challenge-<cid>')
challenge_submissions_api.add_resource(InitializeSubmission, '/initialize-challenge-submission')
challenge_submissions_api.add_resource(DeleteSubmission, '/submission-<sid>/delete')
challenge_submissions_api.add_resource(UpdateSubmissionPhoto, '/submissions/<sid>/photo')
challenge_submissions_api.add_resource(UpdateSubmission, '/submissions/update/<sid>')
challenge_submissions_api.add_resource(SubmitContest, '/submit/contest-<challenge_id>/user-<user_id>')
challenge_submissions_api.add_resource(SubmitToContract, '/submit/contract-<challenge_id>/user-<user_id>')
challenge_submissions_api.add_resource(SubmitToContestAsTeam, '/submit/contest-<challenge_id>/team-<team_id>')
challenge_submissions_api.add_resource(SubmitToContractAsTeam, '/submit/contract-<challenge_id>/team-<team_id>')
challenge_submissions_api.add_resource(SubmissionById, '/submissions/id-<sid>')
challenge_submissions_api.add_resource(SubmissionsByChallenge, '/submissions/challenge-<cid>')
challenge_submissions_api.add_resource(SubmissionsByUser, '/submissions/user-<uid>')
challenge_submissions_api.add_resource(SelectSubmissionWinners, '/select-winners/contest-<cid>')
challenge_submissions_api.add_resource(SelectApplicationWinners, '/select-winners/contract-<cid>')
# coding=utf-8

from flask import Flask
from flask_cors import CORS
from Models.entity import PRIVATE_KEY

application = Flask(__name__)
CORS(application)
application.secret_key = PRIVATE_KEY

# This needed as these functions must access Flask functionalities
# only after Flask has been initialized.
with application.app_context():
  from Endpoints.Challenges.challenges import challenge_blueprint
  from Endpoints.Challenges.contests import contest_blueprint
  from Endpoints.Challenges.contracts import contract_blueprint
  from Endpoints.Data.challenge_followers import challenge_followers_blueprint
  from Endpoints.Data.challenge_registrations import challenge_registration_blueprint
  from Endpoints.Data.challenge_submissions import challenge_submissions_blueprint
  from Endpoints.Data.form_files import form_files_blueprint
  from Endpoints.Data.submission_favorites import submission_favorites_blueprint
  from Endpoints.Data.user_followers import user_followers_blueprint
  from Endpoints.Services.emailing import emails_blueprint
  from Endpoints.Users.challenge_users import challenge_users_blueprint
  from Endpoints.Users.departments import departments_blueprint
  from Endpoints.Users.participant_users import participant_users_blueprint
  from Endpoints.Users.teams import teams_blueprint
  from Endpoints.Users.users import users_blueprint

  application.register_blueprint(challenge_blueprint)
  application.register_blueprint(contest_blueprint)
  application.register_blueprint(contract_blueprint)
  application.register_blueprint(challenge_followers_blueprint)
  application.register_blueprint(challenge_registration_blueprint)
  application.register_blueprint(challenge_submissions_blueprint)
  application.register_blueprint(form_files_blueprint)
  application.register_blueprint(submission_favorites_blueprint)
  application.register_blueprint(user_followers_blueprint)
  application.register_blueprint(emails_blueprint)
  application.register_blueprint(challenge_users_blueprint)
  application.register_blueprint(departments_blueprint)
  application.register_blueprint(participant_users_blueprint)
  application.register_blueprint(teams_blueprint)
  application.register_blueprint(users_blueprint)

if __name__ == '__main__':
    # application.run(host='0.0.0.0',port=80)
    application.run()
"""
@file main.py
@brief This file contains the main code of the application.
"""
import os, json, sys
import uuid

from flask import Flask
from flask import request, Response, jsonify
from flask import render_template, session, redirect, url_for, flash

from helper import CARTES, load_features_from_json, Player, Tache




class SessionManager:
    """
    @class SessionManager
    @brief This class is a singleton used to manage the session or the database.
    """
    _instance = None

   
    @classmethod
    def get_instance(cls):
        """
        @fn get_instance
        @brief This function returns the instance of the SessionManager class.
        """
        if not cls._instance:
            cls._instance = SessionManager()
        return cls._instance



class RuleFactory:
    """
    @class RuleFactory
    @brief This class is a factory used to create the rules.
    """
    @staticmethod
    def get_rule(rule_type):
        """
        @fn get_rule
        @brief This function returns the rule corresponding to the rule type.
        """
        if rule_type == "strict":
            return StrictRule()
        elif rule_type == "average":
            return AverageRule()
        elif rule_type == "median":
            return MedianRule()
        # Implémentez d'autres règles ici

# Exemple de classe de règle
class StrictRule:
    """
    @class StrictRule
    @brief This class is a rule used to evaluate the votes."""
    def evaluate_votes(self, votes):
        # Logique d'évaluation pour la règle stricte
        max_vote_count = 0
        winning_votes = []

        for vote in votes:
            vote_count = votes.count(vote)
            if vote_count > max_vote_count:
                max_vote_count = vote_count
                winning_votes = [vote]
            elif vote_count == max_vote_count:
                winning_votes.append(vote)

        return max_vote_count, winning_votes


class AverageRule:
    """
    @class AverageRule
    @brief This class is a rule used to evaluate the votes."""
    def evaluate_votes(self, votes):
        # Logique d'évaluation pour la règle de la moyenne
        total_score = sum(votes)
        average_score = total_score / len(votes)
        average_score = round(average_score, 2)  # Round to 2 decimal places if needed

        return average_score
class MedianRule:
    pass


# mydict={}
# mydict2={}
# revealScores=False

"""
@var sessions: a dictionary of sessions, the key is the session token and the value is a dictionary containing the players, the tasks and the cards"""
sessions = {}
"""
@var other_backlog: the path to the JSON file containing the features, tasks"""
other_backlog = ""
app = Flask(__name__)
app.secret_key = "kWd4qM4Z"


# @app.route('/')
# def start():
#     global revealScores
#     revealScores=False
#     return render_template('index.html', name='Scrum poker')


# @app.route('/reset')
# def reset():
#     global mydict, mydict2, revealScores
#     mydict={}
#     mydict2={}
#     revealScores=False
#     return 200


# @app.route('/reveal')
# def reveal():
#     global revealScores
#     revealScores=True
#     return 200


# @app.route('/vote')
# def vote():
#     global mydict, mydict2
#     name = request.args.get('name')
#     score = int(request.args.get('score'))
#     mydict.update({name: score})
#     mydict2.update({name: 0})
#     return jsonify(mydict)


# @app.route('/getvotes')
# def getvotes():
#     global mydict, mydict2, revealScores
#     if revealScores:
#         return jsonify(mydict)
#     return jsonify(mydict2)



####### API endpoints #######
@app.route('/', methods=['GET'])
def index():
    """
    @fn index
    @brief This function handles the GET request for the root URL ("/").
    @return The rendered template "index.html".
    """
    players={}
    tasks=[]
    cards=[]
    sessionT = session.get('session', None)
    
    if sessionT and sessionT not in sessions:
        sessions[sessionT] = {'players':players, 'tasks':tasks, 'cards':CARTES}
    if sessionT and session.get('username', None) is not None:
        if session.get('username', None) not in sessions[sessionT]['players']:
            sessions[sessionT]['players'][session.get('username', None)] = Player(session.get('username', None))
    if sessionT is not None:
        players = sessions[sessionT]['players']
        tasks = sessions[sessionT]['tasks']
        cards = sessions[sessionT]['cards']

    return render_template('index2.html', name='Scrum poker', players=players, tasks=tasks, cards=cards)


@app.route('/addplayer', methods=['GET', 'POST'])
def add_player():
    """
    @fn add_player
    @brief This function handles the POST request for the "/addplayer" URL.
    @return The rendered template "addplayer.html".
    """

    if request.method == 'POST' and request.form.getlist('username[]') is not None:
        usernames = request.form.getlist('username[]')
        for username in usernames:
            if username != "":
                session['username'] = username
                sessions[session['session']]['players'][username] = Player(username)
        
        return redirect(url_for('index'))
    return render_template('addplayer.html')


@app.route('/start')
def start():
    """
    @fn start
    @brief This function handles the GET request for the "/start" URL.
    @return A redirection to the "/round/0" URL.
    """
    tasks = sessions[session['session']]['tasks']
    if len(tasks) == 0:
        flash('Pas de tâches !')
        return redirect(url_for('index'))
    return redirect(url_for('round', task=0))


@app.route('/round/<int:task>')
def round(task):
    """
    @fn round
    @brief This function handles the GET request for the "/round/<int:task>" URL.
    @param task: the index of the task
    """
    tasks = sessions[session['session']]['tasks']
    if task >= len(tasks):
        flash("L'indice de la tâche est hors plage")
        return redirect(url_for('index'))
    return render_template('tour.html', task=tasks[task], id=task, cards=sessions[session['session']]['cards'])


@app.route('/vote/<int:task>/<points>')
def vote(task, points):
    """
    @fn vote
    @brief This function handles the GET request for the "/vote/<int:task>/<int:points>" URL.
    @param task: the index of the task
    @param points: the points given by the player
    """
    tasks = sessions[session['session']]['tasks']
    if task < 0 or task >= len(tasks):
        flash("L'indice de la tâche est hors plage")
        return redirect(url_for('index'))
    tasks[task].votes[session['username']] = points
    return redirect(url_for('resultats', task=task))

@app.route('/results/<int:task>')
def resultats(task):
    """
    @fn results
    @brief This function handles the GET request for the "/results/<int:task>" URL.
    @param task: the index of the task
    @return The rendered template "resultats.html".
    """
    tasks = sessions[session['session']]['tasks']
    if task >= len(tasks):
        flash("L'indice de la tâche est hors plage")
        return redirect(url_for('index'))
    return render_template('resultats.html', task=tasks[task], id=task, has_next=((task+1) < len(tasks)))

@app.route('/export')
def export():
    """
    @fn export
    @brief This function handles the GET request for the "/export" URL.
    @return A JSON object containing the tasks and the players.
    """
    tasks = sessions[session['session']]['tasks']
    players = sessions[session['session']]['players']
    # export to JSON
    # impossible to serialize Task objects, so we convert them to dictionaries
    tasks_dict = [task.__dict__ for task in tasks]
    players_d = [player.username for player in players.values()]
    json.dump({'tasks': tasks_dict, 'players': players_d}, open('save.json', 'w')) #doesn't work
    return {'tasks': tasks, 'players': players}

@app.route('/create_session')
def create_session():
    """
    @fn create_session
    @brief This function handles the GET request for the "/create_session" URL.
    @return A redirection to the "/index" URL.
    """
    global other_backlog
    sessionTok = uuid.uuid4()
    session['session'] = sessionTok
    sessions[sessionTok] = {'players': {}, 'tasks': [], 'cards': CARTES}
    if other_backlog != "":
        for feature in load_features_from_json(other_backlog):
            sessions[sessionTok]['tasks'].append(feature)
    else:
        for feature in load_features_from_json('backlog.json'):
            sessions[sessionTok]['tasks'].append(feature)

    flash(f'New session token: {sessionTok}')
    return redirect(url_for('index'))

@app.route('/join_session', methods=('GET', 'POST'))
def join_session():
    """
    @fn join_session
    @brief This function handles the GET and POST requests for the "/join_session" URL.
    @return The rendered template "join_session.html".
    """
    if request.method == 'POST':
        sessionTok = uuid.UUID(request.form['session'])
        if sessionTok not in sessions:
            flash('Token de session invalide!')
            return render_template('join_session.html')
        session['session'] = sessionTok
        return redirect(url_for('index'))
    return render_template('join_session.html')

@app.route('/enter_backlog', methods=('GET', 'POST'))
def enter_backlog():
    """
    @fn enter_backlog
    @brief This function handles the GET and POST requests for the "/enter_backlog" URL.
    """
    if request.method == 'POST':
        sessionTok = uuid.uuid4()
        session['session'] = sessionTok
        sessions[sessionTok] = {'players': {}, 'tasks': [], 'cards': CARTES}
        
        #ajouter les tasks rentrés manuellement
        tasks = request.form.getlist('backlog_item[]')
        for t in tasks:
            sessions[sessionTok]['tasks'].append(Tache(t, {}))


        return redirect(url_for('index'))
    return render_template('enter_backlog.html')


@app.route('/reset')
def reset():
    """
    @fn reset
    @brief This function handles the GET request for the "/reset" URL.
    """
    del sessions[session['session']]
    session.clear()
    return redirect(url_for('index'))

#charger une partie sauvegardée, sérialisée en JSON
@app.route('/load_json')
def load():
    """
    @fn load
    @brief This function handles the GET request for the "/load_json" URL.
    """
    if os.path.exists('save.json'):
        data = json.load(open('save.json', 'r'))
        sessions[session['session']] = {'players': data['players'], 'tasks': data['tasks'], 'cards': CARTES}
        return redirect(url_for('index'))
    else:
        flash('No save file!')
        return redirect(url_for('index'))



if __name__ == '__main__':      
    if len(sys.argv) > 1:
        if sys.argv[1].endswith('.json'):
            other_backlog = sys.argv[1]

    app.run(host='127.0.0.1', port=8080, debug=True)
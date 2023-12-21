import os

from flask import Flask
from flask import request, Response, jsonify
from flask import render_template


import requests

mydict={}
mydict2={}
revealScores=False

app = Flask(__name__)


@app.route('/')
def start():
    global revealScores
    revealScores=False
    return render_template('index.html', name='Scrum poker')


@app.route('/reset')
def reset():
    global mydict, mydict2, revealScores
    mydict={}
    mydict2={}
    revealScores=False
    return 200


@app.route('/reveal')
def reveal():
    global revealScores
    revealScores=True
    return 200


@app.route('/vote')
def vote():
    global mydict, mydict2
    name = request.args.get('name')
    score = int(request.args.get('score'))
    mydict.update({name: score})
    mydict2.update({name: 0})
    return jsonify(mydict)


@app.route('/getvotes')
def getvotes():
    global mydict, mydict2, revealScores
    if revealScores:
        return jsonify(mydict)
    return jsonify(mydict2)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
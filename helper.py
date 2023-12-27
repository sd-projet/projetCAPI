"""
@file helper.py
@brief This file contains helper functions and classes.
"""
import json

# class Feature:
#     def __init__(self, name, description):
#         self.name = name
#         self.description = description
#         self.votes = []


"""
@class Player
@brief a class representing a player
@var username: the username of the player
"""
class Player:
    def __init__(self, username):
        self.username = username

"""
@class Tache
@brief a class representing a task
@var description: the description of the task
@var votes: a dictionary of votes, the key is the username of the player and the value is the vote
"""
class Tache:
    def __init__(self, description, votes={}):
        self.description = description
        #a chaque tache on associe un dictionnaire de votes
        #ce dictionnaire a comme cle le nom du joueur et comme valeur le vote emis
        self.votes = votes

"""
@var CARTES: a list of integers representing the deck used for the votes
200 : ??
1000 : cafe
"""
CARTES = [1, 2, 3, 5, 8, 13, 20, 40, 100, 200, 1000]


def load_features_from_json(file_path):
    """
    @param file_path: the path to the JSON file containing the features
    @return: a list of Feature objects
    """
    with open(file_path, 'r') as file:
        features_data = json.load(file)
    features = []
    for feature_data in features_data:
        feature = Tache(feature_data['description'], votes={})
        features.append(feature)
    return features
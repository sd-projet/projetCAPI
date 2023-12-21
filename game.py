import pygame
import json

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption('Planning Poker')
clock = pygame.time.Clock()


class Player:
    def __init__(self, nickname):
        self.nickname = nickname
        self.vote = None

class Feature:
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.votes = []



def load_features_from_json(file_path):
    with open(file_path, 'r') as file:
        features_data = json.load(file)
    features = []
    for feature_data in features_data:
        feature = Feature(feature_data['nom'], feature_data['description'])
        features.append(feature)
    return features

def display_menu():
    num_players = int(input("Enter the number of players: "))
    players = []
    for i in range(num_players):
        nickname = input(f"Enter the nickname for player {i+1}: ")
        player = Player(nickname)
        players.append(player)

    print("Choose the planning poker rules:")
    print("1. Strict Rules")
    print("2. Average")
    print("3. Median")
    rule_choice = int(input("Enter the number of the chosen rule: "))
    if rule_choice == 1:
        rules = "Strict Rules"
    elif rule_choice == 2:
        rules = "Average"
    elif rule_choice == 3:
        rules = "Median"
    else:
        print("Invalid choice. Using default rules.")
        rules = "Strict Rules"

    return players, rules

def handle_voting(players, features, rules):
    for feature in features:
        for player in players:
            vote = input(f"{player.nickname}, enter your vote: ")
            player.vote = vote
            feature.votes.append(vote)
        # Validate or reject the feature based on the chosen rules
        if rules == "Strict Rules":
            if len(set(feature.votes)) == 1:
                print("Feature approved.")
            else:
                print("Feature rejected.")
        elif rules == "Average":
            total_votes = len(feature.votes)
            sum_votes = sum(int(vote) for vote in feature.votes)
            average_vote = sum_votes / total_votes
            if average_vote >= 5:
                print("Feature approved.")
            else:
                print("Feature rejected.")
        elif rules == "Median":
            pass
        else:
            print("Invalid rules. Feature rejected.")

        # Clear votes for the next feature
        for player in players:
            player.vote = None
        feature.votes = []


def game_loop():
    players = []
    features = []
    rules = None

    # Load features from JSON file
    features = load_features_from_json('backlog.json')

    # Display menu and get player information and rules
    display_menu()

    # Handle the voting process
    handle_voting(players, features, rules)

    for feature in features:
        approved = False
        while not approved:
            handle_voting(players, [feature], rules)
            if feature.approved:
                approved = True
            else:
                print("Feature not approved. Repeating once more voting process.")

        print(f"Feature '{feature.name}' has been approved!")
        

        # Clear approval status for the next feature
        feature.approved = False
    # Game loop
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # TODO: Implement the game logic and rendering

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()


if __name__ == '__main__':
    game_loop()
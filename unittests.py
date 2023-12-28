import unittest
from main import SessionManager  
from helper import Player, Tache

# TEST de SessionManager
class TestSessionManager(unittest.TestCase):
    def test_singleton_instance(self):
        # Teste si l'instance retournée par get_instance est toujours la même
        instance1 = SessionManager.get_instance()
        instance2 = SessionManager.get_instance()
        self.assertIs(instance1, instance2)



class TestPlayer(unittest.TestCase):
    def test_player_initialization(self):
        # Teste l'initialisation de la classe Player
        player = Player("test_user")
        self.assertEqual(player.username, "test_user")

class TestTache(unittest.TestCase):
    def test_tache_initialization(self):
        # Teste l'initialisation de la classe Tache
        tache = Tache("Test description")
        self.assertEqual(tache.description, "Test description")
        self.assertEqual(tache.votes, {})

    def test_tache_votes(self):
        # Teste l'ajout de votes à une tache
        tache = Tache("Test", {"user1": 5})
        self.assertEqual(tache.votes, {"user1": 5})




if __name__ == '__main__':
    unittest.main()

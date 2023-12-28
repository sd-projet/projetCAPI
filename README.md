# Planning Poker Flask
#### Clone
```bash
git clone https://github.com/sd-projet/projetCAPI.git
cd projetCAPI/
```

#### How to run
```bash
pip install -r requirements.txt
python3 main.py [backlog_file]
```
backlog_file is optional, if not specified, the default file is used (backlog.json)<br/>
Minimal structure of the backlog file :
```json
[
    {
        "description": "Effectuer une connexion à l'application",
    }
]
```

<br/>
Click on the link to access the app :
http://127.0.0.1:8080/



#### Non implementé
- Game's logic (vote, reveal)
- No errors handling
- No unitary tests

#### API :
- /create_session : create a new session and load the backlog
- /join_session : join a session
- /addplayer : add a player to the session
- /start : start the game
- /reset : reset the current session
- /export : export the session in a json file


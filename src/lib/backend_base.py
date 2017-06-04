import json
from lib import spbdt_database

class spbdt():
    def __init__(self):
        self.db = spbdt_database.SPBDTDatabase({})

    def getUser(self, id):
        print(id)
        return self.db.select('spbdt.user', {'id': id})
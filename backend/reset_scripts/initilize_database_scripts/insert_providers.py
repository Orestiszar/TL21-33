import mysql.connector as sql
import random
import pandas as pd

# establish connections
try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    print("Connection OK")
except:
    print("Connection Failed")

# create query
query = "INSERT INTO provider(providerID, provider_name) VALUES (%s,%s)"
values = []

values.append(("AO", "aodos"))
values.append(("GF", "gefyra"))
values.append(("EG", "egnantia"))
values.append(("KO", "kentriki_odos"))
values.append(("MR", "moreas"))
values.append(("NE", "nea_odos"))
values.append(("OO", "olympia_odos"))

# set values and end connection
cur = base.cursor()
cur.executemany(query, values)

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")
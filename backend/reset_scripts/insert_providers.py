import mysql.connector as sql

# establish connections
try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    #print("Connection OK")
except:
    pass
    #print("Connection Failed")

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
values.append(("transAuth", "transportation_authorities"))

# set values and end connection
cur = base.cursor()
cur.executemany(query, values)

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")
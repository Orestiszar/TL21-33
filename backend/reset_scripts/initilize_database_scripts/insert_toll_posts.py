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
query = "INSERT INTO toll_post(tollID, providerID) VALUES (%s,%s)"
values = []

# read csv
data = pd.read_csv('sampledata01_stations.csv')

# insert data
for row in data.itertuples(index=True, name='Pandas'):
    val = str(row[1]).split(';')

    temp = (val[0], val[0][:2])
    values.append(temp)

# set values and end connection
cur = base.cursor()
cur.executemany(query, values)

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")
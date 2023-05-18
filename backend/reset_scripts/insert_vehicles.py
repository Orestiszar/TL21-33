import mysql.connector as sql
import random
import pandas as pd
from datetime import datetime
import os

# establish connections
try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    # print("Connection OK")
except:
    pass
    # print("Connection Failed")


# create query
query1 = "INSERT INTO e_pass(tagID, vehicleID, license_year, providerID) VALUES (%s,%s,%s,%s)"
values1 = []

# read csv
data = pd.read_csv(os.path.dirname(os.path.realpath(__file__)) + '\\sampledata01_passes100_8000.csv')

# insert data from transactions
s = set()
for row in data.itertuples(index=True, name='Pandas'):
    val = str(row[1]).split(';')

    temp = (val[0], val[3], random.randint(2000, 2020), val[7])
    if((val[0], val[3]) not in s):
        values1.append(temp)
        s.add((val[0], val[3]))


# set values and end connection
cur1 = base.cursor()
for v in values1:
    cur1.execute(query1, v)

# print('New vehicles added first try')

# create query
query2 = "INSERT INTO e_pass(tagID, vehicleID, license_year, providerID) VALUES (%s,%s,%s,%s)"
values2 = []

# read csv
data2 = pd.read_csv(os.path.dirname(os.path.realpath(__file__)) +'\\sampledata01_vehicles_100.csv')

# insert data
for row in data2.itertuples(index=True, name='Pandas'):
    val = str(row[1]).split(';')

    temp = (val[0], val[1], val[4], val[3])
    if((val[0], val[1]) not in s):
        values2.append(temp)
        s.add((val[0], val[1]))

# set values and end connection
cur2 = base.cursor()
cur2.executemany(query2, values2)

# print("Vehicles completed")

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")

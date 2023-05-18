import mysql.connector as sql
import pandas as pd
from datetime import datetime

# INITIALIZES TRANSACTIONS TO GIVEN VALUES

# establish connections
try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    # print("Connection OK")
except:
    pass
    # print("Connection Failed")


# create query
query = "INSERT INTO transaction (token, time_of_trans, rate, e_pass_tagID, e_pass_vehicleID, toll_post_tollID) VALUES (%s,%s,%s,%s,%s,%s)"
values = []

# insert data

# read csv
data = pd.read_csv('sampledata01_passes100_8000.csv')
i = 0
for row in data.itertuples(index=True, name='Pandas'):
    val = str(row[1]).split(';')
    i += 1

    epass = val[0]
    time = datetime.strptime(val[1], '%d/%m/%Y %H:%M')
    station = val[2]
    vehicle = val[3]
    fee = val[4]

    temp = (str(i), time.strftime("%y/%m/%d %H:%M:%S"),
            fee, epass, vehicle, station)
    values.append(temp)

# set values and end connection
cur = base.cursor()
for v in values:
    cur.execute(query, v)

# print("transactions added")

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")

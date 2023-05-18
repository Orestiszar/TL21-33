import mysql.connector as sql
import pandas as pd
import sys
from datetime import datetime

# establish connections
try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    # print("Connection OK")
except:
    pass
    # print("Connection Failed")

# create query
query = "INSERT INTO transaction (time_of_trans, rate, e_pass_tagID, e_pass_vehicleID, toll_post_tollID) VALUES (%s,%s,%s,%s,%s)"
values = []

data = pd.read_csv(sys.argv[1])

# insert data
for row in data.itertuples(index=True, name='Pandas'):
    val = str(row[1]).split(';')

    epass = val[0]
    time = datetime.strptime(val[1], '%d/%m/%Y %H:%M')
    station = val[2]
    vehicle = val[3]
    fee = val[4]

    temp = (time.strftime("%y/%m/%d %H:%M:%S"), fee, epass, vehicle, station)
    values.append(temp)

cur = base.cursor()
for v in values:
    cur.execute(query, v)

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")

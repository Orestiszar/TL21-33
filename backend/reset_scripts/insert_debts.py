from tkinter.tix import Select
import mysql.connector as sql
import random
import pandas as pd
from datetime import datetime
from datetime import timedelta

# debts:
# indebted
# benefiter
# amount
# date
# details


# establish connections
try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    print("Connection OK")
except:
    print("Connection Failed")


# read csv
data = pd.read_csv('sampledata01_passes100_8000.csv')

mintime = datetime.strptime('15/11/2040 03:37:00', '%d/%m/%Y %H:%M:%S')
maxtime = mintime
# insert data
for row in data.itertuples(index=True, name='Pandas'):
    val = str(row[1]).split(';')

    time = datetime.strptime(val[1], '%d/%m/%Y %H:%M')
    if (time < mintime):
        mintime = time
    if (time > maxtime):
        maxtime = time



operators = ["AO", "EG", "GF", "KO", "MR", "NE", "OO"]
datefrom = mintime.strftime('%Y-%m-%d')
dateto = maxtime.strftime('%Y-%m-%d')
i = 0
for op1_ID in operators:
    i += 1
    for op2_ID in operators[i:]:
        # run op2 owes to op1
        query = "SELECT (op2_owes_op1.PassesCost - op1_owes_op2.PassesCost) + (op1_payed_op2.op1_to_op2_payments - op2_payed_op1.op2_to_op1_payments) as op2_owes_to_op1 FROM  ( SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = '" + op1_ID+"' AND tr.time_of_trans BETWEEN '"+datefrom+"' AND '"+dateto+"' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID = '" + op2_ID+"' AND tr.time_of_trans BETWEEN '"+datefrom+"' AND '"+dateto+"' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token ) AS op2_owes_op1,  ( SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = '" + \
            op2_ID+"' AND tr.time_of_trans BETWEEN '"+datefrom+"' AND '"+dateto+"' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID = '" + op1_ID+"' AND tr.time_of_trans BETWEEN '"+datefrom+"' AND '"+dateto + \
            "' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token ) AS op1_owes_op2, ( SELECT IFNULL(SUM(de.amount), 0) AS op1_to_op2_payments FROM debts AS de WHERE de.indebted = '" + op1_ID+"' AND de.benefiter = '" + op2_ID+"' AND de.date BETWEEN '"+datefrom + \
            "' AND '"+dateto+"' ) AS op1_payed_op2,  ( SELECT IFNULL(SUM(de.amount), 0) AS op2_to_op1_payments FROM debts AS de WHERE de.indebted = '" + \
            op2_ID+"' AND de.benefiter = '" + op1_ID+"' AND de.date BETWEEN '" + \
                datefrom+"' AND '"+dateto+"' ) AS op2_payed_op1"

        cur = base.cursor()
        cur.execute(query)
        ans = cur.fetchall()[0][0]

        if (abs(ans) < 0.01):
            continue

        if (ans > 0):
            insert_query = "INSERT INTO debts(indebted, benefiter, amount, date, details) VALUES ('%s','%s',%s,'%s','%s')" % (
                op2_ID, op1_ID, str(round(ans, 2)), dateto, "Pending")
        else:
            insert_query = "INSERT INTO debts(indebted, benefiter, amount, date, details) VALUES ('%s','%s',%s,'%s','%s')" % (
                op1_ID, op2_ID, str(-1*round(ans, 2)), dateto, "Pending")

        cur = base.cursor()
        cur.execute(insert_query)



try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")

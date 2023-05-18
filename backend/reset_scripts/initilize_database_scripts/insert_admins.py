import mysql.connector as sql

try:
    base = sql.connect(user='root', password='',
                       host='localhost', database='tl21')
    print("Connection OK")
except:
    print("Connection Failed")

query = "INSERT INTO admin(username,password,email,authority_level) VALUES (%s,%s,%s,%s)"

values = [
    ('AO','aodos','aodos@gmail.com','1'),
    ('EG','egnatia','egnatia@gmail.com','1'),
    ('GF','gefyra','gefyra@gmail.com','1'),
    ('KO','kentriki_odos','kentriki_odos@gmail.com','1'),
    ('MR','moreas','moreas@gmail.com','1'),
    ('NE','nea_odos','nea_odos@gmail.com','1'),
    ('OO','olympia_odos','olympia_odos@gmail.com','1'),
    ('transAuth','transportation_authority','transportation_authority@gmail.com','3')  
]

cur = base.cursor()
cur.executemany(query,values)

try:
    base.commit()
    print("Commit OK")
except:
    print("Commit Failed")

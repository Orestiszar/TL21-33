from distutils import command
import subprocess
import os
import pandas as pd
import mysql.connector as sql

# [TODO] TESTING RESET ENDPOINTS

# functions that are not to be tested
__test__ = False


def capture(command):
    home = str(os.getcwd())
    proc = subprocess.Popen(command,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            shell=True,
                            cwd=home
                            )
    out, err = proc.communicate()
    return out, err, proc.returncode


def login_as_admin():
    command = ["se2133", "login", "--username", 'admin', "--passw", 'freepasses4all']
    capture(command)


def login_as_provider(usrname, passw):
    command = ["se2133", "login", "--username", usrname, "--passw", passw]
    capture(command)


def logout():
    command = ["se2133", "logout"]
    capture(command)


def connect_and_query(query):
    try:
        base = sql.connect(user='root', password='',
                           host='localhost', database='tl21')
        print("Connection OK")
    except:
        print("Connection Failed")

    cur = base.cursor()
    cur.execute(query)

    # print(cur.fetchall())
    ans = cur.fetchall()

    base.commit()
    base.close()

    return ans


__test__ = True


def test_valid_login_logout():
    home = str(os.getcwd()) + '/../cli'
    users_passws = [
        ('admin', 'freepasses4all'),
        ('AO', 'aodos'),
        ('EG', 'egnantia'),
        ('GF', 'gefyra'),
        ('KO', 'kentriki_odos'),
        ('MR', 'moreas'),
        ('NE', 'nea_odos'),
        ('OO', 'olympia_odos'),
        ('transAuth', 'transportation_authority')
    ]

    for up in users_passws:
        command = ["se2133", "login", "--username", up[0], "--passw", up[1]]
        out, err, exitcode = capture(command)
        assert os.path.exists(home + '/cookie')
        assert exitcode == 0

        command = ["se2133", "logout"]
        out, err, exitcode = capture(command)
        assert not os.path.exists(home + '/cookie')
        assert exitcode == 0


def test_invalid_login_logout():
    home = str(os.getcwd()) + '/../cli'
    invalid_users_passws = [
        ('adhmin', 'admin'),
        ('AOO', 'aodos'),
        ('EGGG', 'egnantia'),
        ('gefyra', 'GFR'),
        ('O', 'kentriki_odos'),
        ('M', 'oreas'),
        ('NE', 'nea'),
        ('OaO', 'olgympia_odos'),
        ('transAuth', 'transortation_authority')
    ]

    for inv_up in invalid_users_passws:
        command = ["se2133", "login", "--username",
                   inv_up[0], "--passw", inv_up[1]]
        _, _, exitcode = capture(command)
        assert not os.path.exists(home + '/cookie')
        assert exitcode == 0

        command = ["se2133", "logout"]
        _, _, exitcode = capture(command)
        assert not os.path.exists(home + '/cookie')
        assert exitcode == 0


def test_healthcheck():
    command = ["se2133", "healthcheck"]
    out, _, _ = capture(command)
    assert out == b'''{\n  status: 'OK',\n  dbconnection: 'localhost',\n  user: 'root',\n  database_name: 'tl21'\n}\n'''

def test_passesperstation():
    home = str(os.getcwd()) + '/../cli'
    login_as_admin()
    station = 'AO01'
    datefrom = '20211105'
    dateto = '20221110'
    formats = ['csv']
    for format in formats:
        command = ["se2133", "passesperstation", "--station",
                   station, "--datefrom", datefrom, '--dateto', dateto, '--format', format]
        out, err, exitcode = capture(command)


        if (os.path.exists('./passesperstation.csv')):
            df = pd.read_csv('passesperstation.csv')
        else:
            assert out == b'''Empty Responce\n'''
            continue
        df = pd.read_csv('passesperstation.csv')
        true_cols = ['PassIndex', 'PassTimeStamp',
                        'VehicleID', 'TagProvider', 'PassType', 'PassCharge']
        cols_to_test = df.columns[0].split(';')
        for i in range(len(cols_to_test)):
            assert cols_to_test[i] == true_cols[i]
        os.remove("passesperstation.csv")

        assert exitcode == 0
    logout()


def test_passesanalysis():
    home = str(os.getcwd()) + '/../cli'
    login_as_admin()
    ops = ['AO', 'EG', 'GF', 'KO', 'MR', 'NE', 'OO']
    datefrom = '20211105'
    dateto = '20221110'
    formats = ['csv', 'json']

    true_cols = ['PassIndex', 'PassID', 'StationID',
                 'TimeStamp', 'VehicleID', 'Charge']

    for format in formats:
        for op1 in ops:
            for op2 in ops:
                command = ["se2133", "passesanalysis", "--op1", op1, "--op2", op2,
                           "--datefrom", datefrom, '--dateto', dateto, '--format', format]
                out, err, exitcode = capture(command)
                assert exitcode == 0

                if (format == 'csv'):
                    if (os.path.exists('./passesanalysis.csv')):
                        df = pd.read_csv('passesanalysis.csv')
                    else:
                        assert out == b'''Empty Responce\n'''
                        continue

                    cols_to_test = df.columns[0].split(';')
                    for i in range(len(cols_to_test)):
                        assert cols_to_test[i] == true_cols[i]
                    os.remove("passesanalysis.csv")
    logout()


def test_passescost():
    home = str(os.getcwd()) + '/../cli'
    login_as_admin()
    ops = ['AO', 'EG', 'GF', 'KO', 'MR', 'NE', 'OO']
    datefrom = '20211105'
    dateto = '20221110'
    formats = ['csv', 'json']

    true_cols = ['op1_ID', 'op2_ID', 'RequestTimeStamp',
                 'PeriodFrom', 'PeriodTo', 'NumberOfPasses', 'PassesCost']

    for format in formats:
        for op1 in ops:
            for op2 in ops:
                command = ["se2133", "passescost", "--op1", op1, "--op2", op2,
                           "--datefrom", datefrom, '--dateto', dateto, '--format', format]
                out, err, exitcode = capture(command)
                assert exitcode == 0

                if (format == 'csv'):
                    if (os.path.exists('./passescost.csv')):
                        df = pd.read_csv('passescost.csv')
                    else:
                        assert out == b'''Empty Responce\n'''
                        continue

                    cols_to_test = df.columns[0].split(';')
                    for i in range(len(cols_to_test)):
                        assert cols_to_test[i] == true_cols[i]
                    os.remove("passescost.csv")
    logout()


def test_chargesby():
    home = str(os.getcwd()) + '/../cli'
    login_as_admin()

    ops = ['AO', 'EG', 'GF', 'KO', 'MR', 'NE', 'OO']
    datefrom = '20211105'
    dateto = '20221110'
    formats = ['csv', 'json']

    for format in formats:
        for op1 in ops:
            command = ["se2133", "chargesby", "--op1", op1,
                       "--datefrom", datefrom, '--dateto', dateto, '--format', format]
            out, err, exitcode = capture(command)
            assert exitcode == 0

            if (format == 'csv'):
                if (os.path.exists('./chargesby.csv')):
                    df = pd.read_csv('chargesby.csv')
                else:
                    assert out == b'''Empty Responce\n'''
                    continue

                df = pd.read_csv('chargesby.csv')
                true_cols = ['VisitingOperator',
                             'NumberOfPasses', 'PassesCost']
                cols_to_test = df.columns[0].split(';')
                for i in range(len(cols_to_test)):
                    assert cols_to_test[i] == true_cols[i]
                os.remove("chargesby.csv")
    logout()

def test_users():
    ops = ['admin', 'AO', 'EG', 'GF', 'KO', 'MR', 'NE', 'OO']
    # users_passws = [
    #     ('admin', 'freepasses4all'),
    #     ('AO', 'aodos'),
    #     ('EG', 'egnantia'),
    #     ('GF', 'gefyra'),
    #     ('KO', 'kentriki_odos'),
    #     ('MR', 'moreas'),
    #     ('NE', 'nea_odos'),
    #     ('OO', 'olympia_odos'),
    #     ('transAuth', 'transportation_authority')
    # ]
    # for logged_in_op in users_passws:
    #     login_as_provider(logged_in_op[0],logged_in_op[1])
    login_as_admin()
    
    for op in ops:
        command = ['se2133', 'admin', '--users', op]
        out, err, exitcode = capture(command)
        if (op == 'admin'):
            assert out == ("User ["+ op +"] connected\n").encode('ascii')
        else:
            assert out == ("User ["+ op +"] not connected\n").encode('ascii')
    logout()


def test_admin_usermod():
    login_as_admin()

    usernames = ["test1", "test2", "admin", "EG"]
    passwords = ['testpass123', 'testpass321', 'new_admin_pass', 'new_eg_pass']

    for i in range(len(usernames)):
        command = ["se2133", "admin", "--usermod", "--username",
                   usernames[i], "--passw", passwords[i]]
        out, err, exitcode = capture(command)
        assert exitcode == 0
    
    qr = "SELECT username FROM admin WHERE (password = 'testpass123') OR (password = 'testpass321') OR (password = 'new_admin_pass') OR (password = 'new_eg_pass')"
    db_ans = connect_and_query(qr)
    for i in range(len(db_ans)):
        assert db_ans[i][0] in usernames 
    logout()

def test_resetpasses():
    login_as_provider('admin', 'new_admin_pass')
    
    command = ["se2133", "resetpasses"]
    out, _, _ = capture(command)
    assert out == b'''{ status: 'OK' }\n'''
    ans = connect_and_query("SELECT * FROM transaction")
    assert len(ans) == 0
    
    logout()


def test_resetvehicles():
    login_as_admin()
    
    command = ["se2133", "resetvehicles"]
    out, _, _ = capture(command)
    assert out == b'''{ status: 'Re-initialization complete' }\n'''
    ans = connect_and_query("SELECT COUNT(*) FROM e_pass")
    assert ans[0][0] == 36113
    
    logout()

def test_resetstations():
    login_as_admin()
    
    command = ["se2133", "resetstations"]
    out, _, _ = capture(command)
    assert out == b'''{ status: 'Re-initialization complete' }\n'''
    ans = connect_and_query("SELECT COUNT(*) FROM toll_post")
    assert ans[0][0] == 84
    
    logout()
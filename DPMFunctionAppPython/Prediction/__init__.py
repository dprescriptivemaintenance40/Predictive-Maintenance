import logging

import azure.functions as func
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import psycopg2


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
    conn = psycopg2.connect(
            host="dpmdb.postgres.database.azure.com",
            database="DPM",
            user="dpm@dpmdb",
            password="Admin@123")
    cur = conn.cursor()
    if name == "prediction":
        cur.execute(
            'select * from compressurewithclassification ORDER BY "CompClassID" ASC  ')
        row_header = [x[0] for x in cur.description]
        # provide path of TrainWithClassification
        compressClassificationdata = pd.DataFrame(
            cur.fetchall(), columns=row_header)

        cur.execute(
            """select * from screwcompressorpredictiontable where "Prediction" isnull or "Prediction" = 'pending'  
            ORDER BY "PredictionId" ASC  """)
        row_header = [x[0] for x in cur.description]
        # provide path of Test Data for Prediction
        compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
        if compressTestdata.count().values[0] != 0:
            train, test = train_test_split(
                compressClassificationdata, stratify=compressClassificationdata['Classification'])
            print(
                "======================================Train Data set================================================")
            train.head()
            print(train.head())
            lr = LogisticRegression(
                random_state=0, solver='lbfgs', max_iter=10000)
            lr.fit(train[['PS1', 'PD1', 'PS2', 'PD2', 'TS1',
                          'TD1', 'TS2', 'TD2']], train['Classification'])
            print("======================================Test Data set================================================")
            compressTestdata["Predicted"] = lr.predict(
                compressTestdata[['PS1', 'PD1', 'PS2', 'PD2', 'TS1', 'TD1', 'TS2', 'TD2']])
            print(compressTestdata.head())
            count = 0
            for row in compressTestdata.itertuples():
                count += 1
                print(row.PredictionId, " ", row.Predicted, " ", count)
                sql = """UPDATE screwcompressorpredictiontable SET "Prediction" = %s WHERE "PredictionId" = %s"""
                val = (row.Predicted, row.PredictionId)
                cur.execute(sql, val)
            conn.commit()
            count = 0
            print("Prediction done")
        else:
            print("Prediction table is empty")

        print("Process completed")
        return func.HttpResponse(f"Hello, Prediction. Process completed")

    elif  name =="futureprediction":
        cur.execute(
            'select * from compressurewithclassification ORDER BY "CompClassID" ASC  ')
        row_header = [x[0] for x in cur.description]
        # provide path of TrainWithClassification
        compressClassificationdata = pd.DataFrame(
            cur.fetchall(), columns=row_header)

        cur.execute(
            """select * from screwcompressorfutureprediction where "Prediction" isnull or "Prediction" = 'pending'  
            ORDER BY "SCFPId" ASC  """)
        row_header = [x[0] for x in cur.description]
        # provide path of Test Data for Prediction
        compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
        if compressTestdata.count().values[0] != 0:
            train, test = train_test_split(
                compressClassificationdata, stratify=compressClassificationdata['Classification'])
            print(
                "======================================Train Data set================================================")
            train.head()
            print(train.head())
            lr = LogisticRegression(
                random_state=0, solver='lbfgs', max_iter=10000)
            lr.fit(train[['PS1', 'PD1', 'PS2', 'PD2', 'TS1',
                          'TD1', 'TS2', 'TD2']], train['Classification'])
            print("======================================Test Data set================================================")
            compressTestdata["Predicted"] = lr.predict(
                compressTestdata[['PS1', 'PD1', 'PS2', 'PD2', 'TS1', 'TD1', 'TS2', 'TD2']])
            print(compressTestdata.head())
            count = 0
            for row in compressTestdata.itertuples():
                count += 1
                print(row.SCFPId, " ", row.Predicted, " ", count)
                sql = """UPDATE screwcompressorfutureprediction SET "Prediction" = %s WHERE "SCFPId" = %s"""
                val = (row.Predicted, row.SCFPId)
                cur.execute(sql, val)
            conn.commit()
            count = 0
            print("Future Prediction done")
        else:
            print("Future Prediction table is empty")

        print("Process completed")
        return func.HttpResponse(f"Hello, Future Prediction. Process completed")
   
    else :
         return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request "
            "body for a personalized response.",
            status_code=200
        )   

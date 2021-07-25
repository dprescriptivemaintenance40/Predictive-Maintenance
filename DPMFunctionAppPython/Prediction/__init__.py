import logging

import azure.functions as func
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import psycopg2


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    UserId = req.params.get('UserId')
    name = req.params.get('name')
    type = req.params.get('type')    
    
    conn = psycopg2.connect(
            host="51.79.221.240",
            database="DPMDB",
            user="postgres",
            password="Admin@123")
    cur = conn.cursor()
    if type == "compressor":
        if name == "prediction":

            #Step 1 Starts: Prediction for all three failure modes
            classSQL = """select * from "compressurewithclassification" 
                          where "UserId" = %s 
                          and "Classification" != 'bad' 
                          ORDER BY "CompClassID" ASC   """                
            cur.execute(classSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of TrainWithClassification
            compressClassificationdata = pd.DataFrame(
                cur.fetchall(), columns=row_header)

            predictSQL = """select * from "screwcompressorpredictiontable" 
                            where "UserId" = %s 
                            and ("Prediction" isnull or "Prediction" = 'pending')  
                            ORDER BY "PredictionId" ASC  """                 
            cur.execute(predictSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of Test Data for Prediction
            compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
            if compressClassificationdata.count().values[0] !=0 and compressTestdata.count().values[0] != 0:
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
                    sql = """UPDATE screwcompressorpredictiontable 
                             SET "Prediction" = %s 
                             WHERE "UserId" = %s 
                             and "PredictionId" = %s"""
                    val = (row.Predicted, UserId, row.PredictionId)
                    cur.execute(sql, val)
                conn.commit()
                count = 0
                print("Prediction done")
            #Step 1 Ends: Prediction for all three failure modes

            #Step 2 Starts: Prediction for Rotar Damage
            classSQL = """select * from "compressurewithclassification" 
                          where "UserId" = %s 
                          and "Classification" != 'bad' 
                          and "FailureModeType" ='RD'
                          ORDER BY "CompClassID" ASC   """                
            cur.execute(classSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of TrainWithClassification
            compressClassificationdata = pd.DataFrame(
                cur.fetchall(), columns=row_header)

            predictSQL = """select * from "screwcompressorpredictiontable" 
                            where "UserId" = %s 
                            and ("RD" isnull or "RD" = 'pending') 
                            ORDER BY "PredictionId" ASC  """                 
            cur.execute(predictSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of Test Data for Prediction
            compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
            if compressClassificationdata.count().values[0] !=0 and compressTestdata.count().values[0] != 0 :
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
                    sql = """UPDATE screwcompressorpredictiontable 
                             SET "RD" = %s 
                             WHERE "UserId" = %s 
                             and "PredictionId" = %s"""
                    val = (row.Predicted, UserId, row.PredictionId)
                    cur.execute(sql, val)
                conn.commit()
                count = 0
                print("Prediction done")

            #Step 2 Ends: Prediction for Rotar Damage

            #Step 3 Starts: Prediction for Second Stage Rotar Breakdown
            classSQL = """select * from "compressurewithclassification" 
                          where "UserId" = %s 
                          and "Classification" != 'bad' 
                          and "FailureModeType" ='SSRB'
                          ORDER BY "CompClassID" ASC   """                         
            cur.execute(classSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of TrainWithClassification
            compressClassificationdata = pd.DataFrame(
                cur.fetchall(), columns=row_header)

            predictSQL = """select * from "screwcompressorpredictiontable" 
                            where "UserId" = %s 
                            and ("SSRB" isnull or "SSRB" = 'pending') 
                            ORDER BY "PredictionId" ASC  """                  
            cur.execute(predictSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of Test Data for Prediction
            compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
            if compressClassificationdata.count().values[0] !=0 and compressTestdata.count().values[0] != 0:
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
                    sql = """UPDATE screwcompressorpredictiontable 
                             SET "SSRB" = %s 
                             WHERE "UserId" = %s 
                             and "PredictionId" = %s"""
                    val = (row.Predicted, UserId, row.PredictionId)
                    cur.execute(sql, val)
                conn.commit()
                count = 0
                print("Prediction done")

            #Step 3 Ends: Prediction for Second Stage Rotar Breakdown

            #Step 4 Starts: Prediction for Cooler Failure
            classSQL = """select * from "compressurewithclassification" 
                          where "UserId" = %s 
                          and "Classification" != 'bad' 
                          and "FailureModeType" ='CoolerFailure'
                          ORDER BY "CompClassID" ASC   """                         
            cur.execute(classSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of TrainWithClassification
            compressClassificationdata = pd.DataFrame(
                cur.fetchall(), columns=row_header)

            predictSQL = """select * from "screwcompressorpredictiontable" 
                            where "UserId" = %s 
                            and ("CF" isnull or "CF" = 'pending') 
                            ORDER BY "PredictionId" ASC  """                  
            cur.execute(predictSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of Test Data for Prediction
            compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
            if compressClassificationdata.count().values[0] !=0 and compressTestdata.count().values[0] != 0:
                train, test = train_test_split(
                    compressClassificationdata, stratify=compressClassificationdata['Classification'])
                print(
                    "======================================Train Data set================================================")
                train.head()
                print(train.head())
                lr = LogisticRegression(
                    random_state=0, solver='lbfgs', max_iter=10000)
                lr.fit(train[['TS1', 'TD1']], train['Classification'])
                print("======================================Test Data set================================================")
                compressTestdata["Predicted"] = lr.predict(
                    compressTestdata[['TS1', 'TD1']])
                print(compressTestdata.head())
                count = 0
                for row in compressTestdata.itertuples():
                    count += 1
                    print(row.PredictionId, " ", row.Predicted, " ", count)
                    sql = """UPDATE screwcompressorpredictiontable 
                             SET "CF" = %s 
                             WHERE "UserId" = %s 
                             and "PredictionId" = %s"""
                    val = (row.Predicted, UserId, row.PredictionId)
                    cur.execute(sql, val)
                conn.commit()
                count = 0
                print("Prediction done")
                #Step 4 Ends: Prediction for Cooler Failure
                

            else:
                print("Prediction table is empty")

            print("Process completed")
            return func.HttpResponse(f"Hello, Prediction. Process completed")

        elif  name =="futureprediction":

                #Step 1 Starts: Prediction for all three failure modes
                classSQL = """select * from "compressurewithclassification" 
                              where "UserId" = %s 
                              and "Classification" != 'bad' 
                              ORDER BY "CompClassID" ASC   """                      
                cur.execute(classSQL, [UserId])
                row_header = [x[0] for x in cur.description]
                # provide path of TrainWithClassification
                compressClassificationdata = pd.DataFrame(
                    cur.fetchall(), columns=row_header)

                predictSQL = """select * from "screwcompressorfutureprediction" 
                                where "UserId" = %s 
                                and ("Prediction" isnull or "Prediction" = 'pending')  
                                ORDER BY "SCFPId" ASC  """
                cur.execute(predictSQL, [UserId])

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
                        sql = """UPDATE screwcompressorfutureprediction SET "Prediction" = %s WHERE "UserId" = %s and "SCFPId" = %s"""
                        val = (row.Predicted, UserId, row.SCFPId)
                        cur.execute(sql, val)
                    conn.commit()
                    count = 0
                    print("Future Prediction done")
                #Step 1 Ends: Prediction for all three failure modes

                #Step 2 Starts: Prediction for Rotar Damage
                classSQL = """select * from "compressurewithclassification" 
                              where "UserId" = %s 
                              and "Classification" != 'bad' 
                              and "FailureModeType" = 'RD'
                              ORDER BY "CompClassID" ASC   """                      
                cur.execute(classSQL, [UserId])
                row_header = [x[0] for x in cur.description]
                # provide path of TrainWithClassification
                compressClassificationdata = pd.DataFrame(
                    cur.fetchall(), columns=row_header)

                predictSQL = """select * from "screwcompressorfutureprediction" 
                                where "UserId" = %s 
                                and ("RD" isnull or "RD" = 'pending')  
                                ORDER BY "SCFPId" ASC  """
                cur.execute(predictSQL, [UserId])

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
                        sql = """UPDATE screwcompressorfutureprediction 
                                 SET "RD" = %s 
                                 WHERE "UserId" = %s 
                                 and "SCFPId" = %s"""
                        val = (row.Predicted, UserId, row.SCFPId)
                        cur.execute(sql, val)
                    conn.commit()
                    count = 0
                    print("Future Prediction done")
                #Step 2 Ends: Prediction for  Rotar Damage

                #Step 3 Starts: Prediction for Second Stage Rotar Breakdown
                classSQL = """select * from "compressurewithclassification" 
                              where "UserId" = %s 
                              and "Classification" != 'bad' 
                              and "FailureModeType" = 'SSRB'
                              ORDER BY "CompClassID" ASC   """                      
                cur.execute(classSQL, [UserId])
                row_header = [x[0] for x in cur.description]
                # provide path of TrainWithClassification
                compressClassificationdata = pd.DataFrame(
                    cur.fetchall(), columns=row_header)

                predictSQL = """select * from "screwcompressorfutureprediction" 
                                where "UserId" = %s 
                                and ("SSRB" isnull or "SSRB" = 'pending')  
                                ORDER BY "SCFPId" ASC  """
                cur.execute(predictSQL, [UserId])

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
                        sql = """UPDATE screwcompressorfutureprediction 
                                 SET "SSRB" = %s 
                                 WHERE "UserId" = %s 
                                 and "SCFPId" = %s"""
                        val = (row.Predicted, UserId, row.SCFPId)
                        cur.execute(sql, val)
                    conn.commit()
                    count = 0
                    print("Future Prediction done")
                #Step 3 Ends: Prediction for Second Stage Rotar Breakdown

                #Step 4 Starts: Prediction for Cooler Failure
                classSQL = """select * from "compressurewithclassification" 
                              where "UserId" = %s 
                              and "Classification" != 'bad' 
                              and "FailureModeType" = 'CF'
                              ORDER BY "CompClassID" ASC   """                      
                cur.execute(classSQL, [UserId])
                row_header = [x[0] for x in cur.description]
                # provide path of TrainWithClassification
                compressClassificationdata = pd.DataFrame(
                    cur.fetchall(), columns=row_header)

                predictSQL = """select * from "screwcompressorfutureprediction" 
                                where "UserId" = %s 
                                and ("CF" isnull or "CF" = 'pending')  
                                ORDER BY "SCFPId" ASC  """
                cur.execute(predictSQL, [UserId])

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
                    lr.fit(train[['TS1', 'TD1']], train['Classification'])
                    print("======================================Test Data set================================================")
                    compressTestdata["Predicted"] = lr.predict(
                        compressTestdata[['TS1', 'TD1']])
                    print(compressTestdata.head())
                    count = 0
                    for row in compressTestdata.itertuples():
                        count += 1
                        print(row.SCFPId, " ", row.Predicted, " ", count)
                        sql = """UPDATE screwcompressorfutureprediction 
                                 SET "CF" = %s 
                                 WHERE "UserId" = %s 
                                 and "SCFPId" = %s"""
                        val = (row.Predicted, UserId, row.SCFPId)
                        cur.execute(sql, val)
                    conn.commit()
                    count = 0
                    print("Future Prediction done")
                    #Step 1 Ends: Prediction for all three failure modes
                else:
                    print("Future Prediction table is empty")

                print("Process completed")
                return func.HttpResponse(f"Hello, Future Prediction. Process completed")
    elif type == "pump":
        if name == "prediction":
            classSQL = """select * from "centrifugalpumpTraindetails" where "UserId" = %s ORDER BY "CentrifugalTrainID" ASC   """                                  
            cur.execute(classSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of TrainWithClassification
            centrifugalpumpClassificationdata = pd.DataFrame(
                cur.fetchall(), columns=row_header)

            predictSQL = """select * from "centrifugalpumppredictiontable" where "UserId" = %s and ("Prediction" isnull or "Prediction" = 'pending')  
                ORDER BY "CentifugalPumpPID" ASC  """
            cur.execute(predictSQL, [UserId])

            row_header = [x[0] for x in cur.description]
            # provide path of Test Data for Prediction
            centrifugalpumpTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
            if centrifugalpumpTestdata.count().values[0] != 0:
                data = centrifugalpumpClassificationdata['Classification']
                train, test = train_test_split(
                    centrifugalpumpClassificationdata, stratify=centrifugalpumpClassificationdata['Classification'])
                print(
                    "======================================Train Data set================================================")
                train.head()
                print(train.head())
                lr = LogisticRegression(
                    random_state=0, solver='lbfgs', max_iter=10000)
                lr.fit(train[['P1', 'P2', 'Q', 'I']], train['Classification'])
                print("======================================Test Data set================================================")
                centrifugalpumpTestdata["Predicted"] = lr.predict(
                    centrifugalpumpTestdata[['P1', 'P2', 'Q', 'I']])
                print(centrifugalpumpTestdata.head())
                count = 0
                for row in centrifugalpumpTestdata.itertuples():
                    count += 1
                    print(row.CentifugalPumpPID, " ", row.Predicted, " ", count)
                    sql = """UPDATE "centrifugalpumppredictiontable" SET "Prediction" = %s WHERE "UserId" = %s and "CentifugalPumpPID" = %s"""
                    val = (row.Predicted, UserId, row.CentifugalPumpPID)
                    cur.execute(sql, val)
                conn.commit()
                count = 0
                print("Prediction done")
            else:
                print("Prediction table is empty")

            print("Process completed")
            return func.HttpResponse(f"Hello, Prediction. Process completed")
        elif  name =="futureprediction":
             classSQL = """select * from "centrifugalpumpTraindetails" where "UserId" = %s ORDER BY "CentrifugalTrainID" ASC   """                                  
             cur.execute(classSQL, [UserId])

             row_header = [x[0] for x in cur.description]
             # provide path of TrainWithClassification
             centrifugalpumpClassificationdata = pd.DataFrame(
                 cur.fetchall(), columns=row_header)

             predictSQL = """select * from "centrifugalpumpfuturepredictiontable" where "UserId" = %s and ("FuturePrediction" isnull or "FuturePrediction" = 'pending')  
                 ORDER BY "CentifugalPumpFID" ASC  """
             cur.execute(predictSQL, [UserId])

             row_header = [x[0] for x in cur.description]
             # provide path of Test Data for Prediction
             centrifugalpumpTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)
             if centrifugalpumpTestdata.count().values[0] != 0:
                 data = centrifugalpumpClassificationdata['Classification']
                 train, test = train_test_split(
                     centrifugalpumpClassificationdata, stratify=centrifugalpumpClassificationdata['Classification'])
                 print(
                     "======================================Train Data set================================================")
                 train.head()
                 print(train.head())
                 lr = LogisticRegression(
                     random_state=0, solver='lbfgs', max_iter=10000)
                 lr.fit(train[['P1', 'P2', 'Q', 'I']], train['Classification'])
                 print("======================================Test Data set================================================")
                 centrifugalpumpTestdata["Predicted"] = lr.predict(
                     centrifugalpumpTestdata[['P1', 'P2', 'Q', 'I']])
                 print(centrifugalpumpTestdata.head())
                 count = 0
                 for row in centrifugalpumpTestdata.itertuples():
                     count += 1
                     print(row.CentifugalPumpFID, " ", row.Predicted, " ", count)
                     sql = """UPDATE "centrifugalpumpfuturepredictiontable" SET "FuturePrediction" = %s WHERE "UserId" = %s and "CentifugalPumpFID" = %s"""
                     val = (row.Predicted, UserId, row.CentifugalPumpFID)
                     cur.execute(sql, val)
                 conn.commit()
                 count = 0
                 print("Prediction done")
             else:
                 print("Prediction table is empty")

             print("Process completed")
             return func.HttpResponse(f"Hello, Prediction. Process completed")

    else :
         return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request "
            "body for a personalized response.",
            status_code=200
        )   

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="DPM_TestingDB",
    user="postgres",
    password="admin123")

cur = conn.cursor()
cur.execute('select * from compressurewithclassification ORDER BY "CompClassID" ASC  ')
row_header = [x[0] for x in cur.description]
compressClassificationdata = pd.DataFrame(cur.fetchall(), columns=row_header) # provide path of TrainWithClassification

cur.execute('select * from screwcompressorpredictiontable ORDER BY "PredictionId" ASC  ')
row_header = [x[0] for x in cur.description]
compressTestdata = pd.DataFrame(cur.fetchall(), columns=row_header)  # provide path of Test Data for Prediction
compressTestdataTemp = compressTestdata
train, test = train_test_split(compressClassificationdata, stratify=compressClassificationdata['Classification'])
print("======================================Train Data set================================================")
train.head()
print(train.head())
lr = LogisticRegression(random_state=0, solver='lbfgs', max_iter=1000)
lr.fit(train[['PS1', 'PD1', 'PS2', 'PD2', 'TS1', 'TD1', 'TS2', 'TD2']], train['Classification'])
print("======================================Test Data set================================================")
compressTestdata["Predicted"] = lr.predict(compressTestdata[['PS1', 'PD1', 'PS2', 'PD2', 'TS1', 'TD1', 'TS2', 'TD2']])
print(compressTestdata.head())
for row in compressTestdata.itertuples():
    sql = """UPDATE screwcompressorpredictiontable SET "Prediction" = %s WHERE "PredictionId" = %s"""
    val = (row.Predicted, row.PredictionId)
    cur.execute(sql, val)
    conn.commit()

print("Done")
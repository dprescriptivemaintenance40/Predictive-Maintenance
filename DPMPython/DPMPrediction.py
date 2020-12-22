import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

df = pd.read_csv('E:\\ShivSirProject\\Files\\Train_.csv') # provide path of TrainWithClassification
Testdf = pd.read_csv('E:\\ShivSirProject\\Files\\Train_Test_4_col.csv') # provide path of Test Data for Prediction
train, test = train_test_split(df, stratify=df['CLASSIFICATION'])
print("======================================Train Data set================================================")
train.head()
print(train.head())
lr = LogisticRegression(random_state=0, solver='lbfgs', max_iter=1000)
lr.fit(train[['PS1', 'PD1', 'PS2', 'PD2', 'TS1', 'TD1', 'TS2', 'TD2']], train['CLASSIFICATION'])
print("======================================Test Data set================================================")
Testdf["Predicted"] = lr.predict(Testdf[['PS1', 'PD1', 'PS2', 'PD2', 'TS1', 'TD1', 'TS2', 'TD2']])
print(Testdf.head())
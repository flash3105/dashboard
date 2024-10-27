import pandas as pd
from google.cloud import bigquery
import mysql.connector
from mysql.connector import errorcode
# from CSVColumnRenamer import CSVColumnRenamer 
from database import Database
from datetime import datetime

# Fetch data from Mlab then store it locally
def fetch_and_process_data():
    client = bigquery.Client("measurement-lab")
    startTime = datetime.now()
    query = """ 
    SELECT
        *
    FROM 
        `npip-223.npip2.ndt7` 
    """
    query_job = client.query(query)
    df = query_job.to_dataframe() 
    return df

# Function to insert data into the MySQL database
def insert_data_to_database(df):
    db = Database("127.0.0.1","root","password","mlab_data")
    db.create_database_and_table(df)
    db.insert_data(df)

# Main execution
if __name__ == "__main__":
    df_finale = fetch_and_process_data()
    insert_data_to_database(df_finale)

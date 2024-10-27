from sqlalchemy import create_engine
import pandas as pd
import mysql.connector
from mysql.connector import errorcode
import numpy as np
from datetime import datetime


class Database:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}/{database}")
        self.connection = self.engine.connect()

    def create_database_and_table(self, df):       
        try:
            cnx = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password
            )
            cursor = cnx.cursor() 
            cursor.execute("CREATE DATABASE IF NOT EXISTS {};".format(self.database))
            cursor.execute("USE {};".format(self.database))
            # Get the column names from the DataFrame
            columns = df.columns
            # Generate SQL to create table based on DataFrame columns
            create_table_query = "CREATE TABLE IF NOT EXISTS ndt7 (\n"
            for col in columns:
                create_table_query += f"`{col}` VARCHAR(255),\n"  # Default to VARCHAR(255) for simplicity
            create_table_query = create_table_query.rstrip(",\n")  # Remove trailing comma
            create_table_query += "\n);"
            cursor.execute(create_table_query)
            cnx.commit()

        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)
        finally:
            cursor.close()
            cnx.close()
            
    def insertUserData(self,insert_query,params ):
        
        try:
            cnx = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            cursor = cnx.cursor()
            cursor.execute(insert_query, params)
            cnx.commit()
            
            
            
        except mysql.connector.Error as err:
            print("Error: {}".format(err))
        finally:
            cursor.close()
            cnx.close()
        

    def insert_data(self, df):
        try:
            cnx = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            cursor = cnx.cursor()


            columns = df.columns
            insert_query = f"""
            INSERT INTO ndt7 ({', '.join(columns)})
            VALUES ({', '.join(['%s'] * len(columns))})
            """

            # Insert rows that do not have any null values
            for index, row in df.iterrows():
                # Filter out rows with any NaN or None values
                if not row.isnull().any() and not any(val is None for val in row):
                    cursor.execute(insert_query, tuple(row))

            cnx.commit()

        except mysql.connector.Error as err:
            print("Error: {}".format(err))
        finally:
            cursor.close()
            cnx.close()

    def retrieve_data(self, query, params=None):
        try:
            
            if params:
                result = pd.read_sql(query, self.connection, params=params)
            else:
                result = pd.read_sql(query, self.connection)
            
            return result
        except Exception as e:
            print(f"An error occurred: {e}")
            return pd.DataFrame()  # Return an empty DataFrame if there's an error

    def close_connection(self):
        self.connection.close()


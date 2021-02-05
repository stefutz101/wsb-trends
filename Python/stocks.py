import config
import csv
import mysql.connector

cnx = mysql.connector.connect(user=config.DB_USER, password=config.DB_PASS,
                              host=config.DB_HOST,
                              database=config.DB_NAME)
cursor = cnx.cursor()

add_stock = ("INSERT INTO stocks "
              "(name, symbol, exchange, is_etf) "
              "VALUES (%(name)s, %(symbol)s, %(exchange)s, %(is_etf)s)")

with open('stocks.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        # Insert salary information
        stock = {
            'name': row['Name'],
            'symbol': row['Symbol'],
            'exchange': row['Last Sale'],
            'is_etf': 0,
        }
        cursor.execute(add_stock, stock)

cnx.commit()

cursor.close()
cnx.close()
from psaw import PushshiftAPI
import config
import datetime
import mysql.connector

cnx = mysql.connector.connect(user=config.DB_USER, password=config.DB_PASS,
                              host=config.DB_HOST,
                              database=config.DB_NAME)
cursor = cnx.cursor()

cursor.execute("""
    SELECT * FROM stocks
""")
rows = cursor.fetchall()

stocks = {}
for row in rows: 
    stocks['$' + row[2]] = row[0]

presence = {}


api = PushshiftAPI()

start_time = int(datetime.datetime(2021, 1, 30).timestamp())

submissions = api.search_submissions(after=start_time,
                                     subreddit='wallstreetbets',
                                     filter=['url', 'author', 'title', 'subreddit'])
                                     

for submission in submissions:
    words = submission.title.split()
    cashtags = list(set(filter(lambda word: word.lower().startswith('$'), words)))

    if len(cashtags) > 0:
        # print(cashtags)
        # print(submission.title)

        for cashtag in cashtags:
            if cashtag in stocks:
                #submitted_time = datetime.datetime.fromtimestamp(submission.created_utc).isoformat()

                a = False
                if a:
                    try:
                        cursor.execute("""
                            INSERT INTO mentions (submitted_time, stock_id, message, source, url)
                            VALUES (%s, %s, %s, 'wallstreetbets', %s)
                        """, (submitted_time, stocks[cashtag], submission.title, submission.url))

                        cnx.commit()
                    except Exception as e:
                        print(e)
                        cnx.rollback()
                else: 
                    print(cashtag)
                    if cashtag in presence:
                        presence[cashtag] = presence[cashtag] + 1
                    else:
                        presence[cashtag] = 1


print(presence)

cursor.close()
cnx.close()
            
import praw
from data import *
import time
import pandas as pd
import matplotlib.pyplot as plt
import squarify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import config
import mysql.connector
nltk.download('vader_lexicon')

reddit = praw.Reddit(
    user_agent="Comment Extraction",
    client_id="qwGA2WkSA9pRyQ",
    client_secret="joYl7_cCOwE2ezzmHIt55wOuKCYZCQ"
)

cnx = mysql.connector.connect(user=config.DB_USER, password=config.DB_PASS,
                              host=config.DB_HOST,
                              database=config.DB_NAME)
cursor = cnx.cursor()

# cleaning database
cursor.execute("""
        DELETE FROM results
    """)
cnx.commit()

'''############################################################################'''
# set the program parameters
subs = {'wallstreetbets', 'stocks'}
#subs = ['wallstreetbets', 'stocks', 'investing', 'stockmarket']     # sub-reddit to search
#post_flairs = {'Daily Discussion', 'Weekend Discussion', 'Discussion'}    # posts flairs to search || None flair is automatically considered
post_flairs = {'Daily Discussion'} 
goodAuth = {'AutoModerator'}   # authors whom comments are allowed more than once
uniqueCmt = True                # allow one comment per author per symbol
ignoreAuthP = {'example'}       # authors to ignore for posts 
ignoreAuthC = {'example'}       # authors to ignore for comment 
upvoteRatio = 0.70         # upvote ratio for post to be considered, 0.70 = 70%
ups = 20       # define # of upvotes, post is considered if upvotes exceed this #
limit = 10      # define the limit, comments 'replace more' limit
upvotes = 2     # define # of upvotes, comment is considered if upvotes exceed this #
picks = 10     # define # of picks here, prints as "Top ## picks are:"
picks_ayz = 10   # define # of picks for sentiment analysis
'''############################################################################'''

posts, count, c_analyzed, tickers, titles, a_comments = 0, 0, 0, {}, [], {}
cmt_auth = {}

# start_time = time.time()
for sub in subs:
    subreddit = reddit.subreddit(sub)
    hot_python = subreddit.hot()    # sorting posts by hot
    # Extracting comments, symbols from subreddit
    for submission in hot_python:
        
        flair = submission.link_flair_text 
        
        try: author = submission.author.name
        except: pass
        
        # checking: post upvote ratio # of upvotes, post flair, and author 
        if submission.upvote_ratio >= upvoteRatio and submission.ups > ups and (flair in post_flairs or flair is None) and author not in ignoreAuthP:   
            submission.comment_sort = 'new'     
            comments = submission.comments
            titles.append(submission.title)
            posts += 1
            submission.comments.replace_more(limit=limit)   
            for comment in comments:
                # try except for deleted account?
                try: auth = comment.author.name
                except: pass
                c_analyzed += 1
                
                # checking: comment upvotes and author
                if comment.score > upvotes and auth not in ignoreAuthC:      
                    split = comment.body.split(" ")
                    for word in split:
                        word = word.replace("$", "")        
                        # upper = ticker, length of ticker <= 5, excluded words,                     
                        if word.isupper() and len(word) <= 5 and word not in blacklist and word in us:
                            
                            # unique comments, try/except for key errors
                            if uniqueCmt and auth not in goodAuth:
                                try: 
                                    if auth in cmt_auth[word]: break
                                except: pass
                                
                            # counting tickers
                            if word in tickers:
                                tickers[word] += 1
                                a_comments[word].append(comment.body)
                                cmt_auth[word].append(auth)
                                count += 1
                            else:                               
                                tickers[word] = 1
                                cmt_auth[word] = [auth]
                                a_comments[word] = [comment.body]
                                count += 1    
    stocks_per_subs = dict(sorted(tickers.items(), key=lambda item: item[1], reverse = True)) #nume stock si valoarea sa
    top_picks_per_subs = list(stocks_per_subs.keys())[0:picks] #doar nume stocks
    print("Stocks for subreddit: " + sub + "\n")

    for i in stocks_per_subs:
        print(i, ' : ', stocks_per_subs[i])

# sorts the dictionary
symbols = dict(sorted(tickers.items(), key=lambda item: item[1], reverse = True))
top_picks = list(symbols.keys())[0:picks]

# print top picks
# time = (time.time() - start_time)
# print("It took {t:.2f} seconds to analyze {c} comments in {p} posts in {s} subreddits.\n".format(t=time, c=c_analyzed, p=posts, s=len(subs)))
# print("Posts analyzed saved in titles")
#for i in titles: print(i)  # prints the title of the posts analyzed

# print(f"\n{picks} most mentioned picks: ")

# times = []
# top = []
for i in top_picks:

    cursor.execute("""
        INSERT INTO results (stock, mentions)
        VALUES (%s, %s)
    """, (i, symbols[i]))

    cnx.commit()


    # print(f"{i}: {symbols[i]}")

    # times.append(symbols[i])
    # top.append(f"{i}: {symbols[i]}")
   
    
# Applying Sentiment Analysis
scores, s = {}, {}
vader = SentimentIntensityAnalyzer()
# adding custom words from data.py 
vader.lexicon.update(new_words)

picks_sentiment = list(symbols.keys())[0:picks_ayz]
for symbol in picks_sentiment:
    stock_comments = a_comments[symbol]
    for cmnt in stock_comments:
        score = vader.polarity_scores(cmnt)
        if symbol in s:
            s[symbol][cmnt] = score
        else:
            s[symbol] = {cmnt:score}      
        if symbol in scores:
            for key, _ in score.items():
                scores[symbol][key] += score[key]
        else:
            scores[symbol] = score
            
    # calculating avg.
    for key in score:
        scores[symbol][key] = scores[symbol][key] / symbols[symbol]
        scores[symbol][key]  = "{pol:.3f}".format(pol=scores[symbol][key])


#Print values from scores
for stock, value in scores.items():
#    print(stock, '--')

    cursor.execute("""
        UPDATE results SET bearish=%s, neutral=%s, bullish=%s, total=%s WHERE stock=%s
    """, (value['neg'], value['neu'], value['pos'], value['compound'], stock))

    cnx.commit()

#    for key, score in value.items():
#        print(key, ' : ', score)

cursor.close()
cnx.close()

#printing sentiment analysis 
#print(f"\nSentiment analysis of top {picks_ayz} picks:")
#df = pd.DataFrame(scores)
#df.index = ['Bearish', 'Neutral', 'Bullish', 'Total/Compound']
#df = df.T
#print(df)

# Date Visualization
# most mentioned picks    
# squarify.plot(sizes=times, label=top, alpha=.7 )
# plt.axis('off')
# plt.title(f"{picks} most mentioned picks")
# plt.show()

# Sentiment analysis
# df = df.astype(float)
# colors = ['red', 'springgreen', 'forestgreen', 'coral']
# df.plot(kind = 'bar', color=colors, title=f"Sentiment analysis of top {picks_ayz} picks:")
# plt.show()

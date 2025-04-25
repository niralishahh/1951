from flask import Flask, jsonify, request
import pandas as pd
from datetime import datetime
from datetime import date
from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv
from flask_cors import CORS
from bson.json_util import dumps
import json

# from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

load_dotenv()
CONNECTION_STRING = os.getenv("CONNECTION_STRING")

client = MongoClient(CONNECTION_STRING, 
                     ssl=True, tlsCAFile=certifi.where(), tls = True, tlsAllowInvalidCertificates=True)
#https://www.geeksforgeeks.org/pymongoarrow-export-and-import-mongodb-data-to-pandas-dataframe-and-numpy/
warnings = [] # list of ingredients we need to warn about, maybe timestamps for reminders
warningTimeStamps = {} # possibly store previous order times as dict, Ingred: Time
db = client['1951Data']
# db = client['1951Data']
# print(db.list_collection_names())

# whenever its a new day carry this out probably useMemo with date or sth to avoid rerunning
# store previous day vs current time? d
def dailyWarningCheck():
    warnings = [] # reset from old ingredient warnings
    # gather data each time
    inventory_col = list(db.inventory.find())
    #print('got here')
    # # maybe store timestamps for 
    # warningTimeStamps = {}
    # # handling school or break times? boolean input for avg?
    # schoolOrBreak = inventory_col[5] # maybe but idk
        # prevWeeklyOrder = inventory_col[-1].order
        # avgDailyUsage = df.iloc[1].mean()/7 # need to track days since the order... just day 5 ig
        # orderDate = inventory_col[-1]
        # daysOrderLasts = prevWeeklyOrder#/avgDailyUsage
        # check 1) 5 days since last order 2) 
    for item in inventory_col:
        #print('got here')
        currItemString = f"{item['ingredient']} {item['category']}"
        field_names = list(item.keys())
        target_fields = field_names[4:]
        # order history?
        # might be item[tf][0] soon if db change
        orderHistory = [item[tf] for tf in target_fields]
        avgOrder = sum(orderHistory)/len(orderHistory)
        mostRecentOrderDate = field_names[-1]
        #actualDate = datetime.strptime(mostRecentOrderDate, "%m%d%Y")
        #currTime = datetime.today()
        daysOrderLasts = 0
        if avgOrder > 0:
            daysOrderLasts = item[field_names[-1]]/avgOrder * 7 # compare current order to average since average should last 7 days
        currTimeVsOrderDate = (datetime.today() - datetime.strptime(mostRecentOrderDate, "%m%d%Y")).days
            # for reference: print(datetime.strptime("02282025", "%m%d%Y")) # gives 2025-02-28
        #if (datetime.date.today() > orderDate + 5 or datetime.date.today() > orderDate + daysOrderLasts):
        if (currTimeVsOrderDate > daysOrderLasts or currTimeVsOrderDate >= 5):
            warnings.append(currItemString)
    combinedWarningString = "Reminder to order "
    abridgedWarningString = f"Reminder to order {warnings[0]}...since it's been {currTimeVsOrderDate} days!"
    for x in warnings:
        combinedWarningString += (x + ", ")
    combinedWarningString += " since it's been " + str(currTimeVsOrderDate) + " days!"
    warnings = [combinedWarningString, abridgedWarningString]
    # need to push this to db
    x = db.warnings.insert_one({
        'timestamp': datetime.now(),
        'warnings': warnings,
    })

#dailyWarningCheck()

def parse_json(data):
    return json.loads(dumps(data))

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        # dailyWarningCheck()
        # Get all notifications sorted by newest first
        notifications = list(db.warnings.find().sort('timestamp', -1))
        #print("got here")
        #print(notifications)
        return jsonify(parse_json(notifications))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/updatenotifications', methods=['GET'])
def update_and_get_notifications():
    try:
        # update the notifications with dWC
        dailyWarningCheck() 
        # Get all notifications sorted by newest first
        notifications = list(db.warnings.find().sort('timestamp', -1))
        return jsonify(parse_json(notifications))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)

# @app.route('/api/notifications', methods=['GET'])
# def get_notifications():
#     """API endpoint to get notifications"""
#     dailyWarningCheck()
#     return warnings

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
# below is likely unnecessary unless it keeps spamming warning after closing --> get msg to remove from array
# def resolveWarning(warningString):
#     # probably do in react also?
#     warning = warningString.split()[3]
#     clicked = false
#     if (clicked):
#         yes = confirmation()
#         if (yes):
#             warnings.remove(warning)



# # reminder alerts
#     # store the reminders, reminders should track time + ingredient + amount to get
#     # 1 reminder per ingredient so make ingredient key?
# reminders = {}  
# # this is where time tracking needed if at all

# ''' Below fxn should execute reminder alerts when needed'''
# def fireReminderAlerts():
#     for x in reminders:
#         if (hit time like 8:00 Monday 1 week after set):
#             doThing()

#     # timer --> every time fire off reminders

# '''Below fxn is for when button clicked to edit reminders'''
# def editReminders(reminderName):
#     currReminder = reminders[reminderName]

# def addReminder(reminderName):
#     stuff()

# def removeReminder(reminderName):
#     confirmation()
#     stuff()
import pandas as pd
import datetime
import json
import pymongoarrow as pma
#https://www.geeksforgeeks.org/pymongoarrow-export-and-import-mongodb-data-to-pandas-dataframe-and-numpy/

# warning alerts
warnings = [] # list of ingredients we need to warn about, maybe timestamps for reminders
ingredientData = {} # possibly store previous order times?

def readData(schoolWkOrBreakWk, data):
    warnings = [] # reset from old ingredient warnings
    dFrame = pd.dataframe(data)
    ingredientData = json/{} (could be dataFrame)
    for row in data: # or pandas methods
        # handling school or break times? boolean input for avg?
        ingredientData[currCategory + " " + row] = [OnHand, round(avgOnHand), round(AvgSchoolWkUsage), round(AvgBreakWkUsage)]
        # check if onHand < 0.25 * Need & close to end of week? or Day of week/7 
        # if Day 1 of 7 --> need 6/7 of the weekly total now?
        if (onHand < 0.25*avgUsage or onHand < 0.25*avgOnHand):
            warnings.append("ingredient")

def displayWarning(warningString):
    # take in warnings and upgrade each entry to string
    for x in warnings:
        currIngredient = warnings.remove(x)
        # use f string to format the warning string   
        warnings.append(f"Reminder to order {currIngredient} since it's been {ingredientData[currIngredient]} weeks!")
    # sends to frontend

def resolveWarning(warningString):
    # probably do in react also?
    warning = warningString.split()[3]
    clicked = false
    if (clicked):
        yes = confirmation()
        if (yes):
            warnings.remove(warning)

# reminder alerts
    # store the reminders, reminders should track time + ingredient + amount to get
    # 1 reminder per ingredient so make ingredient key?
reminders = {}  
# this is where time tracking needed if at all

''' Below fxn should execute reminder alerts when needed'''
def fireReminderAlerts():
    for x in reminders:
        if (hit time like 8:00 Monday 1 week after set):
            doThing()

    # timer --> every time fire off reminders

'''Below fxn is for when button clicked to edit reminders'''
def editReminders(reminderName):
    currReminder = reminders[reminderName]

def addReminder(reminderName):
    stuff()

def removeReminder(reminderName):
    confirmation()
    stuff()
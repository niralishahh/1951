import matplotlib.pyplot as plt
from matplotlib.widgets import CheckButtons
from pymongo import MongoClient
import matplotlib.animation as animation
import numpy as np
import matplotlib
from datetime import datetime
matplotlib.use('TkAgg')

# ✅ Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["cafe_prices"]

dates = ["01172025", "01242025", "01312025", "02072025", "02142025", "02212025", "02282025", "03072025", "03142025"]
readable_dates = [datetime.strptime(d, "%m%d%Y").strftime("%Y-%m-%d") for d in dates]
time_points = list(range(9))  # 0 ~ 8

db.milk_quantities.delete_many({})
milk_prices_sample = [
    {"ingredient": "Whole Milk", "dates": dates, "prices": [3.5, 3.7, 3.6, 3.9, 4.0, 3.8, 4.1, 4.2, 4.0]},
    {"ingredient": "Non-fat Milk", "dates": dates, "prices": [4.2, 4.1, 3.9, 4.0, 3.8, 3.7, 3.9, 3.6, 3.8]},
    {"ingredient": "Half/half Milk", "dates": dates, "prices": [4.5, 4.4, 4.6, 4.7, 4.6, 4.5, 4.7, 4.6, 4.5]}
]
db.milk_quantities.insert_many(milk_prices_sample)

db.nonDairy_quantities.delete_many({})
nonDairy_prices_sample = [
    {"ingredient": "Oatly", "dates": dates, "prices": [5.0, 5.1, 5.0, 5.2, 5.1, 5.0, 5.2, 5.1, 5.0]},
    {"ingredient": "Califia Almond", "dates": dates, "prices": [4.8, 4.9, 4.8, 5.0, 4.9, 4.8, 5.0, 4.9, 4.8]}
]
db.nonDairy_quantities.insert_many(nonDairy_prices_sample)

db.hotCups_quantities.delete_many({})
hotCups_prices_sample = [
    {"ingredient": "World Centric 4oz", "dates": dates, "prices": [0.08, 0.09, 0.08, 0.1, 0.09, 0.08, 0.1, 0.09, 0.08]},
    {"ingredient": "World Centric 8oz CUP", "dates": dates, "prices": [0.10, 0.11, 0.10, 0.12, 0.11, 0.10, 0.12, 0.11, 0.10]},
    {"ingredient": "World Centric 8oz LID", "dates": dates, "prices": [0.05, 0.06, 0.05, 0.07, 0.06, 0.05, 0.07, 0.06, 0.05]},
    {"ingredient": "World Centric 12oz CUP", "dates": dates, "prices": [0.11, 0.12, 0.11, 0.13, 0.12, 0.11, 0.13, 0.12, 0.11]},
    {"ingredient": "World Centric 16oz CUP", "dates": dates, "prices": [0.13, 0.14, 0.13, 0.15, 0.14, 0.13, 0.15, 0.14, 0.13]},
    {"ingredient": "World Centric 12/16oz LID", "dates": dates, "prices": [0.06, 0.07, 0.06, 0.08, 0.07, 0.06, 0.08, 0.07, 0.06]}
]
db.hotCups_quantities.insert_many(hotCups_prices_sample)

db.coldCups_quantities.delete_many({})
coldCups_prices_sample = [
    {"ingredient": "Clear Compostable 9oz w/ Flat LID", "dates": dates, "prices": [0.09, 0.10, 0.09, 0.11, 0.10, 0.09, 0.11, 0.10, 0.09]},
    {"ingredient": "Clear Compostable 16oz CUP", "dates": dates, "prices": [0.12, 0.13, 0.12, 0.14, 0.13, 0.12, 0.14, 0.13, 0.12]},
    {"ingredient": "Clear Compostable 16oz LID", "dates": dates, "prices": [0.07, 0.08, 0.07, 0.09, 0.08, 0.07, 0.09, 0.08, 0.07]}
]
db.coldCups_quantities.insert_many(coldCups_prices_sample)

db.paperGoods_quantities.delete_many({})
paperGoods_prices_sample = [
    {"ingredient": "World Centric Napkins 9x9", "dates": dates, "prices": [0.01, 0.01, 0.01, 0.02, 0.01, 0.01, 0.02, 0.01, 0.01]},
    {"ingredient": "Kraft Hot Cup Sleeves", "dates": dates, "prices": [0.05, 0.05, 0.05, 0.06, 0.05, 0.05, 0.06, 0.05, 0.05]}
]
db.paperGoods_quantities.insert_many(paperGoods_prices_sample)

db.syrups_quantities.delete_many({})
syrups_prices_sample = [
    {"ingredient": "Torani Vanilla", "dates": dates, "prices": [5.0, 5.3, 5.1, 5.4, 5.2, 5.5, 5.3, 5.6, 5.4]},
    {"ingredient": "Torani Lavender - Amazon", "dates": dates, "prices": [4.6, 4.9, 4.8, 5.0, 4.9, 5.1, 5.0, 5.2, 5.1]},
    {"ingredient": "Honey 5lb bottle", "dates": dates, "prices": [15.0, 15.5, 15.3, 15.7, 15.5, 15.8, 15.6, 16.0, 15.8]}
]
db.syrups_quantities.insert_many(syrups_prices_sample)

db.ingredients_quantities.delete_many({})
ingredients_prices_sample = [
    {"ingredient": "Raw Sugar Packets", "dates": dates, "prices": [2.0, 2.1, 2.0, 2.2, 2.1, 2.0, 2.2, 2.1, 2.0]},
    {"ingredient": "Lemon Juice gallons", "dates": dates, "prices": [6.0, 6.2, 6.1, 6.3, 6.2, 6.1, 6.4, 6.3, 6.2]}
]
db.ingredients_quantities.insert_many(ingredients_prices_sample)

db.cleaningSupplies_quantities.delete_many({})
cleaningSupplies_prices_sample = [
    {"ingredient": "Dish Soap - Amazon", "dates": dates, "prices": [3.5, 3.6, 3.5, 3.7, 3.6, 3.5, 3.8, 3.7, 3.6]},
    {"ingredient": "Gloves (food handling)", "dates": dates, "prices": [0.12, 0.13, 0.12, 0.14, 0.13, 0.12, 0.14, 0.13, 0.12]}
]
db.cleaningSupplies_quantities.insert_many(cleaningSupplies_prices_sample)

db.bottledDrinks_quantities.delete_many({})
bottledDrinks_prices_sample = [
    {"ingredient": "Topo Chico Mineral Water", "dates": dates, "prices": [2.0, 2.1, 2.0, 2.2, 2.1, 2.0, 2.2, 2.1, 2.0]},
    {"ingredient": "Crystal Geyser Bottled Water", "dates": dates, "prices": [1.0, 1.1, 1.0, 1.2, 1.1, 1.0, 1.2, 1.1, 1.0]}
]
db.bottledDrinks_quantities.insert_many(bottledDrinks_prices_sample)

db.other_quantities.delete_many({})
other_prices_sample = [
    {"ingredient": "Oatmeal - MYLK Labs", "dates": dates, "prices": [4.0, 4.1, 4.0, 4.2, 4.1, 4.0, 4.3, 4.2, 4.1]},
    {"ingredient": "Tea - Blue Willow", "dates": dates, "prices": [3.0, 3.1, 3.0, 3.2, 3.1, 3.0, 3.3, 3.2, 3.1]}
]
db.other_quantities.insert_many(other_prices_sample)


# ✅ Define your 10 category collections
category_collections = [
    "milk_quantities", "nonDairy_quantities", "hotCups_quantities",
    "coldCups_quantities", "paperGoods_quantities", "syrups_quantities",
    "ingredients_quantities", "cleaningSupplies_quantities",
    "bottledDrinks_quantities", "other_quantities"
]
# ✅ Fetch prices from MongoDB
def fetch_prices(collection):
    ingredient_data = {}
    for doc in collection.find():
        ingredient_data[doc["ingredient"]] = doc.get("prices", [])
    return ingredient_data

# ✅ Update all prices
def update_all_prices():
    global all_prices
    all_prices = {}
    for col_name in category_collections:
        collection = db[col_name]
        all_prices[col_name] = fetch_prices(collection)

# ✅ Global variables
animation_store = []
check_buttons_store = {}

# ✅ Plotting function
def plot_ingredient_prices(prices, title, collection_key):
    fig, ax = plt.subplots()
    fig.collection_key = collection_key  # 🔥 Save real collection key

    ax.set_xlim(-0.5, 8.5)
    ax.set_xticks(time_points)
    ax.set_xticklabels(readable_dates, rotation=45, ha='right')
    ax.set_ylim(0, max((max(v) if v else 0) for v in prices.values()) + 1)
    ax.set_xlabel("Date (YYYY-MM-DD)")
    ax.set_ylabel("Price ($)")
    ax.set_title(title)

    lines = {}
    for ingredient, price_list in prices.items():
        if len(price_list) == len(time_points):
            lines[ingredient], = ax.plot(time_points, price_list, label=ingredient, linestyle="-", marker="")

    # ✅ Ensure all lines are visible at start
    for line in lines.values():
        line.set_visible(True)

    # ✅ Annotation for hover
    annotation = ax.annotate("", xy=(0, 0), xytext=(10, 10), textcoords="offset points",
                             bbox=dict(boxstyle="round", fc="w"),
                             arrowprops=dict(arrowstyle="->"))
    annotation.set_visible(False)

    # ✅ Legend
    legend = ax.legend()
    for legend_line in legend.get_lines():
        legend_line.set_picker(True)

    # ✅ CheckButtons
    rax = plt.axes([0.7, 0.45, 0.15, 0.3], facecolor='lightgray')
    check = CheckButtons(rax, list(prices.keys()), [True] * len(prices))
    check_buttons_store[title] = check

    def toggle_checkbox(label):
        visible = not lines[label].get_visible()
        lines[label].set_visible(visible)
        plt.draw()

    check.on_clicked(toggle_checkbox)

    # ✅ Draggable checkbox panel
    dragging = {"active": False, "offset_x": 0, "offset_y": 0}

    def on_press(event):
        if event.inaxes == rax:
            dragging["active"] = True
            dragging["offset_x"] = event.x - rax.bbox.x0
            dragging["offset_y"] = event.y - rax.bbox.y0

    def on_release(event):
        dragging["active"] = False

    def on_motion(event):
        if dragging["active"]:
            new_x = event.x - dragging["offset_x"]
            new_y = event.y - dragging["offset_y"]
            rax.set_position([new_x / fig.bbox.width, new_y / fig.bbox.height, 0.15, 0.3])
            fig.canvas.draw()

    fig.canvas.mpl_connect("button_press_event", on_press)
    fig.canvas.mpl_connect("button_release_event", on_release)
    fig.canvas.mpl_connect("motion_notify_event", on_motion)

    # ✅ Clickable legend
    def on_legend_click(event):
        for text, line in zip(legend.get_texts(), lines.values()):
            if text.contains(event)[0]:
                label = text.get_text()
                visible = not lines[label].get_visible()
                lines[label].set_visible(visible)
                text.set_alpha(1.0 if visible else 0.4)
                plt.draw()

    fig.canvas.mpl_connect("pick_event", on_legend_click)

    # ✅ Hover for showing coordinates
    def hover(event):
        if event.inaxes != ax or event.xdata is None:
            annotation.set_visible(False)
            fig.canvas.draw_idle()
            return

        closest_line = None
        min_dist = float("inf")

        for line in lines.values():
            if not line.get_visible():
                continue

            x_data, y_data = line.get_xdata(), line.get_ydata()
            if len(x_data) == 0:
                continue
            y_interp = np.interp(event.xdata, x_data, y_data)
            dist = abs(y_interp - event.ydata)

            if dist < min_dist:
                min_dist = dist
                closest_line = line
                closest_x = event.xdata
                closest_y = y_interp

        if closest_line and min_dist < 0.3:
            annotation.xy = (closest_x, closest_y)
            annotation.set_text(f"({closest_x:.2f}, {closest_y:.2f})")
            annotation.set_visible(True)
        else:
            annotation.set_visible(False)

        fig.canvas.draw_idle()

    fig.canvas.mpl_connect("motion_notify_event", hover)

    # ✅ Animation
    def animate(frame):
        update_all_prices()
        source = all_prices.get(fig.collection_key, {})
        for ingredient, line in lines.items():
            if ingredient in source:
                line.set_ydata(source[ingredient])
        plt.draw()

    ani = animation.FuncAnimation(fig, animate, interval=5000)
    animation_store.append(ani)

    return fig

# ✅ Initial load
update_all_prices()

# ✅ Create plots
figures = []
for collection_name in category_collections:
    readable_name = collection_name.replace("_quantities", "").title()
    prices = all_prices[collection_name]
    if prices:
        fig = plot_ingredient_prices(prices, f"{readable_name} Prices Over Time", collection_name)
        figures.append(fig)

plt.show()
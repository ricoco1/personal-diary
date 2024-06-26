import os
from os.path import join, dirname
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/diary', methods=['GET'])
def show_diary():
    articles = list(db.diary.find({},{'_id':False}))
    return jsonify({'articles': articles})

@app.route('/diary', methods=['POST'])
def save_diary():
    title_receive = request.form["title_give"]
    content_receive = request.form["content_give"]

    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

    file = request.files['file_give']
    extension = file.filename.split('.')[-1]
    filename = f'file-{mytime}.{extension}'
    save_to = f'static/uploads/images/{filename}'
    file.save(save_to)

    profile = request.files.get('profile_give')
    if profile:  
        extension = profile.filename.split('.')[-1]
        profilename = f'file-{mytime}.{extension}'
        save_profile = f'static/uploads/profile/{profilename}'
        profile.save(save_profile)
    else: 
        profilename = 'default_profile.jpg'

    time = today.strftime('%Y.%m.%d.%H.%M.%S')

    doc = {
        'file': filename,
        'profile': profilename,
        'title': title_receive,
        'content': content_receive,
        'created_at': time
    }
    db.diary.insert_one(doc)


    return jsonify({'msg':'Upload complete!'})
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
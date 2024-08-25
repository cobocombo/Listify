from flask import Flask, send_from_directory
import os

app = Flask(__name__, 
            static_folder='../Frontend',
            static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
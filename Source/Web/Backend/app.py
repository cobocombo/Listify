from flask import Flask, render_template
import os

app = Flask(__name__, 
            static_folder='../Frontend',
            static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def page_not_found(e):
    return app.send_static_file('Pages/404.html')

if __name__ == '__main__':
    app.run(debug=True)
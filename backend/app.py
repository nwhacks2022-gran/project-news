from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/hello/', methods=['GET', 'POST'])
def welcome():
    return "Hello World!"

@app.route('/person/')
def hello():
    return jsonify({'name':'Gordon',
                    'address':'Canada'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
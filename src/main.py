from flask import Flask, send_from_directory, url_for, request
import json
from lib import backend_base
app = Flask(__name__, static_url_path='')
class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        elif isinstance(obj, datetime.timedelta):
            return (datetime.datetime.min + obj).time().isoformat()
        elif isinstance(obj,decimal.Decimal):
            return format(obj, '.4f')           
        else:
            return str(obj)
@app.route('/')
def serve_index():
    return send_from_directory('', 'index.html')

@app.route('/main.js')
def serve_main():
    return send_from_directory('', 'main.js')

@app.route('/resources/<path:path>')
def serve_resources(path):
    return send_from_directory('resources', path)

@app.route('/quarterback/<url>', methods=['POST'])
def yappers(url):
    if request.method == 'POST':
        return backend_post(url)

def backend_post(url):
    retval = {
        "result": False,
        "data": None,
        "msg": "",
        }
    data = back_module.getUser(1)
    retval["data"] = data
    retval["result"] = True
    return json.dumps(retval, indent=4, cls=EnhancedJSONEncoder)

if __name__ == "__main__":
    app.config['DEBUG'] = True
    back_module = backend_base.spbdt()
    app.run()

# 추천 알고리즘이나 이런거 할 때 사용
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return "python 서버가 5000포트에서 실행 중입니다"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # 포트를 5000으로 설정, 수정되면 바로 반영

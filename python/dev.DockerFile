# Python 개발 환경 설정
FROM python:3.12

# 작업 디렉토리 생성
WORKDIR /usr/python/app

# 필요한 패키지 설치
COPY requirements.txt ./
RUN pip install -r requirements.txt

# 소스 코드 복사
COPY app.py ./

# 서버 실행
CMD ["python", "app.py"]

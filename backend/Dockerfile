FROM python:3.13

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
EXPOSE 5001
CMD ["flask", "run", "--reload", "--host=0.0.0.0", "--port=5001"]
import os

import pandas as pd
from influxdb_client_3 import InfluxDBClient3


class AnalyticsService:
    def __init__(self):
        self.token = os.getenv("INFLUXDB_TOKEN")
        self.org = os.getenv("INFLUXDB_ORG")
        self.url = os.getenv("INFLUXDB_URL")
        self.database = "hetic"

    def _get_client(self):
        return InfluxDBClient3(
            host=self.url.replace('https://', '').replace('http://', ''),
            token=self.token,
            org=self.org,
            database=self.database
        )

    def get_sensor_data(self, sensor_id: int, hours: int = 1, limit: int = 1):
        client = self._get_client()
        try:
            query = f"""
            SELECT time, data_temperature, data_humidity, source_address, sensor_id, topic
            FROM "mqtt_consumer"
            WHERE
                time >= now() - interval '{hours} hour'
                AND source_address = {sensor_id}
                AND ("data_temperature" IS NOT NULL)
            ORDER BY time DESC
            LIMIT {limit}
            """

            table = client.query(query=query, language="sql")
            df = table.to_pandas()
            records = df.to_dict('records')

            formatted_records = []
            for record in records:
                formatted_record = {
                    'time': record['time'].isoformat() if pd.notnull(record.get('time')) else None,
                    'temperature': float(record['data_temperature']) if pd.notnull(record.get('data_temperature')) else None,
                    'humidity': float(record['data_humidity']) if pd.notnull(record.get('data_humidity')) else None,
                    'source_address': str(record['source_address']) if pd.notnull(record.get('source_address')) else None,
                    'sensor_id': int(record['sensor_id']) if pd.notnull(record.get('sensor_id')) else None,
                    'topic': str(record['topic']) if pd.notnull(record.get('topic')) else None
                }
                formatted_record = {k: v for k, v in formatted_record.items() if v is not None}
                formatted_records.append(formatted_record)

            return formatted_record, None

        except Exception as e:
            return None, str(e)
        finally:
            client.close()
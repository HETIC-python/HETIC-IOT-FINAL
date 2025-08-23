import redis

def create_redis_client():
    return redis.StrictRedis(
        host="redis",
        port=6379,
        db=0,
        decode_responses=True
    )

redis_client = create_redis_client()

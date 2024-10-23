
import redis
import hashlib
import json
# Initialize Redis connection
cache = redis.StrictRedis(host='localhost', port=6379, db=0)

def generate_cache_key(params):
    """Generate a unique cache key based on the request parameters."""
    key_string = json.dumps(params, sort_keys=True)  # Sorting to ensure key uniqueness
    return hashlib.md5(key_string.encode('utf-8')).hexdigest()

def get_cached(params):
    cache_key = generate_cache_key(params)
    cached_data = cache.get(cache_key)
    if cached_data:
        return json.loads(cached_data)  # Return the cached data if available
    return None

def set_cache(params, data):
    """Cache the weather stats result in Redis."""
    cache_key = generate_cache_key(params)
    cache.set(cache_key, json.dumps(data), ex=3600)  # Cache for 1 hour

def clear_cache(params):
    """Clear the cache for a specific set of parameters."""
    cache_key = generate_cache_key(params)
    cache.delete(cache_key)


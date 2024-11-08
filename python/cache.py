
import redis
import hashlib
import json
# Initialize Redis connection
cache = redis.StrictRedis(host='localhost', port=6379, db=0)

def generate_cache_key(params):
    """Generate a unique cache key based on the request parameters."""
    key_string = json.dumps(params, sort_keys=True)  # Sorting to ensure key uniqueness
    return hashlib.md5(key_string.encode('utf-8')).hexdigest()

def get_cached(params, key=None):
    params = params.copy()  # Copy the params to avoid modifying the original dict
    # add key to params
    if key is not None:
        params['key'] = key
    """Retrieve the weather stats from the cache."""
    cache_key = generate_cache_key(params)
    #print('Retrieving cache', cache_key, params)
    cached_data = cache.get(cache_key)
    if cached_data:
        return json.loads(cached_data)  # Return the cached data if available
    return None

def set_cache(params, data, key=None):
    """Cache the weather stats result in Redis."""
    params = params.copy()  # Copy the params to avoid modifying the original dict
    # add key to params
    if key is not None:
        params['key'] = key

    cache_key = generate_cache_key(params)
    #print('Setting cache', cache_key, params)
    cache.set(cache_key, json.dumps(data), ex=3600*24*265)  # Cache for 1 year

def clear_cache(params):
    """Clear the cache for a specific set of parameters."""
    cache_key = generate_cache_key(params)
    cache.delete(cache_key)
def clear_all_cache():
    """Clear the entire cache."""
    print('Clearing cache')
    cache.flushall()

def get_cached_result(params, params_baseline):
    # Generate individual and combined cache keys
    combined_params = {**params, **params_baseline}

    # Cache keys for combined and individual params
    # Retrieve the cached data for combined key
    combined_cached_data = {
        'annual': get_cached(params, 'annual'),
        'decades': get_cached(params, 'decades'),
        'periods': get_cached(params, 'periods'),
        'raw': get_cached(params, 'raw')
    }

    # Retrieve cached data for individual params and baseline
    params_cached_data = {
        'annual': get_cached(params, 'annual'),
        'decades': get_cached(params, 'decades'),
        'periods': get_cached(params, 'periods'),
        'raw': get_cached(params, 'raw')
    }
    baseline_cached_data = get_cached(params_baseline, 'baseline')

    combined_cached_data = combined_cached_data if any(combined_cached_data.values()) else None
    params_cached_data = params_cached_data if any(params_cached_data.values()) else None
    baseline_cached_data = baseline_cached_data if baseline_cached_data else None
    return  combined_cached_data, params_cached_data, baseline_cached_data

def set_cache_result(params, params_baseline, results, baseline_stats):
    """Cache results for combined, params, and baseline."""

    # Generate combined parameters
    combined_params = {**params, **params_baseline}

    # Cache combined results
    set_cache(combined_params, results['annual'], 'annual')
    set_cache(combined_params, results['decades'], 'decades')
    set_cache(combined_params, results['periods'], 'periods')
    set_cache(combined_params, results['raw'], 'raw')

    # Cache individual params results
    set_cache(params, results['annual'], 'annual')
    set_cache(params, results['decades'], 'decades')
    set_cache(params, results['periods'], 'periods')
    set_cache(params, results['raw'], 'raw')

    # Cache baseline
    set_cache(params_baseline, baseline_stats, 'baseline')

from tqdm import tqdm
import getpass
client_id = 'dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd'
client_secret = '54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151'
username = input("Username:")
password = getpass.getpass('Password:')
token_url = 'https://kitsu.io/api/oauth/token'

from oauthlib.oauth2 import LegacyApplicationClient
from requests_oauthlib import OAuth2Session
print("Authenticating")
kitsu  = OAuth2Session(client=LegacyApplicationClient(client_id=client_id))

token = kitsu.fetch_token(token_url=token_url, client_id=client_id, client_secret=client_secret,
                      username=username, password=password)

print("Fetching users ID")
r = kitsu.get('https://kitsu.io/api/edge/users?fields[users]=id&filter[name]=' + username)
r = r.json()
userID = r['data'][0]['id']

print("Fetching followers")
follows = []
def getFollows(offset, count):
    global pbar
    r = kitsu.get("https://kitsu.io/api/edge/follows?fields[users]=name&filter[followed]=" + userID + "&include=follower&page[limit]=20&page[offset]=" + str(offset) + "&sort=-created_at")
    r = r.json()
    if count == 0:
        pbar = tqdm(total=r['meta']['count'])
    for user in r['included']:
        follows.append(user['attributes']['name'])
        count = count + 1
        pbar.update(1)
    if r['links'].get("next", False):
        offset = offset+20
        getFollows(offset, count)
    else:
        pbar.close()
getFollows(0, 0)

print("Fetching follows")
following = []
followingID = []
def getFollowing(offset, count):
    global pbar
    r = kitsu.get("https://kitsu.io/api/edge/follows?fields[users]=name&filter[follower]=" + userID + "&include=followed&page[limit]=20&page[offset]=" + str(offset) + "&sort=-created_at")
    r = r.json()
    if count == 0:
        pbar = tqdm(total=r['meta']['count'])
    i = 0
    for user in r['included']:
        following.append(user['attributes']['name'])
        followingID.append({'name': user['attributes']['name'], 'id': r['data'][i]['id']})
        count = count + 1
        i = i + 1
        pbar.update(1)
    if r['links'].get("next", False):
        offset = offset+20
        getFollowing(offset, count)
    else:
        pbar.close()
getFollowing(0, 0)

s = set(follows)
nonMutual = [x for x in following if x not in s]
print(nonMutual)
def unfollowPrompt(name):
    reply = str(input("Would you like to unfollow " + name +' (y/n): ')).lower().strip()
    if reply[0] == 'y':
        return True
    if reply[0] == 'n':
        return False
    else:
        return yes_or_no(name)
def find(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1

for name in nonMutual:
    if unfollowPrompt(name) == True:
        pos = find(followingID, 'name', name)
        r = kitsu.delete('https://kitsu.io/api/edge/follows/' + followingID[pos]['id'])
        print("Unfollowed " + name)


"""Preview exact-name channel matches against the local wiki candidate titles."""
import json
import re
import sys
from pathlib import Path
from urllib.request import urlopen

sys.stdout.reconfigure(encoding='utf-8')
base = Path(__file__).resolve().parents[1] / 'data'
root = json.loads((base / 'namu-chzzk-streamer-candidates.json').read_text(encoding='utf-8'))
sub = json.loads((base / 'namu-chzzk-subcategories.json').read_text(encoding='utf-8'))
nested = json.loads((base / 'namu-chzzk-subcategory-titles.json').read_text(encoding='utf-8'))
titles = set(root['titles'])
for category in sub['categories'] + nested['categories']:
    titles.update(category['titles'])
titles.update(title.removesuffix('(인터넷 방송인)') for title in list(titles)
              if title.endswith('(인터넷 방송인)'))
verified_path = base / 'verified-chzzk-channels.json'
verified = json.loads(verified_path.read_text(encoding='utf-8'))
known = verified['channels']
known_ids = {row['channelId'] for row in known}
known_names = {row['name'] for row in known}
focus_ids = [None, '4de764d9dad3b25602284be6db3ac647',
             '16b736abf2c4178ac682be1b44a9a26c',
             'b33c957eac9335d38e4043c3dca97675',
             '26253bf7ed6b95832c40f4f43f6d049d',
             '4e10683fd32d6fb6d38924cb9bf483a3',
             '6a09c296e5e12ad5ed67e053f8cc98d5',
             '0ebd72e9b5d1c25b6746add4f5653dc8',
             'a3ceb9179d99be8d1e63b3e911fcd16b']
pattern = re.compile(r'\\"rank\\":(\d+),\\"channelName\\":\\"([^\\"]+)\\",\\"channelId\\":\\"([a-f0-9]{32})\\"')
found = {}
for focus in focus_ids:
    url = 'https://www.semorank.kr/ranking/chzzk'
    if focus:
        url += '?focus=' + focus
    html = urlopen(url, timeout=20).read().decode('utf-8')
    rows = [(int(rank), name, cid) for rank, name, cid in pattern.findall(html)]
    print('page', focus or 'top', 'rows', len(rows), 'first', rows[0][0], 'last', rows[-1][0])
    for rank, name, cid in rows:
        if cid not in found or rank < found[cid][0]:
            found[cid] = (rank, name)

matches = []
for cid, (rank, name) in found.items():
    if name in titles and cid not in known_ids and name not in known_names:
        matches.append({'name': name, 'channelId': cid, 'rank': rank})
matches.sort(key=lambda row: row['rank'])
print('new exact matches', len(matches))
if '--apply' in sys.argv:
    verified['channels'].extend({'name': row['name'], 'channelId': row['channelId']} for row in matches)
    verified_path.write_text(json.dumps(verified, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('added to verified list', len(matches))
else:
    print(json.dumps(matches, ensure_ascii=False, indent=2))

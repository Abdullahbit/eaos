import urllib.request
import urllib.parse
import json
import os
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

out_dir = r"d:\Projects\eaos\eaos\frontend\public\universities"
os.makedirs(out_dir, exist_ok=True)

unis = {
    'beykent': 'Beykent Üniversitesi',
    'isik': 'Işık Üniversitesi',
    'fsmvu': 'Fatih Sultan Mehmet Vakıf Üniversitesi',
    'beykoz': 'Beykoz Üniversitesi',
    'altinbas': 'Altınbaş Üniversitesi',
    'bahcesehir': 'Bahçeşehir Üniversitesi',
    'biruni': 'Biruni Üniversitesi',
    'istanbul_aydin': 'İstanbul Aydın Üniversitesi',
    'istanbul_bilgi': 'İstanbul Bilgi Üniversitesi',
    'istanbul_medipol': 'İstanbul Medipol Üniversitesi',
    'istanbul_nisantasi': 'İstanbul Nişantaşı Üniversitesi',
    'koc': 'Koç Üniversitesi',
    'ozyegin': 'Özyeğin Üniversitesi',
    'sabanci': 'Sabancı Üniversitesi',
    'uskudar': 'Üsküdar Üniversitesi',
    'yeditepe': 'Yeditepe Üniversitesi',
    'topkapi': 'İstanbul Topkapı Üniversitesi',
    'kocaeli_saglik': 'Kocaeli Sağlık ve Teknoloji Üniversitesi',
    'dogus': 'Doğuş Üniversitesi',
    'halic': 'Haliç Üniversitesi',
    'istinye': 'İstinye Üniversitesi',
    'kadir_has': 'Kadir Has Üniversitesi',
    'maltepe': 'Maltepe Üniversitesi',
    'okan': 'İstanbul Okan Üniversitesi',
}

headers = {'User-Agent': 'CampusInsiderApp/1.0 (contact@campusinsider.com)'}

for key, title in unis.items():
    api_url = f"https://tr.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=500"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        res = json.loads(urllib.request.urlopen(req, context=ctx).read())
        pages = res['query']['pages']
        img_url = None
        for pid, pval in pages.items():
            if 'thumbnail' in pval:
                img_url = pval['thumbnail']['source']
                break
        
        if img_url:
            ext = 'png' if '.png' in img_url.lower() else ('jpg' if '.jpg' in img_url.lower() else 'png')
            img_req = urllib.request.Request(img_url, headers=headers)
            img_data = urllib.request.urlopen(img_req, context=ctx).read()
            out_file = os.path.join(out_dir, f"{key}.{ext}")
            with open(out_file, 'wb') as f:
                f.write(img_data)
            print(f"Downloaded {key}.{ext} ({len(img_data)} bytes)")
        else:
            print(f"No logo thumbnail for {title}")
    except Exception as e:
        print(f"Error for {title}: {e}")
    time.sleep(0.3)

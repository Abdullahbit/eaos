import os
import urllib.request
import urllib.parse
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

out_dir = r"d:\Projects\eaos\eaos\frontend\public\universities"
os.makedirs(out_dir, exist_ok=True)

# Wikimedia commons & official logo URLs
targets = {
    'beykent.svg': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Beykent_University_logo.svg',
    'koc.svg': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Ko%C3%A7_University_logo.svg',
    'sabanci.svg': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Sabanc%C4%B1_University_logo.svg',
    'istanbul_bilgi.svg': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Istanbul_Bilgi_University_logo.svg',
    'bahcesehir.png': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Bah%C3%A7e%C5%9Fehir_University_Logo.png',
    'isik.png': 'https://upload.wikimedia.org/wikipedia/tr/b/b8/I%C5%9F%C4%B1k_%C3%9Cniversitesi_Logosu.png',
    'fsmvu.png': 'https://upload.wikimedia.org/wikipedia/tr/e/ea/Fatih_Sultan_Mehmet_Vak%C4%B1f_%C3%9Cniversitesi_logo.png',
    'beykoz.png': 'https://upload.wikimedia.org/wikipedia/tr/a/a2/Beykoz_%C3%9Cniversitesi_logo.png',
    'altinbas.png': 'https://upload.wikimedia.org/wikipedia/tr/6/69/Alt%C4%B1nba%C5%9F_%C3%9Cniversitesi_Logosu.png',
    'biruni.png': 'https://upload.wikimedia.org/wikipedia/tr/8/87/Biruni_%C3%9Cniversitesi_logo.png',
    'ozyegin.png': 'https://upload.wikimedia.org/wikipedia/tr/b/b9/%C3%96zye%C4%9Fin_%C3%9Cniversitesi_logo.png',
    'uskudar.png': 'https://upload.wikimedia.org/wikipedia/tr/4/4d/%C3%9Csk%C3%BCdar_%C3%9Cniversitesi_logo.png',
    'yeditepe.png': 'https://upload.wikimedia.org/wikipedia/tr/6/65/Yeditepe_%C3%9Cniversitesi_logo.png',
    'istanbul_aydin.png': 'https://upload.wikimedia.org/wikipedia/tr/f/f6/%C4%B0stanbul_Ayd%C4%B1n_%C3%9Cniversitesi_logo.png',
    'istanbul_medipol.png': 'https://upload.wikimedia.org/wikipedia/tr/a/a5/%C4%B0stanbul_Medipol_%C3%9Cniversitesi_logo.png',
    'istanbul_nisantasi.png': 'https://upload.wikimedia.org/wikipedia/tr/a/a4/%C4%B0stanbul_Ni%C5%9Fanta%C5%9F%C4%B1_%C3%9Cniversitesi_logo.png',
    'dogus.png': 'https://upload.wikimedia.org/wikipedia/tr/9/91/Do%C4%9Fu%C5%9F_%C3%9Cniversitesi_logo.png',
    'halic.png': 'https://upload.wikimedia.org/wikipedia/tr/4/42/Hali%C3%A7_%C3%9Cniversitesi_logo.png',
}

headers = {
    'User-Agent': 'CampusInsiderEduApp/1.0 (https://campusinsider.com; student-guidance@campusinsider.com)'
}

for name, raw_url in targets.items():
    try:
        # Quote non-ascii path characters properly
        url_parsed = urllib.parse.urlparse(raw_url)
        url_path_quoted = urllib.parse.quote(url_parsed.path)
        url = urllib.parse.urlunparse((url_parsed.scheme, url_parsed.netloc, url_path_quoted, url_parsed.params, url_parsed.query, url_parsed.fragment))
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = resp.read()
            filepath = os.path.join(out_dir, name)
            with open(filepath, 'wb') as f:
                f.write(data)
            print(f'Successfully downloaded {name} ({len(data)} bytes)')
        time.sleep(0.5)
    except Exception as e:
        print(f'Failed for {name}: {e}')

import os

logos = {
    'beykoz.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#3157D5" stroke-width="4" fill="#F0F4FF"/>
  <circle cx="50" cy="50" r="38" stroke="#3157D5" stroke-width="1.5" stroke-dasharray="3 3"/>
  <path d="M50 24L65 38H35L50 24Z" fill="#3157D5"/>
  <rect x="42" y="38" width="16" height="26" fill="#3157D5"/>
  <path d="M30 68H70" stroke="#3157D5" stroke-width="4" stroke-linecap="round"/>
  <text x="50" y="82" font-size="8.5" font-weight="800" fill="#3157D5" text-anchor="middle" font-family="sans-serif">BEYKÖZ</text>
</svg>''',
    'isik.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#059669" stroke-width="4" fill="#ECFDF5"/>
  <path d="M50 22C40 32 30 45 30 60C30 71 39 80 50 80C61 80 70 71 70 60C70 45 60 32 50 22Z" fill="#059669"/>
  <path d="M50 35V75" stroke="#ECFDF5" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M50 48L36 40" stroke="#ECFDF5" stroke-width="2" stroke-linecap="round"/>
  <path d="M50 58L64 50" stroke="#ECFDF5" stroke-width="2" stroke-linecap="round"/>
  <text x="50" y="92" font-size="9" font-weight="800" fill="#059669" text-anchor="middle" font-family="sans-serif">IŞIK</text>
</svg>''',
    'beykent.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#D96C4A" stroke-width="4" fill="#FFF5F2"/>
  <circle cx="50" cy="50" r="36" stroke="#D96C4A" stroke-width="2"/>
  <path d="M34 34H66V46C66 54.8366 58.8366 62 50 62C41.1634 62 34 54.8366 34 46V34Z" stroke="#D96C4A" stroke-width="3" fill="none"/>
  <path d="M50 34V62" stroke="#D96C4A" stroke-width="2"/>
  <text x="50" y="78" font-size="8" font-weight="800" fill="#D96C4A" text-anchor="middle" font-family="sans-serif">BEYKENT</text>
</svg>''',
    'topkapi.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#152238" stroke-width="4" fill="#F8FAFC"/>
  <path d="M28 66V40L50 26L72 40V66H28Z" stroke="#152238" stroke-width="3" fill="none"/>
  <rect x="44" y="48" width="12" height="18" fill="#152238"/>
  <text x="50" y="80" font-size="8" font-weight="800" fill="#152238" text-anchor="middle" font-family="sans-serif">TOPKAPI</text>
</svg>''',
    'altinbas.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#B45309" stroke-width="4" fill="#FEF3C7"/>
  <polygon points="50,22 61,38 78,38 64,50 69,67 50,56 31,67 36,50 22,38 39,38" fill="#B45309"/>
  <text x="50" y="82" font-size="7.5" font-weight="800" fill="#B45309" text-anchor="middle" font-family="sans-serif">ALTINBAŞ</text>
</svg>''',
    'bahcesehir.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#1E3A8A" stroke-width="4" fill="#EFF6FF"/>
  <path d="M50 20L75 60H25L50 20Z" fill="#1E3A8A"/>
  <circle cx="50" cy="45" r="8" fill="#EFF6FF"/>
  <text x="50" y="80" font-size="9" font-weight="800" fill="#1E3A8A" text-anchor="middle" font-family="sans-serif">BAU</text>
</svg>''',
    'biruni.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#0284C7" stroke-width="4" fill="#F0F9FF"/>
  <circle cx="50" cy="50" r="24" stroke="#0284C7" stroke-width="3" stroke-dasharray="6 4" fill="none"/>
  <circle cx="50" cy="50" r="10" fill="#0284C7"/>
  <text x="50" y="84" font-size="8" font-weight="800" fill="#0284C7" text-anchor="middle" font-family="sans-serif">BİRUNİ</text>
</svg>''',
    'fsmvu.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#475569" stroke-width="4" fill="#F8FAFC"/>
  <path d="M35 30H65V42C65 52 58 60 50 60C42 60 35 52 35 42V30Z" stroke="#475569" stroke-width="3" fill="none"/>
  <text x="50" y="78" font-size="8" font-weight="800" fill="#475569" text-anchor="middle" font-family="sans-serif">FSMVÜ</text>
</svg>''',
    'istanbul_aydin.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#2563EB" stroke-width="4" fill="#EFF6FF"/>
  <path d="M50 20L65 50H35L50 20Z" fill="#2563EB"/>
  <circle cx="50" cy="62" r="10" fill="#2563EB"/>
  <text x="50" y="84" font-size="7.5" font-weight="800" fill="#2563EB" text-anchor="middle" font-family="sans-serif">İST AYDIN</text>
</svg>''',
    'istanbul_bilgi.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#DC2626" stroke-width="4" fill="#FEF2F2"/>
  <rect x="30" y="30" width="40" height="30" rx="2" stroke="#DC2626" stroke-width="3" fill="none"/>
  <line x1="50" y1="30" x2="50" y2="60" stroke="#DC2626" stroke-width="2"/>
  <text x="50" y="78" font-size="8.5" font-weight="800" fill="#DC2626" text-anchor="middle" font-family="sans-serif">BİLGİ</text>
</svg>''',
    'istanbul_medipol.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#0D9488" stroke-width="4" fill="#F0FDFA"/>
  <rect x="44" y="26" width="12" height="36" fill="#0D9488"/>
  <rect x="32" y="38" width="36" height="12" fill="#0D9488"/>
  <text x="50" y="80" font-size="7.5" font-weight="800" fill="#0D9488" text-anchor="middle" font-family="sans-serif">MEDİPOL</text>
</svg>''',
    'istanbul_nisantasi.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#4F46E5" stroke-width="4" fill="#EEF2FF"/>
  <path d="M32 60L50 25L68 60H32Z" stroke="#4F46E5" stroke-width="3" fill="none"/>
  <text x="50" y="80" font-size="7.5" font-weight="800" fill="#4F46E5" text-anchor="middle" font-family="sans-serif">NIŞANTAŞI</text>
</svg>''',
    'koc.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#991B1B" stroke-width="4" fill="#FEF2F2"/>
  <path d="M32 30V70M32 50L68 30M32 50L68 70" stroke="#991B1B" stroke-width="6" stroke-linecap="round"/>
  <text x="50" y="84" font-size="9" font-weight="800" fill="#991B1B" text-anchor="middle" font-family="sans-serif">KOÇ</text>
</svg>''',
    'kocaeli_saglik.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#0891B2" stroke-width="4" fill="#ECFEFF"/>
  <circle cx="50" cy="42" r="16" stroke="#0891B2" stroke-width="3" fill="none"/>
  <path d="M50 26V58" stroke="#0891B2" stroke-width="3"/>
  <path d="M34 42H66" stroke="#0891B2" stroke-width="3"/>
  <text x="50" y="80" font-size="7.5" font-weight="800" fill="#0891B2" text-anchor="middle" font-family="sans-serif">KSTU</text>
</svg>''',
    'ozyegin.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#D97706" stroke-width="4" fill="#FFFBEB"/>
  <circle cx="50" cy="45" r="18" stroke="#D97706" stroke-width="4" fill="none"/>
  <text x="50" y="80" font-size="7.5" font-weight="800" fill="#D97706" text-anchor="middle" font-family="sans-serif">ÖZYEĞİN</text>
</svg>''',
    'sabanci.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#1E40AF" stroke-width="4" fill="#EFF6FF"/>
  <path d="M30 35C40 25 60 25 70 35C70 50 30 50 30 65C40 75 60 75 70 65" stroke="#1E40AF" stroke-width="5" stroke-linecap="round" fill="none"/>
  <text x="50" y="84" font-size="7.5" font-weight="800" fill="#1E40AF" text-anchor="middle" font-family="sans-serif">SABANCI</text>
</svg>''',
    'uskudar.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#7E22CE" stroke-width="4" fill="#FAF5FF"/>
  <path d="M32 30V52C32 62 40 70 50 70C60 70 68 62 68 52V30" stroke="#7E22CE" stroke-width="4" fill="none"/>
  <text x="50" y="82" font-size="7.5" font-weight="800" fill="#7E22CE" text-anchor="middle" font-family="sans-serif">ÜSKÜDAR</text>
</svg>''',
    'yeditepe.svg': '''<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" stroke="#15803D" stroke-width="4" fill="#F0FDF4"/>
  <path d="M50 20L75 62H25L50 20Z" fill="#15803D"/>
  <text x="50" y="80" font-size="7.5" font-weight="800" fill="#15803D" text-anchor="middle" font-family="sans-serif">YEDİTEPE</text>
</svg>'''
}

out_dir = r"d:\Projects\eaos\eaos\frontend\public\universities"
for fname, content in logos.items():
    fpath = os.path.join(out_dir, fname)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(logos)} SVG university logos in {out_dir}")

/**
 * Permanent Local University Logo Mapping Library
 * Maps database university names to official local public assets (/universities/*)
 */

export const UNIVERSITY_LOGO_MAP: Record<string, string> = {
  // Official University Emblems & Logos
  "BEYKENT UNIVERSITY": "/universities/beykent.svg",
  "ISIK UNIVERSITY": "/universities/isik.jpg",
  "IŞIK UNIVERSITY": "/universities/isik.jpg",
  "ISTANBUL TOPKAPI UNIVERSITY": "/universities/topkapi.png",
  "KOCAELI SAGLIK VE TEKNOLOJI UNIVERSITY": "/universities/kocaeli_saglik.svg",
  "FATIH SULTAN MEHMET VAKIF UNIVERSITY": "/universities/fsmvu.png",
  "BEYKOZ UNIVERSITY": "/universities/beykoz.svg",
  "ALTINBAS UNIVERSITY": "/universities/altinbas.png",
  "ALTINBAŞ UNIVERSITY": "/universities/altinbas.png",
  "BAHCESEHIR UNIVERSITY": "/universities/bahcesehir.jpg",
  "BAHÇEŞEHİR UNIVERSITY": "/universities/bahcesehir.jpg",
  "BIRUNI UNIVERSITY": "/universities/biruni.png",
  "BİRUNİ UNIVERSITY": "/universities/biruni.png",
  "DOGUS UNIVERSITY": "/universities/dogus.png",
  "DOĞUŞ UNIVERSITY": "/universities/dogus.png",
  "HALIC UNIVERSITY": "/universities/halic.png",
  "HALİÇ UNIVERSITY": "/universities/halic.png",
  "ISTANBUL AYDIN UNIVERSITY": "/universities/istanbul_aydin.png",
  "İSTANBUL AYDIN UNIVERSITY": "/universities/istanbul_aydin.png",
  "ISTANBUL BILGI UNIVERSITY": "/universities/istanbul_bilgi.svg",
  "İSTANBUL BİLGİ UNIVERSITY": "/universities/istanbul_bilgi.svg",
  "ISTANBUL MEDIPOL UNIVERSITY": "/universities/istanbul_medipol.svg",
  "İSTANBUL MEDİPOL UNIVERSITY": "/universities/istanbul_medipol.svg",
  "ISTANBUL NISANTASI UNIVERSITY": "/universities/istanbul_nisantasi.png",
  "İSTANBUL NİŞANTAŞI UNIVERSITY": "/universities/istanbul_nisantasi.png",
  "KADIR HAS UNIVERSITY": "/universities/kadir_has.jpg",
  "KOC UNIVERSITY": "/universities/koc.svg",
  "KOÇ UNIVERSITY": "/universities/koc.svg",
  "OZYEGIN UNIVERSITY": "/universities/ozyegin.jpg",
  "ÖZYEĞİN UNIVERSITY": "/universities/ozyegin.jpg",
  "SABANCI UNIVERSITY": "/universities/sabanci.jpg",
  "USKUDAR UNIVERSITY": "/universities/uskudar.svg",
  "ÜSKÜDAR UNIVERSITY": "/universities/uskudar.svg",
  "YEDITEPE UNIVERSITY": "/universities/yeditepe.svg",
};

/**
 * Normalizes university string key and looks up local official image path
 */
export function getUniversityLogoPath(uniName: string): string | null {
  if (!uniName) return null;
  const upper = uniName.trim().toUpperCase();

  if (UNIVERSITY_LOGO_MAP[upper]) {
    return UNIVERSITY_LOGO_MAP[upper];
  }

  // Partial substring match fallback
  for (const [key, path] of Object.entries(UNIVERSITY_LOGO_MAP)) {
    if (upper.includes(key) || key.includes(upper)) {
      return path;
    }
  }

  return null;
}

/**
 * Extracts initials from university name for clean placeholder rendering
 */
export function getUniversityInitials(uniName: string): string {
  if (!uniName) return "UNI";
  const stopWords = new Set(["UNIVERSITY", "UNIVERSİTESİ", "UNIVERSITETI", "THE", "OF"]);
  const words = uniName
    .toUpperCase()
    .split(/\s+/)
    .filter(w => !stopWords.has(w) && w.length > 0);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return "UNI";
}

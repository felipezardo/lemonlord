"""Auditoria de suplemento: lista trechos do PDF (por token) ausentes do arquivo gerado.
uso: SDL_PDF=x.pdf python3 audit_sup.py <arquivo.js> <ini-fim> [<ini-fim> ...]"""
import sys,re,json,unicodedata
from build_paths import tokens
N=lambda s:re.sub(r"[^a-zà-ú0-9]","",unicodedata.normalize("NFC",s.lower()))
blob=N(open(sys.argv[1],encoding="utf8").read())
faltam=0;total=0
for rng in sys.argv[2:]:
    a,b=map(int,rng.split("-"))
    for pn,k,t in tokens(range(a,b+1)):
        n=N(t)
        if len(n)<6: continue
        total+=1
        if n not in blob:
            faltam+=1; print(pn,k,t[:140].replace("\n"," "))
print(f"\n{faltam} de {total} trechos não encontrados")

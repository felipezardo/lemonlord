import pdfplumber,re,json,collections,unicodedata
from build_paths import tokens
from build_spells import HDR
F="/mnt/user-data/uploads/SDL___-___Basico-Edicao-Revisada-v1_02.pdf"
def letters(s): return collections.Counter(c for c in unicodedata.normalize("NFC",s.lower()) if c.isalpha())
js=open("../js/data/magias.js").read()
m=re.search(r"SDL.feiticos=(\[.*?\]);\nSDL.feiticosTrilha=(\[.*?\]);",js,re.S)
sp=json.loads(m.group(1))+json.loads(m.group(2))
data=" ".join(s["nome"]+" "+s["tipo"]+" "+s["trad"]+" "+s["texto"]+" "+s.get("origem","") for s in sp)
dropped=[];cur=False
for pn,k,t in tokens(range(111,150)):
    if k=='H': cur=False; dropped.append(t); continue
    if k=='B' and HDR.match(t): cur=True; continue
    if not cur: dropped.append(t)
have=letters(data+" "+" ".join(dropped))
tot=collections.Counter()
with pdfplumber.open(F) as pdf:
    for pn in range(111,150):
        for w in pdf.pages[pn-1].extract_words():
            if 40<w['top']<745 and "Licenciado" not in w['text']: tot.update(letters(w['text']))
# remover rodapé "Licenciado..." e números de página não contam (letras)
print("letras no PDF",sum(tot.values()),"nos dados",sum(have.values()))
diff={c:tot[c]-have.get(c,0) for c in tot if tot[c]-have.get(c,0)>0}
print("déficit por letra:",diff,"total",sum(diff.values()))

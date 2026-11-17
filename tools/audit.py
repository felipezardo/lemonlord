import pdfplumber,re,json,collections,sys,unicodedata
import os
F=os.environ.get("SDL_PDF","/mnt/user-data/uploads/SDL___-___Basico-Edicao-Revisada-v1_02.pdf")
def norm(w): return re.sub(r"[^\w]","",unicodedata.normalize("NFC",w.lower()))
def words_page(pg):
    ws=[w for w in pg.extract_words() if 40<w['top']<745 and "Licenciado" not in w['text']]
    out=[]
    for w in ws:
        t=w['text']
        out.append(t)
    return out
def toks(s):
    s=re.sub(r"(\w)-\s+(?=[a-zà-ú])",r"\1",s)
    return [norm(x) for x in s.split() if norm(x)]
def audit(pages,datatext):
    have=collections.Counter(toks(datatext))
    res={}
    with pdfplumber.open(F) as pdf:
        for pn in pages:
            raw=" ".join(words_page(pdf.pages[pn-1]))
            need=collections.Counter(toks(raw))
            miss=[]
            for w,c in need.items():
                d=c-have.get(w,0)
                if d>0 and not w.isdigit(): miss+= [w]*d
            res[pn]=(sum(need.values()),miss)
    return res
if __name__=="__main__":
    js=open("../js/data/magias.js").read()
    # só feitiços
    m=re.search(r"SDL.feiticos=(\[.*?\]);\nSDL.feiticosTrilha=(\[.*?\]);",js,re.S)
    sp=json.loads(m.group(1))+json.loads(m.group(2))
    text=" ".join(s["nome"]+" "+s["tipo"]+" "+s["trad"]+" "+str(s["grau"])+" "+s["texto"] for s in sp)
    r=audit(range(116,150),text)
    tot=sum(v[0] for v in r.values());mis=sum(len(v[1]) for v in r.values())
    print("palavras",tot,"faltando",mis)
    for pn,(n,m) in r.items(): print(pn,n,len(m),m[:25])

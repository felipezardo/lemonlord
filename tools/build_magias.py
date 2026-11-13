import json,re,unicodedata
from build_spells import run
from build_paths import tokens
na=lambda s:unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode()
slug=lambda s:re.sub(r"[^a-z0-9]+","-",na(s)).strip("-")
sp=run(range(111,150))
INT=["Adivinhação","Arcana","Batalha","Conjuração","Encantamento","Ilusão","Maldição","Necromancia","Proibida","Proteção","Runas","Sombras","Tecnomancia","Teletransporte","Tempo"]
TREVAS=["Maldição","Necromancia","Proibida"]
trads=sorted({s["trad"] for s in sp})
info=[{"nome":t,"atr":"intelecto" if t in INT else "vontade","trevas":t in TREVAS} for t in trads]
def clean(s): return re.sub(r"\s+"," ",s).replace(" \n","\n").strip()
fe=[];seen=set()
for s in sp:
    i=slug(s["trad"]+"-"+s["nome"]); 
    if i in seen: continue
    seen.add(i)
    fe.append({"id":i,"nome":s["nome"],"tipo":s["tipo"],"trad":s["trad"],"grau":s["grau"],"texto":clean(s["texto"])})
# feitiços de trilha
pt=run(list(range(55,100)))
ft=[]
for s in pt:
    atr="intelecto"
    m=re.search(r"(Intelecto|Vontade)",s["texto"]); 
    if m: atr=m.group(1).lower()
    ft.append({"id":slug(s["nome"]),"nome":s["nome"],"tipo":s["tipo"],"trad":"Trilha","grau":s["grau"],"atr":atr,"origem":s["trad"],"texto":clean(s["texto"])})
# sidebar de talentos de escolha
def side(pg,title,stop=r"^(Desenvolvimento|Características)"):
    out=[];on=False;cur=None
    for pn,k,t in tokens([pg]):
        if k=='H':
            if on: break
            if t==title: on=True
            continue
        if not on: continue
        if k=='B': cur={"n":t,"t":""};out.append(cur)
        elif cur: cur["t"]+=(" " if cur["t"] else "")+t
    for o in out: o["t"]=re.split(r"\s(Características|Talento Sagaz Escolha)\b",o["t"])[0].strip()
    return out
esc={"sagaz":side(57,"Talentos Sagazes"),"gatuno":side(72,"Talentos Gatunos"),"lutador":side(73,"Talentos de Lutador")}
rel=[["Culto do Novo Deus",["Celestial","Vida","Teurgia"]],["Ancestrais Anões",["Batalha","Terra","Vida"]],["Fé Antiga",["Vida","Natureza","Primal"]],["Bruxaria",["Maldição","Encantamento","Vida"]]]
conj={0:[1],1:[2,1],2:[3,2,1],3:[4,2,1,1],4:[5,2,2,1,1],5:[6,3,2,2,1,1],6:[7,3,2,2,2,1,1],7:[8,3,2,2,2,1,1,1],8:[9,3,3,2,2,2,1,1,1],9:[10,3,3,3,2,2,1,1,1,1],10:[11,3,3,3,3,2,1,1,1,1,1]}
js="window.SDL=window.SDL||{};\nSDL.tradicoesInfo="+json.dumps(info,ensure_ascii=False)+";\nSDL.feiticos="+json.dumps(fe,ensure_ascii=False,separators=(",",":"))+";\nSDL.feiticosTrilha="+json.dumps(ft,ensure_ascii=False,separators=(",",":"))+";\nSDL.conjuracoes="+json.dumps(conj)+";\nSDL.religioes="+json.dumps(rel,ensure_ascii=False)+";\nSDL.talentosEscolha="+json.dumps(esc,ensure_ascii=False,separators=(",",":"))+";\n"
open("../js/data/magias.js","w").write(js)
print(len(fe),len(ft),[ (o["n"],len(o["t"])) for k in esc for o in esc[k]],[ (f["nome"],f["origem"],f["grau"]) for f in ft])

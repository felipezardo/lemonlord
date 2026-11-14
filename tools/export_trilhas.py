import json,re,unicodedata
d=json.load(open("../data/_paths_raw.json"))
TRAD=["Adivinhação","Água","Alteração","Ar","Arcana","Batalha","Canção","Caos","Celestial","Conjuração","Destruição","Encantamento","Fogo","Ilusão","Maldição","Natureza","Necromancia","Primal","Proibida","Proteção","Runas","Sombras","Tecnomancia","Teletransporte","Tempestade","Tempo","Terra","Teurgia","Transformação","Vida"]
KEYS={"vida":"vida","defesa":"defesa","percepção":"percepcao","velocidade":"velocidade","poder":"poder","corrupção":"corrupcao","insanidade":"insanidade","tamanho":"tamanho","taxa de cura":"cura"}
na=lambda s:unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode()
slug=lambda n:re.sub(r"[^a-z]+","-",na(n)).strip("-")
def car(txt):
    r={}
    for k,v in re.findall(r"(Vida|Defesa|Percepção|Velocidade|Poder|Corrupção|Insanidade|Tamanho|Taxa de Cura) ([+-]\d+)",txt or ""): r[KEYS[k.lower()]]=r.get(KEYS[k.lower()],0)+int(v)
    return r
NUM={"um":1,"uma":1,"dois":2,"duas":2,"três":3}
def mag(path,lvl,tx):
    tl=tx.lower(); m={"obrig":0,"esc":0,"restr":None,"solo":False}
    if re.search(r"descobre uma tradi[çc][ãa]o\. em seguida, fa[çc]a (\w+) escolhas",tl):
        m["obrig"]=1;m["esc"]=NUM.get(re.search(r"fa[çc]a (\w+) escolhas",tl).group(1),3);return m
    if re.search(r"tradi[çc][ãa]o associada à sua religi[ãa]o \(veja[^)]*\)\. em seguida, fa[çc]a (\w+) escolhas",tl):
        m["obrig"]=1;m["esc"]=2;m["rel"]=True;return m
    mm=re.search(r"(?:fa[çc]a|faz|você faz) (\w+) escolhas",tl)
    if mm: m["esc"]=NUM.get(mm.group(1),2);m["rel"]="religi" in tl;return m
    if "dois feitiços" in tl: m["esc"]=2;m["solo"]=True;return m
    mentioned=[t for t in TRAD if re.search(r"\b"+na(t)+r"\b",na(tl))]
    if path=="Druida": m["esc"]=1;m["restr"]=["Vida","Natureza","Primal"];return m
    if mentioned and re.search(r"descobre a tradi",tl): m["esc"]=1;m["restr"]=[mentioned[0]];return m
    if re.search(r"descobre (uma )?(nova )?tradi[çc][ãa]o",tl): m["esc"]=1;m["rel"]="religi" in tl;return m
    if re.search(r"tradi[çc][ãa]o que já descobriu",tl): m["esc"]=1;return m
    if re.search(r"aprend[ae]? um feiti[çc]o",tl): m["esc"]=1;m["solo"]=True;return m
    return None
SPELLS={("Magista","1"):"sentir-magia",("Ata-feitiços","3"):"arma-enfeiticada",("Bruxo","3"):"fogo-bruxo",("Exorcista","7"):"exorcismo",("Necromante","7"):"comandar-mortos-vivos",("Tecnomante","10"):"animar-objeto",("Templário","7"):"templo-da-fe",("Tenebrista","10"):"forma-de-sombra"}
out=[];side={}
for t,ps in d.items():
    for n,p in ps.items():
        if not p["niveis"]: continue
        niv={}
        for k,v in p["niveis"].items():
            cx=v["caracteristicas"] or ""; at=v["atributos"] or ""; tal=[]; mg=None
            lista=v["talentos"]; stat=None
            for x in lista:
                nm=x["nome"]
                if re.match(r"^EIDOLON",nm): stat=[nm+" "+x["texto"]]; continue
                if stat is not None:
                    if nm in("Defesa","Vida","Força","Agilidade","Intelecto","Vontade","Velocidade","Imune","Apêndice"):
                        stat.append(nm+" "+x["texto"].rstrip(";,")); continue
                    if tal: tal[-1]["t"]+="\n"+"; ".join(stat); stat=None
                if nm in("Vida","Poder","Defesa","Percepção") and re.match(r"^[+-]\d",x["texto"]): cx+=" "+nm+" "+x["texto"]; continue
                if nm=="Atributos Características": cx=x["texto"]; continue
                if re.match(r"^(d\d|[A-ZÇÃÉÍÓÚ ]{6,})",nm) or len(nm)>45 or nm=="Atributos": continue
                if nm in("Magia","Características Magia","Magia Exorcista") or (nm=="Magia"):
                    r=mag(n,k,x["texto"]); 
                    if r and not mg: mg=r
                    tal.append({"n":"Magia","t":x["texto"]}); continue
                tal.append({"n":nm,"t":x["texto"]})
            if stat is not None and tal: tal[-1]["t"]+="\n"+"; ".join(stat)
            if re.match(r"(Vida|Poder)",at): cx=at+" "+cx; at=""
            m=re.search(r"\b(dois|três|um)\b",at); esc={"um":1,"dois":2,"três":3}[m.group(1)] if m else 0
            if not esc and ((t=="novato" and k=="1") or (t=="especialista" and k=="3")): esc=2
            if not esc and t=="mestre" and k=="7": esc=3
            if re.search(r"Vida|Poder",at): cx+=" "+at
            e={"n":int(k),"esc":esc,"car":car(cx),"idi":v["idiomas"],"tal":tal}
            if mg: e["mag"]=mg
            if (n,k) in SPELLS: e["feit"]=SPELLS[(n,k)]
            niv[k]=e
        out.append({"id":slug(n),"nome":n,"tier":t,"desc":p.get("descricao",""),"niv":niv})
open("../js/data/trilhas.js","w").write("window.SDL=window.SDL||{};SDL.trilhas="+json.dumps(out,ensure_ascii=False,separators=(",",":"))+";")
print(len(out),sum(1 for o in out for v in o["niv"].values() if "mag" in v),"níveis com magia")
nomag=[(o["nome"],k) for o in out for k,v in o["niv"].items() if any(x["n"]=="Magia" for x in v["tal"]) and "mag" not in v]
print("magia sem parse:",nomag)

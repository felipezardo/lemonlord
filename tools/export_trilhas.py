import json,re,unicodedata
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
def inferir_tier(niveis):
    ks=set(int(k) for k in niveis)
    if ks & {1,2,5,8}: return "novato"
    if ks & {3,6,9}: return "especialista"
    return "mestre"
def desduplicar(txt):
    """Remove o rótulo com letras duplicadas (ex.: 'TTrriillhhaa ddee MMeessttrree') que o PDF coloca no início de descrições."""
    m=re.match(r"^((?:(.)\2|\s)+)(.*)$",txt or "")
    if m and len(m.group(1))>=8 and sum(1 for ch in m.group(1) if ch!=" ")>=8:
        return m.group(3).strip()
    return txt or ""
def limpar_txt(x):
    if isinstance(x,str): return re.sub(r"\(\s+","(",re.sub(r"\s+([.,;:!?)])",r"\1",x))
    if isinstance(x,list): return [limpar_txt(i) for i in x]
    if isinstance(x,dict): return {k:limpar_txt(v) for k,v in x.items()}
    return x
def converter(d,spells=None):
    spells=SPELLS if spells is None else spells
    out=[]
    for t0,ps in d.items():
      for n,p in ps.items():
        if not p["niveis"]: continue
        t=t0 if t0!="auto" else inferir_tier(p["niveis"])
        niv={}
        for k,v in p["niveis"].items():
            cx=v["caracteristicas"] or ""; at=v["atributos"] or ""; tal=[]; mg=None; feit=None
            stat=None; em_feitico=False
            ROTS=r"^(Requisitos?|Alvos?|Área|Duração|Permanência|Especial|Efeito|Gatilho|Sacrifício|Concentração|Desencadeada|Rolagem de Ataque 20\+)"
            for x in v["talentos"]:
                nm=x["nome"]
                if em_feitico and re.match(ROTS,nm): continue
                em_feitico=False
                if (re.search(r"\b(ATAQUE|UTILITÁRIO)\b",nm) or (re.match(r"^[A-ZÇÃÉÍÓÚ0-9'’\- ]{3,}$",nm) and not re.search(r"[a-zà-ú]",nm) and len(nm)<=45)) and not nm.startswith("EIDOLON"): em_feitico=True; continue
                if re.match(r"^EIDOLON",nm): stat=[nm+" "+x["texto"]]; continue
                if stat is not None:
                    if nm in("Defesa","Vida","Força","Agilidade","Intelecto","Vontade","Velocidade","Imune","Apêndice"):
                        stat.append(nm+" "+x["texto"].rstrip(";,")); continue
                    if tal: tal[-1]["t"]+="\n"+"; ".join(stat); stat=None
                if nm in("Vida","Poder","Defesa","Percepção") and re.match(r"^[+-]\d",x["texto"]): cx+=" "+nm+" "+x["texto"]; continue
                if nm=="Atributos Características": cx=x["texto"]; continue
                if re.match(r"^(d\d|[A-ZÇÃÉÍÓÚ ]{6,})",nm) or len(nm)>45 or nm=="Atributos": continue
                if nm in("Magia","Características Magia","Magia Exorcista"):
                    r=mag(n,k,x["texto"])
                    if r and not mg: mg=r
                    f2=re.search(r"aprende o feiti[çc]o ([^.]+?)\s*\.",x["texto"])
                    if f2: feit=slug(f2.group(1))
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
            if (n,k) in spells: e["feit"]=spells[(n,k)]
            elif feit: e["feit"]=feit
            niv[k]=e
        out.append({"id":slug(n),"nome":n,"tier":t,"desc":desduplicar(p.get("descricao","")),"niv":niv})
    out=limpar_txt(out)
    return out

if __name__=="__main__":
    d=json.load(open("../data/_paths_raw.json"))
    out=converter(d)
    open("../js/data/trilhas.js","w").write("window.SDL=window.SDL||{};SDL.trilhas="+json.dumps(out,ensure_ascii=False,separators=(",",":"))+";")
    print(len(out),sum(1 for o in out for v in o["niv"].values() if "mag" in v),"níveis com magia")

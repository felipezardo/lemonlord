import re,json
from build_paths import tokens
toks=list(tokens(range(11,24)))
slug=lambda s:s.lower().replace("ã","a").replace("ô","o").replace("â","a")
NOMES=["Humano","Anão","Autômato","Goblin","Orc","Versipele"]
def pares(blk):
    out=[];i=0
    while i<len(blk):
        k,t=blk[i]
        if k=='B':
            txt="";j=i+1
            while j<len(blk) and blk[j][0]=='T': txt+=(" " if txt else "")+blk[j][1]; j+=1
            out.append((t,txt)); i=j
        else: i+=1
    return out
res=[]
for nome in NOMES:
    ini=next(i for i,(pn,k,t) in enumerate(toks) if k=='H' and t==f"Criando um {nome}")
    # descrição: primeiro T após H do nome
    h=next(i for i,(pn,k,t) in enumerate(toks) if k=='H' and t==nome and i<ini)
    desc=next(t for pn,k,t in toks[h+1:ini] if k=='T').replace(" •","").strip()
    fim=next(i for i,(pn,k,t) in enumerate(toks) if i>ini and k=='H' and re.match(rf"{nome} Especialista Nível 4",t))
    blk=[(k,t) for pn,k,t in toks[ini+1:fim]]
    P=pares(blk); d={}
    for n,t in P: d.setdefault(n,t)
    att=re.search(r"Força (\d+), Agilidade (\d+), Intelecto (\d+), Vontade (\d+)",d["Valores de Atributos Iniciais"])
    a={"id":slug(nome),"nome":nome,"desc":desc,"atr":dict(zip(["forca","agilidade","intelecto","vontade"],map(int,att.groups())))}
    if "aumente-o em 1" in d["Valores de Atributos Iniciais"]: a["escolhaAtributo"]=1
    pm=re.search(r"\+ (\d)",d["Percepção"]); a["percepcao"]=int(pm.group(1)) if pm else 0
    vm=re.search(r"\+ (\d)",d["Vida"]); a["vidaBonus"]=int(vm.group(1)) if vm else 0
    if re.fullmatch(r"\d+",d["Defesa"].strip()): a["defesaFixa"]=int(d["Defesa"])
    a["tamanho"]=[x.strip() for x in re.sub(r"[,\.]$","",d["Tamanho"]).split(" ou ")]
    a["velocidade"]=int(re.match(r"\d+",d["Velocidade"]).group(0))
    a["corrupcao"]=int(re.match(r"\d+",d["Corrupção"]).group(0)); a["insanidade"]=0
    a["idiomas"]=d["Idiomas e Profissões"]
    # talentos
    i0=next(i for i,(k,t) in enumerate(blk) if k=='B' and t=="Idiomas e Profissões")
    rest=blk[i0:]; ps=pares(rest)[1:]
    tal=[];i=0
    while i<len(ps):
        n,t=ps[i]
        if n=="Imune": tal.append({"n":"Imune","t":"Imune "+t})
        elif n=="Inimigo Odiado":
            n2,t2=ps[i+1]; tal.append({"n":n,"t":(t+" "+n2+t2).strip()}); i+=1
        elif nome=="Autômato" and n=="Percepção" : pass
        else: tal.append({"n":n,"t":t})
        i+=1
    if nome=="Autômato":
        # bloco FORMA DE OBJETO completo (H -> até Reparar Dano)
        i1=next(i for i,(pn,k,t) in enumerate(toks) if k=='H' and t=="FORMA DE OBJETO")
        fim2=next(i for i,(pn,k,t) in enumerate(toks) if i>i1 and k=='B' and t=="Dar Corda no Relógio")
        sub=[(k,t) for pn,k,t in toks[i1:fim2]]
        linhas=[]; stat=[]
        for n,t in pares(sub):
            if n in("Percepção","Defesa","Vida","Força","Agilidade","Intelecto","Vontade","Velocidade") : stat.append(f"{n} {t.rstrip(';,')}")
            else: linhas.append(f"{n}{t}" if t[:1] in ":." else f"{n} {t}")
        head=next(t for pn,k,t in toks[i1:fim2] if k=='T')
        tal=[x for x in tal if x["n"] not in("Percepção","Defesa","Vida","Força","Agilidade","Intelecto","Vontade","Velocidade","Objeto","Aflições Suprimidas","Magia Falha","6","2–5","1:","Imune ") and not (x["n"]=="Imune" and x["t"].startswith("Imune rolagens"))]
        pos=next(i for i,x in enumerate(tal) if x["n"]=="Dar Corda no Relógio")
        tal.insert(pos,{"n":"Forma de Objeto","t":head+"\n"+"; ".join(stat)+"\n"+"\n".join(linhas)})
    a["talentos"]=tal
    # nível 4
    h4=toks[fim]; idx=fim
    k1,t1=toks[idx+1][1],toks[idx+1][2]; t2=toks[idx+2][2]
    vm=re.match(r"Vida \+(\d+)\s*(.*)",t2)
    n4n=toks[idx+3][2]; n4t=toks[idx+4][2]
    a["nivel4"]={"car":{"vida":int(vm.group(1))},"escolha":vm.group(2),"talento":{"n":n4n,"t":n4t}}
    res.append(a)
# Ódio
ti=next(i for i,(pn,k,t) in enumerate(toks) if k=='H' and t.startswith("Ódio"))
tab=toks[ti+2][2]; ops=[m.group(1) for m in re.finditer(r"\d+–\d+ ([A-Za-zÀ-ú\- ]+?)(?= \d+–\d+|$)",tab)]
for a in res:
    for t in a["talentos"]:
        if t["n"]=="Inimigo Odiado": t["escolha"]={"rotulo":"Criatura odiada","opcoes":ops}
open("../js/data/ancestralidades.js","w").write("window.SDL=window.SDL||{};\n/* Gerado por tools/build_anc.py a partir do Livro Básico (Cap. 1). Para adicionar ancestralidades de suplementos, use SDL.ancestralidades.push({...}) em outro arquivo. */\nSDL.ancestralidades="+json.dumps(res,ensure_ascii=False,indent=1)+";\n")
print(ops); 
for a in res: print(a["nome"],a["tamanho"],a["velocidade"],a.get("defesaFixa"),[t["n"] for t in a["talentos"]],a["nivel4"]["talento"]["n"])

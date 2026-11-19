"""Tumbas da Desolação -> js/data/suplementos/tumbas-da-desolacao.js  (uso: SDL_PDF=/tmp/grp/tumbas.pdf python3 sup_tumbas.py)"""
import os,re,json,sys
os.environ.setdefault("SDL_PDF","/tmp/grp/tumbas.pdf")
from sup_lib import *
toks=list(tokens(range(5,13)))
def bloco(ini_pred,fim_pred):
    i=next(i for i,(pn,k,t) in enumerate(toks) if ini_pred(k,t)); j=next((j for j,(pn,k,t) in enumerate(toks) if j>i and fim_pred(k,t)),len(toks))
    return [(k,t) for pn,k,t in toks[(i if toks[i][1]=='B' else i+1):j]]
def descricao(nome):
    i=next(i for i,(pn,k,t) in enumerate(toks) if k=='H' and t==nome)
    j=next(j for j,(pn,k,t) in enumerate(toks) if j>i and k=='H')
    ps=pares([(k,t) for pn,k,t in toks[i+1:j]])
    primeiro=next(t for pn,k,t in toks[i+1:j] if k=='T')
    return primeiro, [{"t":n.rstrip(": "),"x":x} for n,x in ps]
def talentos(ps,ignorar):
    out=[]
    for n,t in ps:
        if n in ignorar: continue
        out.append({"n":n,"t":t})
    return out
anc=[]
# ---- Regresso (sobreposição a humano/anão/orc)
desc,lore=descricao("Regresso")
intro=next(t for pn,k,t in toks if k=='T' and t.startswith("Primeiro, crie um personagem humano, anão ou orc"))
b=bloco(lambda k,t:k=='B' and t=="Valores Iniciais de Atributo",lambda k,t:k=='H')
P=pares(b); d={n:t for n,t in P}
cd,dados=cardelta(d["Características"])
n4=bloco(lambda k,t:k=='H' and t.startswith("Regresso Especialista de Nível 4"),lambda k,t:k=='H')
P4=pares(n4); d4={n:t for n,t in P4}
vida4=int(re.search(r"Vida \+(\d+)",d4["Características"]).group(1)); esc4=re.sub(r"^Vida \+\d+\s*","",d4["Características"])
tal4=[(n,t) for n,t in P4 if n!="Características"][0]
anc.append({"id":"regresso","nome":"Regresso","tipo":"sobreposicao","base":["humano","anao","orc"],"desc":desc,"lore":lore,"intro":intro,
 "atrDelta":delta(d["Valores Iniciais de Atributo"]),"carDelta":cd,"dados":dados,
 "talentos":talentos(P,{"Valores Iniciais de Atributo","Características"}),
 "nivel4":{"car":{"vida":vida4},"escolha":esc4,"opcoes":["feitico","talento","base"],"talento":{"n":tal4[0],"t":tal4[1]}}})
# ---- Vampiro (sobreposição a humano)
desc,lore=descricao("Vampiro")
intro=next(t for pn,k,t in toks if k=='T' and t.startswith("Todos os vampiros começam como humanos"))
b=bloco(lambda k,t:k=='B' and t=="Valores de Atributo",lambda k,t:k=='H')
P=pares(b); d={n:t for n,t in P}
cd,dados=cardelta(d["Características"])
n4=bloco(lambda k,t:k=='H' and t.startswith("Vampiro Especialista de Nível 4"),lambda k,t:k=='H')
P4=pares(n4); tal4=[(n,t) for n,t in P4 if n!="Características"][0]
vida4=int(re.search(r"Vida \+(\d+)",dict(P4)["Características"]).group(1))
tals=talentos(P,{"Valores de Atributo","Características"})
anc.append({"id":"vampiro","nome":"Vampiro","tipo":"sobreposicao","base":["humano"],"desc":desc,"lore":lore,"intro":intro,
 "atrDelta":delta(d["Valores de Atributo"]),"carDelta":cd,"dados":dados,"talentos":tals,
 "nivel4":{"car":{"vida":vida4},"escolha":"","opcoes":["talento"],"talento":{"n":tal4[0],"t":tal4[1]}}})
# ---- Salamandra (ancestralidade padrão)
desc,lore=descricao("Salamandra")
b=bloco(lambda k,t:k=='H' and t=="Criando uma Salamandra",lambda k,t:k=='H')
P=pares(b); d={}
for n,t in P: d.setdefault(n,t)
att=re.search(r"Força (\d+), Agilidade (\d+), Intelecto (\d+), Vontade (\d+)",d["Valores Iniciais de Atributo"])
i0=[n for n,_ in P].index("Idiomas e Profissões")
n4=bloco(lambda k,t:k=='H' and t.startswith("Salamandra Especialista de Nível 4"),lambda k,t:k=='H')
P4=pares(n4); d4=dict(P4)
anc.append({"id":"salamandra","nome":"Salamandra","desc":desc,"lore":lore,"atr":dict(zip(["forca","agilidade","intelecto","vontade"],map(int,att.groups()))),
 "percepcao":0,"vidaBonus":0,"tamanho":["1"],"velocidade":int(re.match(r"\d+",d["Velocidade"]).group(0)),"corrupcao":0,"insanidade":0,
 "idiomas":d["Idiomas e Profissões"],"talentos":[{"n":n,"t":t} for n,t in P[i0+1:]],
 "nivel4":{"car":{"vida":int(re.search(r"Vida \+(\d+)",d4["Características"]).group(1))},"escolha":re.sub(r"^Vida \+\d+\s*","",d4["Características"]),
           "talento":{"n":P4[1][0],"t":P4[1][1]}}})
# ---- lore adicional (seções de regra/descrição fora das tabelas aleatórias)
def secao(titulo):
    i=next(i for i,(pn,k,t) in enumerate(toks) if k=='H' and t==titulo)
    out=[]
    for pn,k,t in toks[i+1:]:
        if k=='H': break
        if k=='T' and not re.match(r"^\d",t): out.append(t)
    return " ".join(out)
for a in anc:
    if a["id"]=="vampiro":
        a["lore"].append({"t":"Criando Novos Vampiros","x":secao("Criando Novos Vampiros")})
        a["lore"].append({"t":"Tabelas da Ancestralidade Vampiro","x":secao("Tabelas da Ancestralidade Vampiro")})
        tx=" ".join(t["t"] for t in a["talentos"])
        assert "taxa de cura é 0" in tx.lower() and "1 + o nível do grupo" in tx
        a["curaFixa"]=0
        a["recursos"]=[{"id":"sangue","nome":"Pontos de sangue","max":"1+nivel","inicio":1}]
    if a["id"]=="regresso":
        a["lore"].append({"t":"Regra Opcional: Retornando dos Mortos","x":secao("Retornando dos Mortos")})
        a["lore"].append({"t":"Tabelas da Ancestralidade Regresso","x":secao("Tabelas da Ancestralidade Regresso")})
# ---- trilhas
tr=trilhas(range(13,16))
for t in tr:
    m=re.search(r"você precisa ser (?:um|uma) (\w+)",t["desc"])
    if m: t["requer"]=m.group(1).capitalize()
# feitiços de trilha (Assolar) e feitiços das tradições
todos=feiticos(range(15,19))
ft=[];fe=[]
for s in todos:
    if s["trad"].upper() in ("ASSOLADOR",): 
        txt=s["texto"]; atr="ambos" if re.search(r"Intelecto ou Vontade",txt) else ("vontade" if re.search(r"Vontade",txt) and not re.search(r"Intelecto",txt) else "intelecto")
        ft.append({"id":s["id"].replace("assolador-",""),"nome":s["nome"],"tipo":s["tipo"],"trad":"Trilha","grau":s["grau"],"atr":atr,"origem":"Assolador","texto":s["texto"]})
    else: fe.append({k:v for k,v in s.items() if k!="_pag"})
for t in tr:
    for k,l in t["niv"].items():
        if l.get("feit") and l["feit"]!=ft[0]["id"] if ft else False: pass
menor=next(t for pn,k,t in tokens([16]) if k=='T' and "tradições menores" in t)
sangue=next(t for pn,k,t in tokens([16]) if k=='T' and t.startswith("A magia de Sangue"))
assert "Intelecto ou Vontade" in sangue and "nunca têm grau superior a 3" in menor
trad_info=[{"nome":"Sangue","atr":"ambos","trevas":False,"menor":True,"grauMax":3,"nota":menor.split(". ",1)[1]+" "+sangue}]
# ---- relíquias
rel=[];on=False;cur=None
for pn,k,t in tokens(range(26,28)):
    if k=='H' and t=="Relíquias da Desolação": on=True; continue
    if k=='H' and t=="Criaturas da Desolação": break
    if not on: continue
    if k=='H': cur={"nome":t,"preco":"—","disp":"Relíquia","cat":"Relíquia","desc":""}; rel.append(cur)
    elif cur and k=='B': cur["desc"]+="\n"+t.rstrip(":")+". "
    elif cur and k=='T': cur["desc"]+=("" if cur["desc"].endswith(" ") or not cur["desc"] else " ")+t
for r in rel: r["desc"]=re.sub(r"\s+\n","\n",r["desc"]).strip()
sup={"id":"tumbas-da-desolacao","nome":"Tumbas da Desolação","abreviacao":"Tumbas da Desolação","versao":"1",
 "ancestralidades":anc,"trilhas":tr,"tradicoesInfo":trad_info,"feiticos":fe,"feiticosTrilha":ft,"itens":rel}
js_suplemento(sup,"../js/data/suplementos/tumbas-da-desolacao.js")
print("ancestralidades",[a["nome"] for a in anc],"\ntrilhas",[(t["nome"],t["tier"],list(t["niv"])) for t in tr],"\nfeitiços",len(fe),sorted({(s["trad"],s["grau"]) for s in fe}),"\npath spells",[s["id"] for s in ft],"\nrelíquias",[(r["nome"],len(r["desc"])) for r in rel])
for t in tr:
    for k,l in t["niv"].items():
        if l.get("feit"): print(" feit",t["id"],k,l["feit"])

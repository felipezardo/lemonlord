"""Funções comuns para extrair suplementos (ver SUPLEMENTOS.md). Defina SDL_PDF antes de importar."""
import re,json,unicodedata,os
from build_paths import tokens,parse,clean
from build_spells import HDR
import export_trilhas as ex
na=lambda s:unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode()
slug=lambda s:re.sub(r"[^a-z0-9]+","-",na(s)).strip("-")
MENOS=str.maketrans({"–":"-","−":"-","—":"-"})
ATRN={"Força":"forca","Agilidade":"agilidade","Intelecto":"intelecto","Vontade":"vontade"}
CARN={"Vida":"vida","Defesa":"defesa","Percepção":"percepcao","Velocidade":"velocidade","Poder":"poder","Corrupção":"corrupcao","Insanidade":"insanidade","Tamanho":"tamanho","Taxa de Cura":"cura"}

def fundir_inline(blk):
    """Negrito no meio de uma frase (ex.: 'o talento Beber Sangue (veja a seguir)') não é rótulo: vira texto contínuo."""
    out=[];i=0
    while i<len(blk):
        k,t=blk[i]; prox=blk[i+1][1] if i+1<len(blk) and blk[i+1][0]=='T' else ""
        if k=='B' and out and out[-1][0]=='T' and (t[:1].islower() or prox[:1] in "(,.;)" or prox[:1].islower()) and not re.match(r"^d\d",t) and t!="Imune":
            out[-1]=('T',out[-1][1]+" "+t+((" "+prox) if prox else "")); i+=2 if prox else 1; continue
        out.append((k,t)); i+=1
    return out
def pares(blk):
    """Agrupa [(tipo,texto)] em [(rótulo em negrito, texto)]."""
    blk=fundir_inline(blk); out=[];i=0
    while i<len(blk):
        k,t=blk[i]
        if k=='B':
            txt="";j=i+1
            while j<len(blk) and blk[j][0]=='T': txt+=(" " if txt else "")+blk[j][1]; j+=1
            out.append((t,txt)); i=j
        else: i+=1
    return out

def trilhas(pages):
    """Trilhas de personagem das páginas dadas, no formato do site (tier inferido pelos níveis)."""
    raw=parse(list(pages),"auto")
    return ex.converter({"auto":raw},spells={})

HDR2=re.compile(r"^(ATAQUE|UTILITÁRIO)\s+(?:(?:DE|DA|DO|DOS|DAS)\s+)?([A-ZÀ-ÚÇ\s\-]+?)\s+(\d+)\s*(.*)$")
ROT=r"^(Duração|Alvo|Alvos|Área|Requisitos?|Gatilho|Ação|Efeito|Rolagem de Ataque 20\+|Sacrifício|Permanência|Desencadeada|Concentração|Especial)"
def _titulo(s): 
    s=s.strip().title()
    for a,b in ((" De "," de "),(" Da "," da "),(" Do "," do "),(" Dos "," dos "),(" Das "," das "),(" E "," e "),(" Em "," em "),(" Para "," para "),(" A "," a "),(" O "," o "),(" Ao "," ao ")): s=s.replace(a,b)
    return s
def feiticos(pages):
    """Feitiços em dois estilos: (A) '<NOME> ATAQUE DE X n [Alvo]' em um único token em negrito; (B) nome em negrito + linha 'ATAQUE DE X n'."""
    out=[];cur=None;pend=None
    def fecha():
        nonlocal cur
        if cur: out.append(cur); cur=None
    for pn,k,t in tokens(list(pages)):
        if k=='H': fecha(); pend=None; continue
        if k=='B':
            m=HDR.match(t)
            if m:
                fecha(); cur={"nome":_titulo(m.group(1)),"tipo":m.group(2).capitalize(),"trad":_titulo(m.group(3)),"grau":int(m.group(4)),"texto":(re.sub(r"[:\s]+$","",m.group(5))+": ") if m.group(5) else "","pag":pn}; pend=None; continue
            if cur is not None and re.match(ROT,t): cur["texto"]+=("\n" if cur["texto"] and not cur["texto"].endswith(": ") else "")+t+": "; continue
            if re.fullmatch(r"[A-ZÀ-ÚÇ0-9'’\- ,\.]{3,}",t) and not re.match(ROT,t): pend=t; 
            elif cur is not None: cur["texto"]+=("" if cur["texto"].endswith(": ") or not cur["texto"] else " ")+t
            continue
        # T
        m=HDR2.match(t) if pend else None
        if m:
            fecha(); cur={"nome":_titulo(pend),"tipo":m.group(1).capitalize(),"trad":_titulo(m.group(2)),"grau":int(m.group(3)),"texto":(re.sub(r"[:\s]+$","",m.group(4))+": ") if m.group(4) else "","pag":pn}; pend=None; continue
        if cur is not None: cur["texto"]+=("" if cur["texto"].endswith(": ") or not cur["texto"] else " ")+t
    fecha()
    res=[];ids=set()
    for s in out:
        i=slug(s["trad"]+"-"+s["nome"])
        if i in ids: continue
        ids.add(i)
        txt=re.sub(r"(:\s*){2,}",": ",re.sub(r"\s+"," ",s["texto"]).replace(" \n","\n")).strip()
        res.append({"id":i,"nome":s["nome"],"tipo":s["tipo"],"trad":s["trad"],"grau":s["grau"],"texto":txt,"_pag":s["pag"]})
    return res

def delta(txt):
    """'Força +1, Intelecto –1' -> {'forca':1,'intelecto':-1}"""
    r={}
    for k,v in re.findall(r"(Força|Agilidade|Intelecto|Vontade) ([+\-–−]\d+)",txt or ""): r[ATRN[k]]=int(v.translate(MENOS))
    return r
def cardelta(txt):
    r={};dados={}
    for k,v in re.findall(r"(Vida|Defesa|Percepção|Velocidade|Poder|Corrupção|Insanidade|Tamanho|Taxa de Cura) ([+\-–−]\d+(?:d\d+)?)",txt or ""):
        v=v.translate(MENOS)
        if "d" in v: dados[CARN[k]]=v.lstrip("+")
        else: r[CARN[k]]=int(v)
    return r,dados
def dedup(items,chave):
    v=set();out=[]
    for x in items:
        k=chave(x)
        if k in v: continue
        v.add(k);out.append(x)
    return out
def limpar(x):
    """Espaços antes de pontuação (resíduo de negrito inline) e parênteses."""
    if isinstance(x,str): return re.sub(r"\(\s+","(",re.sub(r"\s+([.,;:!?)])",r"\1",x))
    if isinstance(x,list): return [limpar(i) for i in x]
    if isinstance(x,dict): return {k:limpar(v) for k,v in x.items()}
    return x
def js_suplemento(sup,caminho):
    corpo=json.dumps(limpar(sup),ensure_ascii=False,indent=1)
    open(caminho,"w").write("/* Gerado por tools/ (ver SUPLEMENTOS.md). Não edite o texto de regras à mão: regenere a partir do PDF. */\nSDL.registrarSuplemento("+corpo+");\n")

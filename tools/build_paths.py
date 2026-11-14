import re, json
from extract_paths import run, kind
import os
_V=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"vocab.json")))
ENC={"lo","la","los","las","lhe","lhes","vivos","vivas","vivo","viva","feitiços","feitiço","chamas","costas","mestre","mestres"}
def _juntar(m):
    a,b,pt=m.group(1),m.group(2),m.group(3)
    h=_V.get((a+"-"+b).lower(),0); j=_V.get((a+b).lower(),0)
    if h>j or (h==0 and j==0 and b.lower() in ENC): return a+"-"+b+pt
    return a+b+pt
def clean(s):
    s=re.sub(r"([A-Za-zÀ-ú]+)(?:-\s+|\s+-\s+)([a-zà-ú]+)([^\sA-Za-zÀ-ú]*)",_juntar,s)
    s=re.sub(r"(:\s*){2,}",": ",s)
    return re.sub(r"\s+"," ",s).strip()
def tokens(pages):
    for pn,ws in run(pages):
        cur=None;buf=[]
        for w in ws:
            k=kind(w)
            if k!=cur:
                if buf: yield pn,cur,clean(" ".join(buf))
                cur=k;buf=[]
            buf.append(w['text'])
        if buf: yield pn,cur,clean(" ".join(buf))
SPECIAL={"Atributos","Características","Idiomas e Profissões"}
def parse(pages,tier):
    paths={};lvl=None;pending=None;lastpath=None
    for pn,k,t in tokens(pages):
        if k=='H':
            m=re.match(r"^(.*?)\s*(Especialista|Mestre)?\s*Nível\s*(\d+)$",t)
            if m:
                name=m.group(1).strip()
                for ex in paths:
                    if ex.lower()==name.lower(): name=ex
                if name==name.lower(): name=name.title().replace(' Das ',' das ')
                p=paths.setdefault(name,{"nome":name,"tier":tier,"niveis":{}})
                lvl={"nivel":int(m.group(3)),"atributos":None,"caracteristicas":None,"idiomas":None,"talentos":[]}
                p["niveis"][m.group(3)]=lvl;pending=None;lastpath=name
            else:
                pending=None
                if len(t)<40 and not re.match(r"^(Treinamento|Trilhas|Capítulo)",t):
                    lastpath=t;lvl=None
        elif k=='B' and lvl is not None:
            if t in SPECIAL: pending=t
            else: pending=t
        elif k=='T' and lvl is not None and pending:
            if pending=="Atributos": lvl["atributos"]=t
            elif pending=="Características": lvl["caracteristicas"]=t
            elif pending=="Idiomas e Profissões": lvl["idiomas"]=t
            else:
                if lvl["talentos"] and lvl["talentos"][-1]["nome"]==pending and False: pass
                lvl["talentos"].append({"nome":pending,"texto":t})
            pending=None
        elif k=='T' and lvl is None and lastpath and not pending:
            p=paths.setdefault(lastpath,{"nome":lastpath,"tier":tier,"niveis":{}})
            if not t.startswith("d6"): p["descricao"]=(p.get("descricao","")+" "+t).strip() if len(t)>25 or p.get("descricao") else p.get("descricao","")
        elif k=='T' and lvl is not None and not pending and lvl["talentos"]:
            lvl["talentos"][-1]["texto"]+=" "+t
    return paths
if __name__=="__main__":
    res={}
    for tier,pgs in (("novato",range(56,60)),("especialista",range(61,78)),("mestre",range(80,100))):
        res[tier]=parse(list(pgs),tier)
        print(tier,len(res[tier]),sorted(res[tier])[:60])
    json.dump(res,open("../data/_paths_raw.json","w"),ensure_ascii=False,indent=1)

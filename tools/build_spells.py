import re, json, collections
from build_paths import tokens
HDR=re.compile(r"^(?:Rolagem de Ataque \d+\+ )?([A-ZÀ-ÚÇ0-9'’\-\s,\.]+?)\s+(ATAQUE|UTILITÁRIO)\s+(?:(?:DE|DA|DO|DOS|DAS)\s+)?([A-ZÀ-ÚÇ\s\-]+?)\s+(\d+)\s*(.*)$")
def run(pages):
    spells=[];cur=None;trad=None
    for pn,k,t in tokens(pages):
        if k=='H': 
            if cur: spells.append(cur);cur=None
            trad=t; continue
        m=HDR.match(t) if k=='B' else None
        if m:
            if cur: spells.append(cur)
            cur={"nome":m.group(1).strip().title().replace(" De "," de ").replace(" Da "," da ").replace(" Do "," do ").replace(" Dos "," dos ").replace(" Das "," das ").replace(" E "," e ").replace(" Em "," em ").replace(" Para "," para ").replace(" A "," a ").replace(" O "," o "),"tipo":m.group(2).capitalize().replace("Utilitário","Utilitário"),"trad":m.group(3).strip().title(),"grau":int(m.group(4)),"campo":re.sub(r"[:\s]+$","",m.group(5) or ""),"pag":pn,"texto":(re.sub(r"[:\s]+$","",m.group(5))+": ") if m.group(5) else "","secao":trad}
        elif cur is not None:
            if k=='B' and re.match(r"^(Duração|Alvo|Área|Requisitos?|Gatilho|Ação|Efeito|Rolagem de Ataque 20\+|Sacrifício|Permanência|Desencadeada|Concentração)",t): cur["texto"]+=("\n" if cur["texto"] else "")+t+": "
            else: cur["texto"]+=("" if cur["texto"].endswith(": ") or not cur["texto"] else " ")+t
    if cur: spells.append(cur)
    return spells
if __name__=="__main__":
    sp=run(range(100,160))
    c=collections.Counter(s["trad"] for s in sp); print(len(sp),c)
    pg=collections.defaultdict(list)
    for s in sp: pg[s["trad"]].append(s["pag"])
    print({k:(min(v),max(v)) for k,v in pg.items()})
    json.dump(sp,open("/tmp/spells_raw.json","w"),ensure_ascii=False)

import subprocess,re,json
from build_paths import tokens
F="/mnt/user-data/uploads/SDL___-___Basico-Edicao-Revisada-v1_02.pdf"
txt=subprocess.run(["pdftotext","-f","105","-l","108","-layout",F,"-"],capture_output=True,text=True).stdout
pat=re.compile(r"([A-ZÀ-Úa-zà-ú][^\d—]*?(?:\([^)]*\))?[^\d—]*?)\s+(\d[\d\.]*\+?\s(?:cc|xp|co|trocados?)\+?|—)\s+(Comum|Incomum|Raro|Exótico|Permissão do MJ)")
rows=[]
for line in txt.split("\n"):
    for m in pat.finditer(re.sub(r"\s{3,}","   ",line)):
        nome=m.group(1).split("   ")[-1].strip()
        rows.append({"nome":nome,"preco":m.group(2),"disp":m.group(3)})
rows=[r for r in rows if len(r["nome"])>2]
# reparos
for r in rows:
    if r["nome"]=="Rede" and False: pass
fix={"pitões":"Martelo e 10 pitões","pessoas":"Tenda para 2 pessoas"}
for r in rows: r["nome"]=fix.get(r["nome"],r["nome"])
seen=set();out=[]
for r in rows:
    k=(r["nome"],r["preco"])
    if k in seen: continue
    seen.add(k); out.append(r)
mun=[("Flechas (5)","5 cc"),("Virotes (5)","5 cc"),("Projéteis e Pólvora (5)","1 xp"),("Dardo (5)","5 cc"),("Pedras (5)","5 cc")]
for n,pr in mun: out.append({"nome":n,"preco":pr,"disp":"","cat":"Munição"})
for r in out:
    r.setdefault("cat","Equipamento")
# Conjunto de aventureiro descrição
for r in out:
    if r["nome"]=="Conjunto de aventureiro": r["desc"]="Este conjunto inclui mochila, saco de dormir, conjunto de talheres, pederneira, tochas, arpéu, rações para uma semana e um cantil."
# poções e inscrições (tabelas de preço + descrições)
tb=[t for pn,k,t in tokens([109]) if k=='T' and t.startswith("Antitoxina 5 xp")][0]
precos={m.group(1).strip().lower():(m.group(2),m.group(3)) for m in re.finditer(r"([A-Za-zÀ-úçã ]+?) (\d+ (?:xp|co)) (Comum|Incomum|Raro|Exótico)",tb)}
desc={};cur=None
for pn,k,t in tokens([109,110]):
    if k=='H' and re.match(r"Poção (de |da |do )?",t) and t!="Poções": cur=t; desc[cur]=""
    elif k=='H': cur=None
    elif cur and k=='T': desc[cur]+=(" " if desc[cur] else "")+t
for h,d in desc.items():
    chave=re.sub(r"^Poção( (de|da|do))? ","",h).lower()
    pr=next((v for k,v in precos.items() if k==chave or k.startswith(chave) or chave.startswith(k)),("—",""))
    out.append({"nome":h,"preco":pr[0],"disp":pr[1],"cat":"Poção","desc":d})
ins=[t for pn,k,t in tokens([110]) if k=='T' and t.startswith("Grau 0")][0]
for m in re.finditer(r"Grau (\d+) ([\d\.]+ (?:xp|co)) (Incomum|Raro|Exótico|Permissão do MJ)",ins):
    out.append({"nome":f"Inscrição de feitiço de grau {m.group(1)}","preco":m.group(2),"disp":m.group(3),"cat":"Inscrição","desc":"Uma inscrição é magia em sua forma escrita. Você a usa lendo-a em voz alta, o que a consome (veja Usando Inscrições)."})
open("../js/data/itens.js","w").write("window.SDL=window.SDL||{};\n/* Equipamentos Pessoais, Munição e Poções (Cap. 6) — gerado por tools/build_equip.py */\nSDL.itens="+json.dumps(out,ensure_ascii=False,indent=0)+";\n")
print(len(out),[(o['nome'],o['preco'],o['disp']) for o in out if o['cat'] in ('Poção','Inscrição')])

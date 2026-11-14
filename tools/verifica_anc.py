import re,pickle,json,unicodedata,subprocess
p=pickle.load(open("/tmp/pages.pkl","rb"))
N=lambda s:re.sub(r"[^a-zà-ú0-9]","",unicodedata.normalize("NFC",s.lower()))
book=N(" ".join(p[10:26]))
out=subprocess.run(["node","-e","global.window=global;require('/home/claude/sdl/js/data/ancestralidades.js');console.log(JSON.stringify(SDL.ancestralidades))"],capture_output=True,text=True)
anc=json.loads(out.stdout)
bad=0
def chk(label,txt):
    global bad
    for s in re.split(r"(?<=[.!?])\s+",txt):
        if len(N(s))<12: continue
        if N(s) not in book: print("NÃO ENCONTRADO:",label,"|",s[:150]); bad+=1
for a in anc:
    chk(a["nome"]+" idiomas",a["idiomas"]); chk(a["nome"]+" desc",a["desc"])
    for t in a["talentos"]: chk(a["nome"]+"/"+t["n"],t["t"])
    chk(a["nome"]+" n4",a["nivel4"]["talento"]["t"]); chk(a["nome"]+" n4esc",a["nivel4"]["escolha"])
print("falhas",bad)

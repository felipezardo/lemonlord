"""Acrescenta ao vocab.json o vocabulário de um PDF (uso: python3 vocab_make.py arquivo.pdf).
O vocabulário decide se uma quebra de linha 'x- y' é hífen legítimo (ouvi-lo) ou só sílaba (pon-to)."""
import subprocess,sys,json,collections,os
pdf=sys.argv[1]
txt=subprocess.run(["pdftotext",pdf,"-"],capture_output=True,text=True).stdout
here=os.path.dirname(os.path.abspath(__file__)); caminho=os.path.join(here,"vocab.json")
v=collections.Counter(json.load(open(caminho)))
n=0
for pg in txt.split("\f"):
    for line in pg.split("\n"):
        ws=line.split()
        for i,w in enumerate(ws):
            if i==len(ws)-1 and w.endswith("-"): continue
            w=w.strip("“”\"'.,;:!?()[]•—").lower()
            if w: v[w]+=1; n+=1
json.dump(v,open(caminho,"w"),ensure_ascii=False)
print(os.path.basename(pdf),n,"palavras;",len(v),"no vocabulário")

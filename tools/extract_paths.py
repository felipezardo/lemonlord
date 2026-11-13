import pdfplumber, re, json, sys
F="/mnt/user-data/uploads/SDL___-___Basico-Edicao-Revisada-v1_02.pdf"
def cols(pg):
    # split page into 2 columns around the middle, reading order
    W=pg.width; return [(0,W/2),(W/2,W)]
def lines_of(pg, x0, x1):
    ws=[w for w in pg.extract_words(extra_attrs=["fontname","size"],keep_blank_chars=False) if x0<=w['x0']<x1 and 40<w['top']<740]
    ws.sort(key=lambda w:(round(w['top']/3),w['x0']))
    return ws
def kind(w):
    fn=w['fontname']
    if 'PoisonHope' in fn: return 'H'
    if 'Bold' in fn: return 'B'
    return 'T'
def run(pages):
    out=[]
    for pn in pages:
        with pdfplumber.open(F) as pdf:
            pg=pdf.pages[pn-1]
            for (a,b) in cols(pg):
                ws=lines_of(pg,a,b)
                out.append((pn,ws))
    return out
if __name__=="__main__":
    pn=int(sys.argv[1])
    for pn_,ws in run([pn]):
        buf=[];cur=None
        for w in ws:
            k=kind(w)
            if k!=cur:
                buf.append(f"\n[{k}] ");cur=k
            buf.append(w['text']+" ")
        print("".join(buf)); print("-----COL-----")

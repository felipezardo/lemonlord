import json,re
from build_paths import tokens
parts=[];on=False
for pn,k,t in tokens([61]):
    if k=='H' and t=="Escolhendo uma Trilha de Especialista Secundária": on=True; continue
    if not on: continue
    if k=='H': parts.append("\n\n"+t+"\n")
    elif k=='B': parts.append("\n• "+t+" ")
    else: parts.append((" " if parts and not parts[-1].endswith(("\n"," ")) else "")+t)
txt="".join(parts)
txt=re.sub(r"\s*•\s*(?=(Aumente|Descubra|Aprenda|Você ganha os benefícios))","\n• ",txt)
txt=re.sub(r"\n• \n","\n",txt)
txt=txt.replace("indicados. •","indicados.")
txt=re.sub(r" •(?=\n|$)","",txt).replace("\n• \n• ","\n• ")
open("../js/data/regras.js","w").write("window.SDL=window.SDL||{};\n/* Regras citadas do Livro Básico (p. 60, Trilhas de Especialista). */\nSDL.regras="+json.dumps({"secundaria":txt.strip()},ensure_ascii=False,indent=1)+";\n")
print(txt)

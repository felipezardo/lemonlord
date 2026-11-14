# Ficha de Personagem — Shadow of the Demon Lord (Livro Básico, Edição Revisada)

Abra `index.html` no navegador (funciona offline; as fontes web são opcionais). Fichas ficam salvas no navegador (localStorage): use **Exportar** para backup e **Importar** para restaurar/compartilhar.

## Estrutura
- `js/data/ancestralidades.js` — ancestralidades (`SDL.ancestralidades`)
- `js/data/trilhas.js` — Trilhas de Novato, Especialista e Mestre (`SDL.trilhas`)
- `js/data/equipamento.js`, `profissoes.js` — armas, armaduras, itens, profissões
- `js/data/magias.js` — tradições, feitiços, conjurações, religiões
- `js/data/efeitos.js` — talentos com efeito automático nas rolagens, tradições e aflições
- `js/core.js` (cálculo automático, armazenamento, dados), `rolagens.js`, `retrato.js`, `sheet.js`, `home.js`, `app.js`
- `tools/` — scripts Python usados para extrair as trilhas do PDF (pdfplumber)

## Como adicionar suplementos
**Ancestralidade:** acrescente um objeto em `SDL.ancestralidades` (ver `anao` como modelo): `atr`, `percepcao`, `vidaBonus`, `tamanho`, `velocidade`, `talentos[]`, `nivel4{car, escolha, talento}`. Campos opcionais: `escolhaAtributo:1`, `defesaFixa`.
**Trilha:** acrescente em `SDL.trilhas` (em um novo arquivo `js/data/suplemento-x.js` com `SDL.trilhas.push(...)`, carregado em `index.html` após `trilhas.js`):
`{id,nome,tier:"novato|especialista|mestre",desc,niv:{"3":{n:3,esc:2,car:{vida:5,defesa:1},idi:"texto",tal:[{n:"Nome",t:"Texto"}]}}}`
`esc` = quantos atributos o jogador escolhe aumentar em 1; `car` aceita vida, defesa, percepcao, velocidade, poder, cura, corrupcao, insanidade.
**Efeito automático em rolagens:** adicione o nome do talento em `SDL.efeitos` (`quando`: ataque-arma, ataque, desafio, dano-arma; `dadivas`, `extra`, `auto`).

## Magia (v1.1)
- `js/data/magias.js`: 30 tradições (atributo associado e magia das trevas), 330 feitiços (graus 0–10), 8 feitiços exclusivos de trilha, tabela de Conjurações por Poder, religiões e as listas de talentos de escolha (Sagaz, Gatuno, Lutador).
- As trilhas concedem tradições/feitiços automaticamente (campo `mag` em cada nível: `obrig`, `esc`, `restr`, `solo`, `rel`; campo `feit` para feitiço de trilha). O Poder e as conjurações por grau são calculados; descanso restaura conjurações.
- Magia das trevas: +1 Corrupção ao descobrir a tradição e teste de d6 ao aprender feitiços.
- Efeitos de talentos: `SDL.efeitos` (manual) tem prioridade; os demais são inferidos do texto (dádivas em ataque/desafio, dano extra) e aparecem como opções nas janelas de rolagem.

## Fidelidade textual
Todos os textos de regras (ancestralidades, trilhas, talentos, feitiços, poções, inscrições, regra de trilha secundária) são extraídos do PDF por scripts em `tools/` e conferidos por auditoria de letras (`tools/audit2.py`, `tools/verifica_anc.py`). Tabelas de equipamento foram conferidas visualmente contra as páginas do livro. A remoção de hifenização usa o vocabulário do próprio livro (`tools/vocab.json`) para preservar hifens legítimos (ex.: "ouvi-lo", "mortas-vivas").

## Automação (v1.2)
- Concessões de magia viram "vagas" com restrições reais (tradição fixa da trilha, tradição da religião, só feitiço, só tradição); o app só permite aprender o que se encaixa.
- Penalidades de armadura (Força insuficiente: 1 revés em Força/Agilidade e −2 de Velocidade), requisito de arma e arma Incômoda aplicam reveses automaticamente.
- Trilha de especialista secundária (no lugar da trilha de mestre), com escolha do nível 9 e tratamento de talentos repetidos.
- Talentos: efeitos inferidos do texto aparecem como opções nas rolagens; na janela do talento é possível marcar "Aplicar sempre" e "Aplicar bônus à ficha" (para bônus em Defesa, Percepção, Velocidade, Vida, Poder).

## Regenerar dados do PDF
`cd tools && python3 build_paths.py && python3 export_trilhas.py && python3 build_magias.py && python3 build_anc.py && python3 build_equip.py && python3 build_regras.py` (requer pdfplumber, poppler e o PDF; ajuste o caminho em `tools/extract_paths.py`; `vocab.json` é gerado a partir de `pdftotext`).

## Limitações conhecidas
Condições situacionais de talentos (ex.: "quando exceder o número-alvo em 5") continuam sob decisão do jogador, mas ficam disponíveis como opções marcáveis. Feitiços do Grimório do Mago e criaturas/companheiros (ex.: Eidolon) aparecem como texto, sem ficha própria.

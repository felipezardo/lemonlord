# Ficha de Personagem — Shadow of the Demon Lord (Livro Básico, Edição Revisada)

Abra `index.html` no navegador (funciona offline; as fontes web são opcionais). Fichas ficam salvas no navegador (localStorage): use **Exportar** para backup e **Importar** para restaurar/compartilhar.

## Estrutura
- `js/data/ancestralidades.js` — ancestralidades (`SDL.ancestralidades`)
- `js/data/trilhas.js` — Trilhas de Novato, Especialista e Mestre (`SDL.trilhas`)
- `js/data/equipamento.js`, `profissoes.js` — armas, armaduras, itens, profissões
- `js/data/efeitos.js` — talentos com efeito automático nas rolagens, tradições e aflições
- `js/core.js` (cálculo automático, armazenamento, dados), `rolagens.js`, `retrato.js`, `sheet.js`, `home.js`, `app.js`
- `tools/` — scripts Python usados para extrair as trilhas do PDF (pdfplumber)

## Como adicionar suplementos
**Ancestralidade:** acrescente um objeto em `SDL.ancestralidades` (ver `anao` como modelo): `atr`, `percepcao`, `vidaBonus`, `tamanho`, `velocidade`, `talentos[]`, `nivel4{car, escolha, talento}`. Campos opcionais: `escolhaAtributo:1`, `defesaFixa`.
**Trilha:** acrescente em `SDL.trilhas` (em um novo arquivo `js/data/suplemento-x.js` com `SDL.trilhas.push(...)`, carregado em `index.html` após `trilhas.js`):
`{id,nome,tier:"novato|especialista|mestre",desc,niv:{"3":{n:3,esc:2,car:{vida:5,defesa:1},idi:"texto",tal:[{n:"Nome",t:"Texto"}]}}}`
`esc` = quantos atributos o jogador escolhe aumentar em 1; `car` aceita vida, defesa, percepcao, velocidade, poder, cura, corrupcao, insanidade.
**Efeito automático em rolagens:** adicione o nome do talento em `SDL.efeitos` (`quando`: ataque-arma, ataque, desafio, dano-arma; `dadivas`, `extra`, `auto`).

## Limitações da v1
Lista de feitiços por tradição e feitiços exclusivos de trilhas não foram importados (registro manual na aba Magia). Só alguns talentos têm efeito automático nas rolagens; os demais são exibidos como texto.

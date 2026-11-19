# Padrão para incorporar suplementos

Este documento é o contrato de trabalho para adicionar qualquer suplemento (ancestralidades, trilhas, feitiços, equipamento…) ao site. Quem for incorporar um suplemento (inclusive o próprio Claude) deve seguir **todos** os passos, na ordem, e entregar o checklist final preenchido.

## 1. Princípios inegociáveis
1. **Fidelidade textual.** Todo texto de regra vem do PDF, extraído por script, sem paráfrase, resumo ou “correção” de redação. Só se normaliza: hifenização de quebra de linha, espaços e `": :"`.
2. **Termos oficiais.** Usar os termos do próprio livro (Ancestralidade, Trilha de Novato/Especialista/Mestre, Talentos, Vida, Taxa de Cura, Poder, Corrupção, Insanidade, dádiva/revés, tradição, feitiço, conjuração…). Nunca traduzir ou renomear por conta própria.
3. **Nada é bloqueado.** O site avisa (Alerta/Nota/Pendente), não impede. Restrições do livro viram vagas/avisos, não botões desabilitados.
4. **Nada inventado.** Se um dado não está no PDF (preço, requisito, disponibilidade), fica ausente e é registrado no relatório; não se completa de memória.
5. **Modularidade.** Um suplemento = um arquivo `js/data/suplementos/<id>.js` + uma linha em `indice.js`. Nenhum dado de suplemento vai para os arquivos do livro básico.
6. **Verificação antes de entregar.** `node tools/validar.js` sem erros, auditoria de letras zerada, conferência visual das tabelas e testes de interface (ver §6).

## 2. Fluxo (passo a passo)
1. **Inventário.** Listar páginas por tipo de conteúdo (ancestralidades, trilhas por tier, tradições/feitiços, equipamento, regras novas). Anotar páginas com layouts diferentes (3 colunas, tabelas, quadros laterais). Confirmar que **todas** as páginas do intervalo foram incluídas (no básico, a p. 80 ficou fora e sumiram 2 trilhas).
2. **Escolher `id` e `abreviacao`.** `id` em minúsculas/hífen (`a-z0-9-`); `abreviacao` curta (aparece como “Fonte: …” nos cartões).
3. **Extrair com os scripts de `tools/`** usando `SDL_PDF=<caminho>`:
   - `extract_paths.py` / `build_paths.py` — leitura por fonte (títulos = `PoisonHope`, nomes de talento = `*Bold*`), agrupamento de linhas por tolerância de `top` (≈3,2 pt) e colunas por metade da página. **Ajustar os intervalos de página no topo de cada script ou por parâmetro.**
   - `export_trilhas.py` — converte níveis em `{n, esc, car, idi, tal, mag, feit}`.
   - `build_anc.py`, `build_magias.py`, `build_equip.py`, `build_regras.py` — ancestralidades, magias, equipamento, regras citadas.
   - Gerar o `vocab.json` (vocabulário do livro) a partir do PDF do suplemento para a dehifenização (`ouvi-lo` mantém hífen; `pon-to` junta).
4. **Auditar a extração** (obrigatório):
   - `audit2.py`: letras do PDF × letras dos dados → déficit **zero** (excedente = rótulos inseridos).
   - Listar tokens do PDF ausentes dos dados (ver script no histórico do projeto: comparar `N(token) in N(dados)`); cada ausência deve ser justificada (lore, tabela de história, introdução) ou corrigida.
   - **Conferir visualmente** (renderizar a página) toda tabela transcrita: armas, armaduras, preços, requisitos, disponibilidade, conjurações, religiões. Tabelas em colunas costumam quebrar a leitura automática.
5. **Montar o arquivo do suplemento** a partir de `js/data/suplementos/_modelo.js`. Preencher só o que existe. Marcar `fonte` não é necessário (é aplicado pela abreviação).
6. **Registrar** em `indice.js`.
7. **Validar:** `node tools/validar.js` (0 erros; avisos justificados) e rodar os testes de interface (§6).
8. **Relatório final** com: páginas cobertas, contagens (ancestralidades/trilhas/feitiços/itens), avisos do validador e o que não foi automatizado e por quê.

## 3. Esquemas de dados (resumo — o validador é a referência)
| Tipo | Campos obrigatórios | Observações |
|---|---|---|
| Ancestralidade | `id, nome, desc, atr{forca,agilidade,intelecto,vontade}, percepcao, vidaBonus, tamanho[], velocidade, corrupcao, insanidade, idiomas, talentos[{n,t}], nivel4{car,escolha,talento{n,t}}` | `escolhaAtributo:1` (+1 em um atributo), `defesaFixa`, `talentos[].escolha{rotulo,opcoes[]}` (lista de uma tabela do livro) |
| Trilha | `id, nome, tier, desc, niv{"N":{n,esc,car,idi,tal[]}}` | Níveis padrão: novato 1,2,5,8 · especialista 3,6,9 · mestre 7,10. Divergência gera aviso. |
| Concessão de magia (`niv.mag`) | `obrig` (nº de tradições obrigatórias), `esc` (nº de escolhas), `restr[]`, `solo`, `rel` | `solo`=só feitiço; `rel`=tradição da religião; `restr`=apenas estas tradições |
| Feitiço de trilha | `feit:"id"` no nível + objeto em `feiticosTrilha` | concedido automaticamente |
| Tradição | `{nome, atr:"intelecto|vontade", trevas}` | trevas = magia das trevas (Corrupção) |
| Feitiço | `{id, nome, tipo:"Ataque|Utilitário", trad, grau, texto}` | `id = <tradição>-<nome>` em slug |
| Arma | `{id,nome,dano,maos,prop,preco,disp,cat,req,reqN,reqAtr}` | `dano` precisa ser expressão (`1d6+1`); `reqAtr:"forca|ambos"` |
| Armadura | `{id,disp,nome,tipo,def | base:"agi"+bonus,preco,req}` | `req` = Força exigida |
| Item | `{nome,preco,disp,cat,desc?}` | descrições verbatim |
| Talento de escolha | `talentosEscolha.<tipo>[{n,t}]` | e registrar o tipo em `TE` (core.js) com o nº de escolhas |

### 3.1 Extensões do esquema (criadas a partir de Tumbas da Desolação)
| Recurso | Como usar |
|---|---|
| **Sobreposição de ancestralidade** (ex.: Regresso, Vampiro) | `tipo:"sobreposicao"`, `base:[ids]`, `atrDelta{}`, `carDelta{}` (somas fixas), `dados{insanidade:"1d3",corrupcao:"1d3"}` (rolados ao escolher), `talentos[]`, `intro`, `nivel4{car,escolha,opcoes:["feitico","talento","base"],talento}` (`base` = traço de especialista da outra ancestralidade). Aparece em “Sobreposições” na janela de Ancestralidade. |
| Cura fixa | `curaFixa:0` na ancestralidade/sobreposição (só quando o texto diz que a taxa de cura é fixa; o gerador confere a frase). |
| **Recursos** | `recursos:[{id,nome,max:"1+nivel",inicio}]` (expressão com `nivel`/`poder`) → contador na ficha. |
| Requisito de trilha | `requer:"Vampiro"` (extraído de “você precisa ser um …”). Gera aviso, não bloqueia. |
| Tradição menor / atributo duplo | `{nome,atr:"ambos",menor:true,grauMax:3,nota:<texto verbatim>}`; com `ambos` o site usa o melhor modificador entre Intelecto e Vontade. |
| Lore | `lore:[{t,x}]` com seções descritivas/regras da ancestralidade (texto verbatim, exceto tabelas aleatórias). |
| Item sem preço (relíquias) | `{nome,preco:"—",disp:"Relíquia",cat:"Relíquia",desc}` |

## 4. Regras de automação (o que codificar e como)
**Sempre codificar (automático):** atributos (`esc`), características numéricas (`car`: vida, defesa, percepcao, velocidade, poder, cura, corrupcao, insanidade, tamanho), talentos listados, idiomas/profissões (texto), concessões de magia (`mag`), feitiços de trilha (`feit`), requisitos de armadura/arma, Defesa de armadura.

**Talentos nas rolagens:** o motor infere do texto (`rolagens.js → inferir`): dádivas em rolagens de ataque/desafio, `NdM de dano extra`, `dano extra igual ao seu Poder`. Resultado = opção **marcável** na janela de rolagem (com botão “i”). Regras:
- Só criar entrada manual em `efeitos` quando (a) o efeito é incondicional (usar `auto:true`) **e** verificado no texto, ou (b) a inferência erra. Nunca inventar `rotulo` com condições que não estão no texto.
- Frases em que a dádiva é *condição* (ex.: “quando você faz uma rolagem de ataque com 1 dádiva … 1d6 de dano extra”) não geram dádiva — já tratado pelo motor; conferir amostras.
- Bônus fixos (`+N em Defesa/Percepção/Velocidade/Vida/Poder`) viram caixa “Aplicar bônus à ficha” na janela do talento; só vão para `car` quando o livro os lista em **Características** do nível.

**Usos:** talentos cujo texto contém “descanso” ganham marcas de uso (1, ou N se “vezes igual ao seu Poder”). Conjurações seguem a tabela por Poder (`SDL.conjuracoes`).

**Não automatizar (deixar como texto):** condições situacionais, criaturas/companheiros (incluir estatísticas no texto do talento), escolhas livres do Mestre. Registrar no relatório.

## 5. Padrões de interface (manter a identidade visual)
- Texto longo nunca aparece solto em listas: usar **cartão uniforme + tela de detalhes** (como em Trilhas e Ancestralidades) ou **“i” + texto recolhível**; o `title` serve só de complemento no desktop.
- Seleções reversíveis alternam rótulo e estado no lugar (sem recarregar): “Vestir/Tirar”, “Equipar/Retirar”, marcas de uso.
- Nada de emojis ou ícones decorativos; ícones lineares simples. Bordas em tinta vermelha (`filter: url(#tinta)` / `#rugoso`), cantos retos, animações curtas respeitando `prefers-reduced-motion`.
- Avisos nunca bloqueiam; usar `calc.avisos` (`alerta`, `nota`, `pendente`).

## 6. Checklist de entrega
- [ ] Páginas do suplemento 100% cobertas (lista de páginas × conteúdo).
- [ ] `SDL_PDF=… python3 tools/audit2.py` → déficit 0 para cada bloco.
- [ ] Tabelas conferidas visualmente (anexar quais páginas).
- [ ] `node tools/validar.js` → 0 erros; avisos explicados.
- [ ] Testes de interface: criar ficha com cada ancestralidade/trilha nova; conferir benefícios por nível, escolhas pendentes, concessões de magia (restrições), feitiços de trilha, talentos com marcas de uso, rolagem com opções do talento, modal “i”, layout no celular (390 px).
- [ ] Fonte aparece como “Fonte: <abreviação>” nos cartões.
- [ ] README/relatório com contagens e pendências.
- [ ] Gerar novo `sdl-ficha.zip` e incrementar a versão no arquivo do suplemento.

## 6.1 Ferramentas de extração para suplementos
- `tools/vocab_make.py <pdf>` — acrescenta o vocabulário do suplemento ao `vocab.json` (rode antes de extrair).
- `tools/sup_lib.py` — `trilhas(páginas)`, `feiticos(páginas)` (aceita os dois estilos de cabeçalho), `pares`, `delta`, `cardelta`, `js_suplemento`.
- `tools/sup_<id>.py` — script do suplemento (modelo: `sup_tumbas.py`); escreve `js/data/suplementos/<id>.js`.
- `tools/audit_sup.py <js> <ini-fim>…` — lista trechos do PDF que não estão no arquivo gerado (cada um deve ser justificado: título, tabela aleatória, aventura/criatura, ou corrigido).
- `relatorios/<id>.md` — relatório do suplemento (cobertura, contagens, não incluído, pendências).

## 7. Armadilhas já encontradas (não repetir)
- Negrito no meio de frase (`…o talento **Beber Sangue** (veja a seguir)`) vira falso talento: tratar como texto contínuo (`fundir_inline`).
- Feitiço de trilha dentro do texto de um nível (`ASSOLAR … Requisitos/Área/Duração`) não pode virar talentos; extrair à parte em `feiticosTrilha`.
- Descrições de trilha podem receber a tabela “Desenvolvimento da História” (linhas que começam com número): filtrar.
- Dois estilos de cabeçalho de feitiço (um token único ou nome + linha “ATAQUE DE X n”): conferir contagem por página.
- Intervalo de páginas incompleto (p. 80) → trilhas ausentes.
- Colunas/linhas misturadas quando se ordena por `round(top/3)`; usar agrupamento por tolerância.
- Remover todos os hífens de quebra apaga hifens legítimos (`ouvi-lo`, `mortas-vivas`).
- Texto digitado de memória/paráfrase em dados “óbvios” (ancestralidades, preços, listas de Ódio): sempre extrair e verificar.
- Tabelas de equipamento em colunas: validar visualmente.
- Blocos de estatísticas (Eidolon, Forma de Objeto) fora do fluxo normal: anexar ao talento correspondente.
- Rótulos em negrito consecutivos fundem tokens (`Características Magia`): tratar na exportação.
- Nomes de classes CSS/JS colidindo (`.dado`, `.vazio`): prefixar.

# Relatório — Tumbas da Desolação (43 págs.)
Arquivo: `js/data/suplementos/tumbas-da-desolacao.js` · gerador: `tools/sup_tumbas.py` · fonte exibida: “Tumbas da Desolação”.

## Incluído
| Conteúdo | Páginas | Itens |
|---|---|---|
| Ancestralidades | 5–12 | **Salamandra** (padrão); **Regresso** e **Vampiro** (sobreposições a humano/anão/orc e humano), com talentos, nível 4 e seções de regra (`lore`) |
| Trilhas | 13–15 | **Príncipe das Trevas** (Especialista, requer Vampiro); **Andarilho do Pó**, **Assolador**, **Matador de Mortos** (Mestre) |
| Tradição nova | 16 | **Sangue** (tradição menor, até grau 3, Intelecto ou Vontade) — 5 feitiços |
| Feitiços em tradições existentes | 16–18 | Água, Ar (3), Celestial, Maldição, Necromancia (Liche), Proteção, Terra |
| Feitiço de trilha | 15 | Assolar (Assolador, concedido pelo nível 7) |
| Relíquias | 26–27 | Caldeirão da Morte, Cota de Sangue, Flecha de Osso, Manto do Atormentador (itens, texto integral) |

## Automatizado
- Sobreposições: deltas de atributo/Defesa/Percepção/Velocidade; Insanidade/Corrupção rolados ao escolher; nível 4 com 3 opções (Regresso) ou fixo (Vampiro).
- Vampiro: taxa de cura fixa em 0 (texto de “Existência Antinatural” conferido) e contador de **pontos de sangue** (máx. 1 + nível; começa em 1).
- Trilhas: atributos, características, talentos, concessões de magia (com restrição “apenas Ar ou Terra” do Andarilho do Pó), feitiço de trilha.
- Requisito “precisa ser vampiro”: aviso na ficha.
- Tradição Sangue: usa o melhor modificador entre Intelecto e Vontade.

## Não incluído (justificado)
- Tabelas aleatórias de história/aparência/medos (Regresso, Vampiro, trilhas) e “coisas interessantes”.
- Criaturas, descrição da terra e demais capítulos voltados ao Mestre.

## Para você conferir
1. Vampiro: o texto de “Reserva de Sangue”, “Torpor” e “Beber Sangue” é cheio de regras que o site só mostra como texto (a penalidade de Vida por sede não é calculada).
2. Regresso: “Retornando dos Mortos” está como seção de leitura (regra opcional).
3. Nível 4 (Vida lida do PDF): Salamandra +5, Regresso +6, Vampiro +6.

## Correções no livro básico feitas durante este trabalho
- 4 trilhas (Ata-feitiços, Feiticeiro, Furtomante, Patrulheiro) tinham texto da tabela “Desenvolvimento da História” colado na descrição: corrigido.
- ~13 níveis tinham falsos “talentos” criados por negrito no meio de frases (“Capítulo 6”, “Tradições Religiosas”, “construtos pequenos”…) e rótulos de feitiço de trilha (“Duração”): removidos; espaços antes de pontuação limpos.

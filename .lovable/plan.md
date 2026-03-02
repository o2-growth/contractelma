

# Melhorar formatação do PDF gerado

## Situação
O PDF está sendo gerado como texto puro -- sem negrito, sem tabelas formatadas, sem hierarquia visual. As tabelas markdown aparecem como pipes (`|`) e as linhas horizontais como `---`.

## Abordagem
Não precisa criar template no Autentique. Vamos melhorar o `generateSimplePdf` no edge function para produzir um PDF com formatação visual adequada.

## Mudanças em `supabase/functions/send-to-autentique/index.ts`

Reescrever o gerador de PDF para suportar:

1. **Títulos (H1/H2)**: Renderizar em fonte maior (14-16pt) e bold (`Helvetica-Bold`)
2. **Negrito**: Detectar `**texto**` e alternar para `Helvetica-Bold` inline
3. **Tabelas**: Parsear linhas com `|` e renderizar como tabela com bordas (retângulos PDF) e colunas alinhadas
4. **Linhas horizontais** (`---`): Desenhar uma linha (`stroke`) ao invés de texto
5. **Bullet points**: Já funciona parcialmente, manter o `•` mas com indentação correta
6. **Espaçamento**: Adicionar mais espaço antes de títulos e entre seções

### Recursos PDF necessários
- Registrar duas fontes: `/F1` (Helvetica) e `/F2` (Helvetica-Bold)
- Usar operadores `re` (retângulo) e `S` (stroke) para bordas de tabela
- Usar operador `l` + `S` para linhas horizontais

### Redeploy
Após as mudanças, redeployar a edge function.


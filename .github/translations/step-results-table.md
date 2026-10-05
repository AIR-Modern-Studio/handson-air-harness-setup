{%- set all_passed = (results_table | selectattr("passed") | length) == (results_table | length) %}

{%- if all_passed %}

## Passo {{ step_number }} · Aprovado ✅

{%- else %}

## Passo {{ step_number }} · Ainda não ❌

{%- endif %}

{%- if all_passed %}
{%- else %}

Algumas verificações não passaram. Veja a tabela e as dicas, ajuste e faça um novo push.


{%- endif %}
{%- if agent_label %}

Agente: **{{ agent_label }}** · pacote: `{{ package_dir }}/`
{%- endif %}

| Status | Descrição |
| ------ | --------- |

{%- for row in results_table %}
| {% if row.passed -%}✅ - OK{%- else -%}❌ - Falhou{%- endif %} | {{ row.description | safe }} |
{%- endfor %}

{%- if tips and tips.length %}

### Dicas

{%- for tip in tips %}

- {{ tip | safe }}
  {%- endfor %}

{%- endif %}

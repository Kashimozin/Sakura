# SAKURA · E-commerce Premium

Loja virtual de moda feminina premium inspirada nas flores de cerejeira japonesas.
100% HTML, CSS e JavaScript puros — sem frameworks, sem build.

## ✿ Como usar

Abra o arquivo `index.html` no navegador (ou sirva com um servidor local):

```bash
cd sakura
python3 -m http.server 8080
# acesse http://localhost:8080
```

## ✿ Estrutura

```
sakura/
├── index.html          # Home (Hero, Vitrine, Carrossel, Sobre, Newsletter, Footer)
├── style.css           # Design system completo
├── script.js           # Pétalas, filtros, carrossel, modal PIX, Sakura AI
├── pages/
│   └── produto.html    # Página individual do produto
└── assets/
    ├── img/            # Fotos de produtos, hero, árvore, pétala
    └── icons/
```

## ✿ Recursos

- 🌸 **Pétalas caindo** — animação em canvas com efeito de vento
- 🌸 **Sakura AI** — assistente virtual com base de conhecimento (tamanhos, frete, trocas...)
- 🌸 **Modal PIX** — QR Code + Copia e Cola
- 🌸 **Filtros dinâmicos** — por categoria
- 🌸 **Carrossel** — drag no mouse/dedo + setas
- 🌸 **Responsivo** — desktop, tablet e celular
- 🌸 **Menu lateral animado** no mobile
- 🌸 **Scroll Reveal** com IntersectionObserver
- 🌸 **Glassmorphism** e micro-animações premium

## ✿ Paleta

| Cor | Hex |
|---|---|
| Rosa Sakura | `#F7B8C9` |
| Rosa Claro | `#FFD8E5` |
| Off-white | `#FAF8F6` |
| Cinza Escuro | `#555555` |

## ✿ Expansão

O array `PRODUCTS` em `script.js` é a fonte de dados — basta adicionar novos objetos
para incluir produtos. A base de conhecimento da Sakura AI (`KB`) também é facilmente
extensível.

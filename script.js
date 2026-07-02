/* =========================================================
   SAKURA · script.js
   - Pétalas caindo (canvas)
   - Nav / Drawer / Reveal
   - Catálogo + Filtros + Carrossel
   - Modal PIX
   - Sakura AI
   ========================================================= */

/* -------- Dados de produtos (mock, expansível) -------- */
const PRODUCTS = [
  { id:1, name:"Vestido Seda Blossom", cat:"vestidos",   price:589,  old:749, img:"assets/img/product-1.jpg", sizes:["PP","P","M","G"], color:"Rosa", stock:12, rating:5, tag:"NOVO"    },
  { id:2, name:"Conjunto Alfaiataria Cream", cat:"alfaiataria", price:749, img:"assets/img/product-2.jpg", sizes:["P","M","G","GG"], color:"Off-white", stock:5, rating:5, tag:"BEST"   },
  { id:3, name:"Blazer Oversized Rose",  cat:"blazers",   price:659,  img:"assets/img/product-3.jpg", sizes:["P","M","G"], color:"Rosa Sakura", stock:2, rating:4, tag:"LIMITADO" },
  { id:4, name:"Vestido Midi Onyx",      cat:"vestidos",  price:499,  img:"assets/img/product-4.jpg", sizes:["PP","P","M","G"], color:"Preto", stock:18, rating:5 },
  { id:5, name:"Saia Plissada Petal",    cat:"saias",     price:389,  old:499, img:"assets/img/product-5.jpg", sizes:["P","M","G"], color:"Rosa Claro", stock:8, rating:4, tag:"SALE" },
  { id:6, name:"Kimono Sakura Edition",  cat:"signature", price:1290, img:"assets/img/product-6.jpg", sizes:["Único"], color:"Floral", stock:0, rating:5, tag:"SIGNATURE" },
  { id:7, name:"Vestido Cerejeira",      cat:"vestidos",  price:699,  img:"assets/img/product-1.jpg", sizes:["P","M","G"], color:"Rosa", stock:6, rating:5 },
  { id:8, name:"Terninho Sakura",        cat:"alfaiataria", price:899, img:"assets/img/product-2.jpg", sizes:["P","M","G"], color:"Bege", stock:9, rating:4 },
];

/* -------- Utilidades -------- */
const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

/* =========================================================
   1. PÉTALAS CAINDO
   ========================================================= */
(function petals(){
  const c = $("#petals-canvas");
  const ctx = c.getContext("2d");
  let W,H,petals=[];
  const img = new Image(); img.src = "assets/img/petal.png";

  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
  addEventListener("resize", resize); resize();

  function Petal(){
    this.x = Math.random()*W;
    this.y = Math.random()*-H;
    this.s = 14 + Math.random()*22;
    this.vy = .5 + Math.random()*1.2;
    this.vx = -.4 + Math.random()*.8;
    this.a  = Math.random()*Math.PI*2;
    this.va = -.02 + Math.random()*.04;
    this.o  = .4 + Math.random()*.5;
    this.sway = Math.random()*2;
  }
  Petal.prototype.step = function(t){
    this.y += this.vy;
    this.x += this.vx + Math.sin((t+this.sway)*.001)*.6;
    this.a += this.va;
    if(this.y>H+40){ this.y = -20; this.x = Math.random()*W; }
  };
  Petal.prototype.draw = function(){
    ctx.save();
    ctx.globalAlpha = this.o;
    ctx.translate(this.x,this.y);
    ctx.rotate(this.a);
    if(img.complete) ctx.drawImage(img,-this.s/2,-this.s/2,this.s,this.s);
    ctx.restore();
  };
  for(let i=0;i<28;i++) petals.push(new Petal());

  function loop(t){
    ctx.clearRect(0,0,W,H);
    petals.forEach(p=>{p.step(t);p.draw();});
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* =========================================================
   2. NAV + DRAWER + SCROLL
   ========================================================= */
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40));

const drawer  = $("#drawer");
const overlay = $("#overlay");
const openDrawer  = () => { drawer.classList.add("open"); overlay.classList.add("on"); };
const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("on"); };
$("#burger").addEventListener("click", openDrawer);
overlay.addEventListener("click", closeDrawer);
$$("#drawer a").forEach(a=>a.addEventListener("click", closeDrawer));

/* Reveal on scroll */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} });
},{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

/* =========================================================
   3. CATÁLOGO + FILTROS
   ========================================================= */
const grid = $("#products-grid");

function stockLabel(s){
  if(s === 0) return `<div class="stock out">Esgotado</div>`;
  if(s <= 3) return `<div class="stock low">Últimas ${s} unidades</div>`;
  return `<div class="stock ok">Disponível</div>`;
}
function stars(n){ return "★".repeat(n) + "☆".repeat(5-n); }

function renderProducts(filter="all"){
  grid.innerHTML = PRODUCTS
    .filter(p => filter==="all" || p.cat===filter)
    .map(p=>`
      <article class="product reveal" data-id="${p.id}">
        <div class="product-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          ${p.tag ? `<span class="product-badge ${p.tag==='SALE'?'sale':''}">${p.tag}</span>` : ""}
          <div class="product-actions">
            <button title="Favoritar">♡</button>
            <button title="Visualizar">👁</button>
          </div>
        </div>
        <div class="product-info">
          <span class="cat">${p.cat}</span>
          <h3>${p.name}</h3>
          <div class="price">
            ${money(p.price)}
            ${p.old ? `<span class="old">${money(p.old)}</span>` : ""}
          </div>
          <div class="stars">${stars(p.rating)}</div>
          ${stockLabel(p.stock)}
          <div class="sizes">${p.sizes.map(s=>`<span>${s}</span>`).join("")}</div>
          <div class="product-buttons">
            <button class="btn-buy"  ${p.stock===0?"disabled style='opacity:.5;cursor:not-allowed'":""} onclick="buyProduct(${p.id})">Comprar</button>
            <button class="btn-view" onclick="showToast('Página de detalhes em breve ❀')">Detalhes</button>
          </div>
        </div>
      </article>
    `).join("");
  $$(".product.reveal", grid).forEach(el=>io.observe(el));
}
renderProducts();

$$("#filters .filter-chip").forEach(btn=>{
  btn.addEventListener("click",()=>{
    $$("#filters .filter-chip").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

/* =========================================================
   4. CARROSSEL SIGNATURE (drag + setas)
   ========================================================= */
const track = $("#carousel-track");
track.innerHTML = PRODUCTS.map(p=>`
  <article class="product">
    <div class="product-media"><img src="${p.img}" alt="${p.name}" loading="lazy"/></div>
    <div class="product-info">
      <span class="cat">${p.cat}</span>
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <div class="stars">${stars(p.rating)}</div>
    </div>
  </article>
`).join("");

$(".carousel-nav.prev").addEventListener("click", ()=> track.scrollBy({left:-340,behavior:"smooth"}));
$(".carousel-nav.next").addEventListener("click", ()=> track.scrollBy({left: 340,behavior:"smooth"}));

/* Drag */
let isDown=false,startX,scrollL;
track.addEventListener("mousedown", e=>{ isDown=true; track.classList.add("grabbing"); startX=e.pageX-track.offsetLeft; scrollL=track.scrollLeft; });
["mouseleave","mouseup"].forEach(ev=> track.addEventListener(ev, ()=>{ isDown=false; track.classList.remove("grabbing"); }));
track.addEventListener("mousemove", e=>{ if(!isDown) return; e.preventDefault(); const x=e.pageX-track.offsetLeft; track.scrollLeft = scrollL - (x-startX)*1.5; });

/* =========================================================
   5. MODAL DE COMPRA (PIX + QR)
   ========================================================= */
const modal = $("#buy-modal");
$("#modal-close").addEventListener("click", ()=>modal.classList.remove("open"));
modal.addEventListener("click", e=>{ if(e.target===modal) modal.classList.remove("open"); });

function buyProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p || p.stock===0) return;
  const pix = `00020126360014BR.GOV.BCB.PIX0114sakura@loja.br5204000053039865405${p.price.toFixed(2)}5802BR5906SAKURA6009SAO PAULO62070503***6304ABCD`;
  $("#modal-title").textContent = "Finalizar Compra";
  $("#modal-product").textContent = p.name;
  $("#modal-total").textContent = money(p.price);
  $("#pix-code").textContent = pix;
  // QR Code via API pública (imagem)
  $("#qr-img").src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pix)}`;
  modal.classList.add("open");
  updateCart(1);
}
window.buyProduct = buyProduct;

$("#copy-pix").addEventListener("click", ()=>{
  navigator.clipboard?.writeText($("#pix-code").textContent);
  showToast("Código PIX copiado ❀");
});

/* Carrinho fake */
let cart = 0;
function updateCart(n){ cart += n; $("#cart-count").textContent = cart; }

/* Toast */
const toast = $("#toast");
let toastT;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(()=>toast.classList.remove("on"), 2600);
}
window.showToast = showToast;

/* =========================================================
   6. SAKURA AI
   ========================================================= */
const aiFab = $("#ai-fab");
const aiPanel = $("#ai-panel");
const aiMsgs = $("#ai-messages");
aiFab.addEventListener("click", ()=>aiPanel.classList.toggle("open"));
$("#ai-close").addEventListener("click", ()=>aiPanel.classList.remove("open"));

const KB = [
  { k:["tamanho","medida","tabela"], a:"Nossa <strong>tabela de medidas</strong>: PP (34-36), P (38), M (40), G (42), GG (44). Recomendo medir busto, cintura e quadril com fita ❀" },
  { k:["frete","envio"], a:"O <strong>frete é grátis</strong> para compras acima de R$ 399. Enviamos para todo o Brasil via Correios e transportadora expressa." },
  { k:["prazo","entrega","chega"], a:"Prazo de entrega: <strong>3-5 dias úteis</strong> (capitais) e 5-10 dias (demais regiões). Você recebe rastreio por e-mail." },
  { k:["pagamento","pix","cartão","cartao","parcel"], a:"Aceitamos <strong>PIX</strong> (5% off), cartão em até <strong>6x sem juros</strong> e boleto. Pagamento 100% seguro." },
  { k:["troca","devolução","devolucao"], a:"Você tem <strong>30 dias</strong> para trocar ou devolver. Peça deve estar com etiqueta e sem uso. Solicite pelo WhatsApp." },
  { k:["cuidado","lavar","lavagem"], a:"Recomendamos <strong>lavagem à mão</strong> ou ciclo delicado, água fria e secagem à sombra. Não usar alvejante." },
  { k:["estoque","dispon"], a:"Nosso estoque é atualizado em tempo real. Peças marcadas como <em>“Últimas unidades”</em> costumam esgotar rápido!" },
  { k:["contato","whatsapp","instagram"], a:"Fale conosco: WhatsApp (11) 90000-0000 · Instagram @sakura.oficial · Email contato@sakura.br" },
  { k:["comprar","como","pedido"], a:"Clique em <strong>Comprar</strong> em qualquer produto, escaneie o QR Code PIX e pronto! Entregamos rapidinho ❀" },
];

function aiReply(text){
  const t = text.toLowerCase();
  const hit = KB.find(item => item.k.some(k=>t.includes(k)));
  return hit ? hit.a : "Ainda estou aprendendo sobre isso 🌸 Mas nossa equipe humana adora conversar: chame no WhatsApp (11) 90000-0000!";
}

function aiSend(text){
  if(!text.trim()) return;
  aiMsgs.insertAdjacentHTML("beforeend", `<div class="ai-msg user">${text}</div>`);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  setTimeout(()=>{
    aiMsgs.insertAdjacentHTML("beforeend", `<div class="ai-msg bot">${aiReply(text)}</div>`);
    aiMsgs.scrollTop = aiMsgs.scrollHeight;
  }, 500);
}

$("#ai-form").addEventListener("submit", e=>{
  e.preventDefault();
  const inp = $("#ai-text");
  aiSend(inp.value);
  inp.value = "";
});
$$("#ai-quick button").forEach(b=>b.addEventListener("click", ()=>aiSend(b.textContent)));

/* Carrinho abrir toast */
$("#cart-btn").addEventListener("click", ()=>showToast(`Carrinho: ${cart} ite${cart===1?'m':'ns'} ❀`));

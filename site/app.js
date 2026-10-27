import {PRODUCTS, CATEGORIES, DELIVERY_FEE, FREE_DELIVERY_FROM} from './catalog.js';
import {isInstalled, buildView, summaryLines, filterProducts} from './feature-runtime.js';
import {initThemeToggle} from './theme.js';

initThemeToggle();

const foodGrid=document.getElementById('food-grid');
const bagItems=document.getElementById('bag-items');
const summary=document.getElementById('bag-summary');
const drawer=document.getElementById('bag-panel');
const overlay=document.getElementById('bag-overlay');
const menuSlot=document.getElementById('feature-menu-slot');
let selectedCategory='All'; let search='';
let bag = JSON.parse(localStorage.getItem('campusbites-bag') || '{}');
let toastTimeout;
const formatPrice=n=>`${n<0?'− ':''}₹${Math.abs(Number(n)).toLocaleString('en-IN')}`;
const itemCount=()=>Object.values(bag).reduce((s,v)=>s+v,0);
function persist(){localStorage.setItem('campusbites-bag',JSON.stringify(bag));}
function showToast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),2500)}

// ---- The AI team's feature slot -------------------------------------------
// site/feature.js is rewritten by the agents. Loaded fresh on every page load
// so a finished run shows up after a reload. A broken feature never breaks the shop.
let feature=null, featureState={}, featureError='';
try{
  const release = await fetch('/api/release-status',{cache:'no-store'}).then(r=>{
    if(!r.ok)throw new Error('Feature release check unavailable');
    return r.json();
  });
  // During a live run, unfinished/failed model-generated code is never shown
  // in the user-facing shop. The test runner still imports the files directly.
  if(release.available){
    const mod=await import(`./feature.js?v=${Date.now()}`);
    if(isInstalled(mod)){feature=mod;featureState=typeof mod.initialState==='function'?(mod.initialState()||{}):{};}
  }
}catch(err){featureError=`Feature failed to load: ${err.message}`;console.error(err)}
const view=()=>buildView({bag,products:PRODUCTS,state:featureState});
async function api(action,body){
  const response=await fetch(`/api/feature/${encodeURIComponent(action)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body??{})});
  return response.json();
}
function safe(fn,fallback){try{return fn()}catch(err){featureError=`Feature error: ${err.message}`;console.error(err);return fallback}}
function featurePanel(slot){
  if(featureError&&slot==='bag')return `<div class="feature-panel feature-broken">${featureError.replace(/[<>&]/g,'')}</div>`;
  if(!feature||feature.feature.slot!==slot)return '';
  const html=safe(()=>feature.render(view()),'');
  return html?`<div class="feature-panel" data-feature-slot="${slot}"><div class="feature-name">${String(feature.feature.name||'New feature').replace(/[<>&"]/g,'')}</div>${html}</div>`:'';
}
function readInputs(panel){
  const input={};
  for(const el of panel.querySelectorAll('[name]'))input[el.name]=el.type==='checkbox'?el.checked:el.value;
  return input;
}
async function runAction(el){
  const panel=el.closest('.feature-panel');if(!panel||!feature)return;
  try{
    const next=await feature.onAction(el.dataset.action,readInputs(panel),view(),api);
    if(next&&typeof next==='object')featureState=next;
  }catch(err){featureError=`Feature error: ${err.message}`;console.error(err)}
  renderFoods();renderBag();
}
document.addEventListener('click',e=>{const el=e.target.closest('.feature-panel [data-action]');if(el&&!['INPUT','SELECT'].includes(el.tagName)){e.preventDefault();runAction(el)}});
document.addEventListener('change',e=>{const el=e.target.closest('.feature-panel [data-action]');if(el&&['INPUT','SELECT'].includes(el.tagName))runAction(el)});
document.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.target.tagName!=='INPUT')return;const panel=e.target.closest('.feature-panel');const btn=panel?.querySelector('button[data-action]');if(btn){e.preventDefault();runAction(btn)}});
document.addEventListener('submit',e=>{const panel=e.target.closest('.feature-panel');if(!panel)return;e.preventDefault();const btn=panel.querySelector('button[data-action]');if(btn)runAction(btn)});
// ---------------------------------------------------------------------------

function renderCategories(){document.getElementById('category-tabs').innerHTML=CATEGORIES.map(c=>`<button data-cat="${c}" class="category ${selectedCategory===c?'selected':''}">${c==='All'?'✳ ':''}${c}</button>`).join('')}
function renderFoods(){
const matching=PRODUCTS.filter(p=>(selectedCategory==='All'||p.category===selectedCategory)&&(`${p.name} ${p.detail}`.toLowerCase().includes(search)));
const shown=feature?safe(()=>filterProducts(feature,matching,view()),matching):matching;
menuSlot.innerHTML=featurePanel('menu');
document.getElementById('result-count').textContent=shown.length;
foodGrid.innerHTML=shown.length?shown.map(p=>`<article class="food-card"><div class="food-visual" style="background:${p.bg}"><span class="food-ribbon">${p.tag}</span><img src="/assets/${p.asset}" alt="Illustrated ${p.name}" loading="lazy"/></div><div class="food-body"><div class="food-rating">★ <span>${p.rating}</span> <small>· ${p.time}</small>${p.veg?' <span class="veg-dot" title="Vegetarian">●</span>':''}</div><h3>${p.name}</h3><p>${p.detail}</p><div class="food-bottom"><div><strong>${formatPrice(p.price)}</strong><small>incl. taxes</small></div><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to bag">+ Add</button></div></div></article>`).join(''):'<div class="no-results">Nothing matches that craving. Try a different search.</div>'}
function renderBag(){const count=itemCount();document.getElementById('bag-count').textContent=count; document.getElementById('bag-item-count').textContent=`(${count})`;
if(!count){bagItems.innerHTML='<div class="bag-empty"><div class="empty-icon">☻</div><strong>Your bag looks lonely.</strong><p>A little food goes a long way. Pick something good.</p></div>';summary.innerHTML='<div class="bag-underline"></div><p class="empty-hint">Add a dish to see your total here.</p>';return}
bagItems.innerHTML=PRODUCTS.filter(p=>bag[p.id]>0).map(p=>`<div class="bag-row"><div class="bag-thumbnail" style="background:${p.bg}"><img src="/assets/${p.asset}" alt=""/></div><div class="bag-row-main"><strong>${p.name}</strong><small>${formatPrice(p.price)}</small><div class="quantity-controls"><button aria-label="Remove one ${p.name}" data-dec="${p.id}">−</button><span>${bag[p.id]}</span><button aria-label="Add one ${p.name}" data-inc="${p.id}">+</button></div></div><strong class="row-cost">${formatPrice(p.price*bag[p.id])}</strong></div>`).join('');
const v=view(),sub=v.subtotal,delivery=sub>=FREE_DELIVERY_FROM?0:DELIVERY_FEE;
const extra=feature?safe(()=>summaryLines(feature,v),[]):[];
const total=Math.max(0,sub+delivery+extra.reduce((s,l)=>s+l.amount,0));
summary.innerHTML=`${featurePanel('bag')}<div class="line-item"><span>Subtotal</span><strong>${formatPrice(sub)}</strong></div><div class="line-item"><span>Delivery</span><strong>${delivery===0?'<span class="free">FREE</span>':formatPrice(delivery)}</strong></div>${extra.map(l=>`<div class="line-item ${l.amount<0?'discount-line':''}"><span>${l.label.replace(/[<>&]/g,'')}</span><strong>${formatPrice(l.amount)}</strong></div>`).join('')}<div class="total-line"><span>Total</span><strong>${formatPrice(total)}</strong></div><button id="checkout-button" class="checkout-button">Place demo order <span>↗</span></button><p class="checkout-fine">Demo only · No payments or actual deliveries</p>`;
}
function updateBag(id,delta){bag[id]=Math.max(0,(bag[id]||0)+delta);if(bag[id]===0)delete bag[id];persist();renderBag();renderFoods();}
function showBag(){drawer.classList.add('mobile-open');overlay.hidden=false;requestAnimationFrame(()=>overlay.classList.add('show'))}
function closeBag(){drawer.classList.remove('mobile-open');overlay.classList.remove('show');setTimeout(()=>overlay.hidden=true,200)}
document.getElementById('category-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;selectedCategory=b.dataset.cat;renderCategories();renderFoods()});
document.getElementById('food-search').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();renderFoods()});
foodGrid.addEventListener('click',e=>{const btn=e.target.closest('[data-add]');if(btn){updateBag(btn.dataset.add,1);showToast('Added to your bag ✳')}});
drawer.addEventListener('click',e=>{const inc=e.target.closest('[data-inc]'); const dec=e.target.closest('[data-dec]');if(inc)updateBag(inc.dataset.inc,1);if(dec)updateBag(dec.dataset.dec,-1);
if(e.target.closest('#checkout-button')){const dialog=document.getElementById('checkout-dialog');document.getElementById('order-number').textContent=`#CB-${String(Math.floor(Math.random()*9000)+1000)}`;bag={};persist();renderBag();renderFoods();closeBag();dialog.showModal()}
});
document.getElementById('cart-toggle').addEventListener('click',showBag);overlay.addEventListener('click',closeBag);
renderCategories();renderFoods();renderBag();

const presets = [
  {id:'hero-desktop',name:'Homepage · pop-out hero',w:2400,h:1200,anchor:'right',scale:95,bg:'blush-to-ivory gradient',safe:'Left 40% for headline and CTA; keep navigation controls clear.',layered:true},
  {id:'hero-mobile',name:'Mobile homepage hero',w:1080,h:1440,anchor:'center',scale:85,bg:'blush-to-ivory gradient',safe:'Upper 30% for headline; protect mobile navigation.',layered:true},
  {id:'hairstyle',name:'Hairstyle category card',w:800,h:1000,anchor:'center',scale:95,bg:'warm ivory studio',safe:'Keep face, crown, hair texture and ends visible.'},
  {id:'premium-banner',name:'Premium wigs campaign',w:2000,h:900,anchor:'right',scale:100,bg:'soft lilac editorial',safe:'Left 38% for story copy and CTA.'},
  {id:'style-finder',name:'Find your style card',w:900,h:750,anchor:'right',scale:100,bg:'warm ivory studio',safe:'Upper left for title and style choices.'},
  {id:'transformation',name:'Before / after portrait',w:800,h:1000,anchor:'center',scale:90,bg:'warm ivory studio',safe:'Match camera angle, crop, lighting and identity across the pair.'},
  {id:'product-main',name:'Product detail · main image',w:1200,h:1500,anchor:'center',scale:95,bg:'warm ivory studio',safe:'Show the true product color, texture, length and hairline.'},
  {id:'product-alternate',name:'Product detail · alternate view',w:1200,h:1500,anchor:'center',scale:95,bg:'warm ivory studio',safe:'Use front, profile, back, or hairline detail as appropriate.'},
  {id:'product-thumbnail',name:'Product gallery thumbnail',w:400,h:500,anchor:'center',scale:95,bg:'warm ivory studio',safe:'Keep the focal point legible at small size.'},
  {id:'occasion',name:'Occasion campaign panel',w:1200,h:900,anchor:'right',scale:95,bg:'soft lilac editorial',safe:'Left side for title and CTA; reserve edge for occasion controls.'},
  {id:'journal',name:'Editorial article card',w:1000,h:700,anchor:'center',scale:95,bg:'warm ivory studio',safe:'No text in image; allow a natural editorial crop.'},
  {id:'social',name:'Social portrait',w:1080,h:1350,anchor:'center',scale:95,bg:'soft lilac editorial',safe:'Keep subject inside a mobile-safe crop.'},
  {id:'share',name:'Website share image',w:1200,h:630,anchor:'right',scale:95,bg:'blush-to-ivory gradient',safe:'Left 40% for optional HTML/share text.'}
];
const placementExplanations={
  'hero-desktop':['Top left: the very large “More Than Hair” image.','Prepare a high-quality model portrait with the real wig. A transparent model cutout gives the hair its signature pop-out effect.'],
  'hero-mobile':['Inside the phone shown near the top center.','Prepare a separate tall crop of the same campaign, leaving room for the headline on a narrow screen.'],
  'hairstyle':['The six portraits under “Shop by Hairstyle”.','Prepare one consistent portrait for each hairstyle category: Straight, Wavy, Curly, Layered, Bob & Short, and Highlights.'],
  'premium-banner':['The wide lavender “Premium Wigs for Every You” section on the left.','Prepare a striking model photo with space on the left for the story and button.'],
  'style-finder':['The “Find Your Perfect Style” card at the upper right.','Prepare a model portrait positioned to the right, leaving space for the list of styles.'],
  'transformation':['The two side-by-side portraits under “Real People, Real Transformations”.','Prepare genuine before and after photos of the same consenting person, with matching pose and lighting.'],
  'product-main':['The large portrait on the “Classic Straight Wig” product page at center right.','Prepare the clearest, most accurate photo of the actual product; buyers use this to judge the wig.'],
  'product-alternate':['Additional photos of the same wig in the product gallery.','Prepare another angle, such as front, side, back, hairline, or texture detail.'],
  'product-thumbnail':['The small vertical photos beside the large product photo.','This is a small version of an approved product gallery image, not a separate photoshoot.'],
  'occasion':['The lavender “Occasions Made More Beautiful” section at bottom right.','Prepare an editorial model image for an occasion such as office wear, a party, or a wedding.'],
  'journal':['The four article photos under “The Femegha Edit” at bottom left.','Prepare a photo that illustrates a hair-care guide, styling tip, or real customer story.'],
  'social':['Not a separate section in the reference image.','Prepare a tall version of an approved image for social media posts.'],
  'share':['Not a separate section in the reference image.','Prepare a wide image that appears when someone shares a Femegha page link.']
};
const $=id=>document.getElementById(id);
const fields=['productTitle','sku','truth','preset','anchor','scale','background','dress','dressColor','dressDetails','hairStyle','hairParting','hairDetails','mood','notes','endpoint'];
const images={product:null,model:null};
const stateKey='femegha-studio-v1';
const presetSelect=$('preset');
for(const p of presets){const o=document.createElement('option');o.value=p.id;o.textContent=`${p.name} · ${p.w}×${p.h}`;presetSelect.append(o)}
try{const saved=JSON.parse(localStorage.getItem(stateKey)||'{}');for(const id of fields)if(saved[id]!=null)$(id).value=saved[id]}catch{}
function preset(){return presets.find(p=>p.id===presetSelect.value)||presets[0]}
function getBrief(){
 const p=preset();
 const value=id=>$(id).value.trim();
 const truth=value('truth');
 const hasModel=Boolean(images.model);
 const wardrobeSelected=Boolean(value('dress')||value('dressColor')||value('dressDetails'));
 const hairStylingSelected=Boolean(value('hairStyle')||value('hairParting')||value('hairDetails'));
 return {
  schemaVersion:'2.0',
  task:'Create one premium, realistic Femegha ecommerce image using the attached source photo(s) and this structured brief. Preserve the product’s true finish without adding shine.',
  output:{widthPx:p.w,heightPx:p.h,aspectRatio:`${p.w}:${p.h}`,format:'PNG or high-quality WebP',separateLayersRequired:Boolean(p.layered)},
  placement:{id:p.id,name:p.name,referenceLocation:placementExplanations[p.id][0],safeArea:p.safe},
  sourceImages:{product:{fileName:images.product?.name||null,role:'Ground truth for the product; do not change visible product attributes.'},model:{fileName:images.model?.name||null,role:hasModel?'Preserve model identity and likeness.':'Optional; create a suitable editorial model if needed.'}},
  productTruth:{name:value('productTitle')||'Unnamed Femegha product',sku:value('sku')||null,immutableAttributes:truth||null,finish:{reference:'Match the actual product photo.',sheen:'Preserve natural, restrained sheen only; never increase gloss or make the hair look coated, wet, or synthetic.',texture:'Retain visible strand separation, depth, and realistic variation. Do not smooth away texture.'},missingInformationRule:'Do not invent unknown product properties. Ask for details or keep them neutral.'},
  model:{position:value('anchor'),sizePercentOfCanvasHeight:Number(value('scale'))},
  ...(wardrobeSelected?{wardrobe:{selection:value('dress')||null,selectionLabel:value('dress')?$('dress').selectedOptions[0].textContent:null,color:value('dressColor')||null,details:value('dressDetails')||null,rule:'If set to as-reference, preserve clothing from the model photo. Changes apply only to AI generation, not the browser-composed PNG. The chosen attire should be culturally accurate and naturally draped, without changing the product.'}}:{}),
  ...(hairStylingSelected?{hairStyling:{selection:value('hairStyle')||null,parting:value('hairParting')||null,details:value('hairDetails')||null,rule:'Only use styling achievable with the real product. Product color, length, texture, hairline, density and construction remain unchanged unless the product truth explicitly permits a change.'}}:{}),
  artDirection:{background:value('background'),mood:value('mood'),additionalInstructions:value('notes')||null,brandStyle:'Warm ivory, blush and soft lilac; restrained violet accent; realistic premium fashion editorial.',lighting:'Large, soft, diffused light source with controlled highlights and natural color. Avoid harsh frontal flash and specular hotspots on the hair.'},
  generationRules:{priority:'Product truth and true product finish take precedence over creative direction, outfit, styling, and optional notes.',mustPreserve:['Product identity and all specified immutable attributes','The exact level of natural sheen visible in the product reference','Individual hair strands, realistic texture and tonal depth','Natural anatomy and skin texture','Text and UI safe areas'],mustAvoid:['Added high-gloss, mirror shine, wet-look finish, oily sheen, plastic/synthetic appearance, or metallic highlights on the product','Overexposure, blown highlights, strong beauty filters, excessive smoothing or artificial sharpening','Text, logos, watermarks, prices, buttons or badges baked into the image','Invented product features','Distorted hands, face or hair','Fabricated reviews or claims'],specialHeroTreatment:p.layered?'Create separate backdrop and transparent model cutout with natural hair edges, plus a composite preview. Model silhouette may rise into the header region but must not obscure navigation controls.':null},
  review:{status:'manual review required',checks:['Compare product color, texture, length, hairline and finish against the real product photo','Reject any added shine, wet look, plastic texture or blown highlights',...(wardrobeSelected?['Check outfit matches the selected preference']:[]),...(hairStylingSelected?['Check hair styling matches the selected preference']:[]),'Check crop and safe area','Confirm rights and consent before publishing']},
  usage:'Attach the original product photo and optional model photo alongside this JSON when using ChatGPT, Gemini, or another AI image platform.'
 };
}
const artRecipes={
 'hero-desktop':['BRAND-HEADER','Wide brand header','left 40%','Create separate backdrop and transparent model cutout; preserve pop-out overlap without covering navigation.'],
 'hero-mobile':['AD-STORY','Tall mobile campaign','upper third','Keep the model and headline safe on a narrow screen.'],
 'hairstyle':['MODEL-LOOKBOOK','Consistent hairstyle collection','none','Show the selected hairstyle clearly with a consistent portrait crop.'],
 'premium-banner':['AD-BANNER','Wide editorial banner','left 38%','Model and hair are prominent; reserve space for later website copy.'],
 'style-finder':['AD-COPYSPACE','Style discovery card','upper left','Show the model on the right and keep style-list space clear.'],
 'transformation':['AD-COMPARE','Matched before/after pair','none','Same consenting adult in both frames; match angle, lighting and clothing; label accurately outside the image.'],
 'product-alternate':['SHOP-ANGLE','Additional product angle','none','Show a truthful alternate view of the same wig.'],
 'product-thumbnail':['SHOP-ANGLE','Small product gallery view','none','Use an approved product-gallery image and a tight crop; do not invent a different product.'],
 'occasion':['MODEL-EDITORIAL','Occasion campaign portrait','left side','Fashion editorial for the chosen occasion with a clear text-safe area.'],
 'journal':['SOCIAL-EDITORIAL','Editorial story image','none','Support the article topic without adding text or invented claims.'],
 'social':['SOCIAL-EDITORIAL','Social portrait','none','Natural lifestyle image with the wig visible and a mobile-safe crop.'],
 'share':['BRAND-HEADER','Wide share image','left 40%','Keep the focal point clear at small preview sizes.']
};
function shortcodeRecipe(){
 const p=preset();
 if(p.id==='product-main')return images.model?['MODEL-CATALOG','Wig shown clearly on a model','none','Show the actual wig clearly on the supplied model.']:['SHOP-CLEAN','Clean product listing','none','Isolate the full actual wig on a clean background.'];
 return artRecipes[p.id];
}
function getShortcode(){
 const p=preset();const [code,,space,recipeNote]=shortcodeRecipe();
 const value=id=>$(id).value.trim();
 const quoted=(key,val)=>`${key}="${String(val).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\s+/g,' ').trim()}"`;
 const gcd=(a,b)=>b?gcd(b,a%b):a;const divisor=gcd(p.w,p.h);
 const productName=value('productTitle')||'[enter product name]';
 const parts=[`/ART ${code}`,quoted('subject',productName),quoted('product',productName),quoted('ref','attached'),quoted('ratio',`${p.w/divisor}:${p.h/divisor}`),quoted('mode','image')];
 if(images.model)parts.push(quoted('model_ref','attached'));
 if(space!=='none')parts.push(quoted('space',space));
 parts.push(quoted('palette','warm ivory, soft blush, restrained lilac'));
 parts.push(quoted('light','soft diffused studio light; natural product sheen only'));
 parts.push(quoted('setting',value('background')));
 if(value('sku'))parts.push(quoted('sku',value('sku')));
 if(value('truth'))parts.push(quoted('preserve',value('truth')));
 if(value('dress'))parts.push(quoted('dress',$('dress').selectedOptions[0].textContent));
 if(value('dressColor'))parts.push(quoted('dress_color',value('dressColor')));
 if(value('dressDetails'))parts.push(quoted('dress_details',value('dressDetails')));
 if(value('hairStyle'))parts.push(quoted('hair_style',$('hairStyle').selectedOptions[0].textContent));
 if(value('hairParting'))parts.push(quoted('parting',value('hairParting')));
 if(value('hairDetails'))parts.push(quoted('hair_details',value('hairDetails')));
 parts.push(quoted('brief',recipeNote));
 parts.push(quoted('avoid','extra shine, wet look, plastic hair, changed product details, text, logos, fake claims'));
 return parts.join(' ');
}
function bgStyle(bg){return bg==='clean white'?'#ffffff':bg==='warm ivory studio'?'#fff9f8':bg==='soft lilac editorial'?'linear-gradient(115deg,#f1e7fa,#e7d8f5)':bg==='transparent'?'repeating-conic-gradient(#eee 0 25%,#fff 0 50%) 50%/20px 20px':'linear-gradient(115deg,#fff9f8 5%,#f8f2f9 65%,#f2e9fa)'}
function update(){const p=preset();$('scaleValue').value=$('scale').value+'%';$('presetHelp').textContent=`${p.w} × ${p.h} px · ${p.safe}`;$('placementWhere').textContent=`Where in your reference: ${placementExplanations[p.id][0]}`;$('placementPrepare').textContent=`What to prepare: ${placementExplanations[p.id][1]}`;const pv=$('preview');pv.style.aspectRatio=`${p.w}/${p.h}`;pv.style.background=bgStyle($('background').value);const anchor=$('anchor').value;const img=images.model?$('modelPreview'):$('productPreview');for(const id of ['productPreview','modelPreview'])$(id).style.display='none';if(images.product||images.model){img.style.display='block';img.style.height=$('scale').value+'%';img.style.left=anchor==='left'?'2%':anchor==='center'?'50%':'auto';img.style.right=anchor==='right'?'2%':'auto';img.style.transform=anchor==='center'?'translateX(-50%)':'none';$('emptyPreview').style.display='none'}else $('emptyPreview').style.display='grid';$('preview').querySelector('.safezone').style.display=p.safe.toLowerCase().includes('left')?'block':'none';$('preview').querySelector('.preview-label').style.display=p.safe.toLowerCase().includes('left')?'block':'none';const brief=getBrief();$('jsonOut').textContent=JSON.stringify(brief,null,2);$('shortcodeOut').textContent=getShortcode();$('shortcodeRecipe').textContent=`${shortcodeRecipe()[0]} · ${shortcodeRecipe()[1]}`;$('validation').textContent=!images.product?'Product photo required for an image export. JSON can still be downloaded as a planning brief.':!$('truth').value.trim()?'Add the product attributes before using an AI platform; review the downloaded image against the real product.':'Ready for export. Review product fidelity and crop before uploading to your store.';localStorage.setItem(stateKey,JSON.stringify(Object.fromEntries(fields.map(id=>[id,$(id).value]))));}
function loadFile(kind,file){if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){alert('Please choose a JPG, PNG or WebP image.');return}if(file.size>25*1024*1024){alert('Please choose an image smaller than 25 MB.');return}const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{images[kind]={name:file.name,image,data:reader.result};$(kind+'Preview').src=reader.result;$(kind+'Name').textContent=file.name;update()};image.src=reader.result};reader.readAsDataURL(file)}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function slug(s){return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'asset'}
function drawContained(ctx,img,box,anchor,scale){const ratio=Math.min(box.w/img.width,box.h/img.height)*scale;const w=img.width*ratio,h=img.height*ratio;const x=anchor==='left'?box.x:anchor==='center'?box.x+(box.w-w)/2:box.x+box.w-w;ctx.drawImage(img,x,box.y+box.h-h,w,h)}
function paintBackground(ctx,p,bg){if(bg==='transparent'){ctx.clearRect(0,0,p.w,p.h);return}if(bg==='clean white'||bg==='warm ivory studio'){ctx.fillStyle=bg==='clean white'?'#fff':'#fff9f8'}else{const g=ctx.createLinearGradient(0,0,p.w,p.h);if(bg==='soft lilac editorial'){g.addColorStop(0,'#f1e7fa');g.addColorStop(1,'#e7d8f5')}else{g.addColorStop(0,'#fff9f8');g.addColorStop(.65,'#f8f2f9');g.addColorStop(1,'#f2e9fa')}ctx.fillStyle=g}ctx.fillRect(0,0,p.w,p.h)}
async function exportImage(){if(!images.product){alert('Upload a product image first.');return}const p=preset();const canvas=document.createElement('canvas');canvas.width=p.w;canvas.height=p.h;const ctx=canvas.getContext('2d');paintBackground(ctx,p,$('background').value);const source=images.model||images.product;const anchor=$('anchor').value;const target=p.safe.toLowerCase().includes('left')?{x:p.w*.43,y:0,w:p.w*.55,h:p.h}:{x:0,y:0,w:p.w,h:p.h};drawContained(ctx,source.image,target,anchor,Number($('scale').value)/100);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(blob)download(blob,`femegha-${p.id}-${slug($('productTitle').value)}.png`)}
async function generate(){const endpoint=$('endpoint').value.trim();if(!endpoint){alert('Add the URL of your own secure generation endpoint. You can export JSON without one.');return}if(!endpoint.startsWith('https://')){alert('Use an HTTPS endpoint.');return}if(!images.product){alert('Upload a product image first.');return}const button=$('generate');button.disabled=true;button.textContent='Generating…';try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...getBrief(),referenceImageDataUrls:{product:images.product.data,model:images.model?.data||null}})});if(!response.ok)throw new Error(`Endpoint returned ${response.status}`);const result=await response.json();if(typeof result.imageDataUrl!=='string'||!result.imageDataUrl.startsWith('data:image/'))throw new Error('Endpoint must return {"imageDataUrl":"data:image/..."}');const blob=await(await fetch(result.imageDataUrl)).blob();download(blob,`femegha-${preset().id}-generated.png`)}catch(e){alert(`Generation failed: ${e.message}`)}finally{button.disabled=false;button.textContent='Generate via endpoint'}}
for(const id of fields)$(id).addEventListener('input',update);
presetSelect.addEventListener('change',()=>{const p=preset();$('anchor').value=p.anchor;$('scale').value=p.scale;$('background').value=p.bg;update()});
$('productFile').addEventListener('change',e=>loadFile('product',e.target.files[0]));$('modelFile').addEventListener('change',e=>loadFile('model',e.target.files[0]));
$('downloadJson').onclick=()=>download(new Blob([JSON.stringify(getBrief(),null,2)],{type:'application/json'}),`femegha-${preset().id}-${slug($('productTitle').value)}.json`);
$('copyJson').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(getBrief(),null,2));$('copyJson').textContent='Copied JSON';setTimeout(()=>$('copyJson').textContent='Copy AI JSON',1800)}catch{alert('Copy failed. Please use Download AI JSON instead.')}};
$('copyShortcode').onclick=async()=>{try{await navigator.clipboard.writeText(getShortcode());$('copyShortcode').textContent='Copied shortcode';setTimeout(()=>$('copyShortcode').textContent='Copy ART shortcode',1800)}catch{alert('Copy failed. Select and copy the shortcode shown above instead.')}};
$('downloadImage').onclick=exportImage;$('generate').onclick=generate;
$('reset').onclick=()=>{if(!confirm('Clear this brief and start fresh?'))return;localStorage.removeItem(stateKey);location.reload()};
update();

let installPrompt;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event});
$('install').addEventListener('click',async()=>{
  if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return}
  alert('To install: on iPhone/iPad, open this page in Safari and choose Share → Add to Home Screen. On Android or desktop, use your browser menu → Install app or Add to Home Screen.');
});
window.addEventListener('appinstalled',()=>{$('install').textContent='Installed'});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));

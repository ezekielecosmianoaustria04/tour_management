document.addEventListener('DOMContentLoaded', () => {
  // Approximate geographic centers for interactive navigation, not legal boundaries.
  const destinations = [
    ['Puerto Princesa',9.740,118.735],
    ['Aborlan',9.437,118.548],
    ['Agutaya',11.148,120.957],
    ['Araceli',10.552,119.991],
    ['Balabac',7.987,117.064],
    ['Bataraza',8.663,117.624],
    ["Brooke's Point",8.782,117.833],
    ['Busuanga',12.159,119.946],
    ['Cagayancillo',9.575,121.200],
    ['Coron',12.000,120.205],
    ['Culion',11.830,119.994],
    ['Cuyo',10.853,121.008],
    ['Dumaran',10.525,119.768],
    ['El Nido',11.179,119.392],
    ['Kalayaan',11.050,114.283],
    ['Linapacan',11.489,119.868],
    ['Magsaysay',10.875,121.054],
    ['Narra',9.268,118.405],
    ['Quezon',9.242,117.994],
    ['Rizal',8.684,117.353],
    ['Roxas',10.320,119.345],
    ['San Vicente',10.531,119.270],
    ['Sofronio Española',8.958,118.015],
    ['Taytay',10.817,119.515]
  ];
  const mapNode=document.getElementById('philippinesTerrainMap');
  const buttonBox=document.getElementById('terrainButtons');
  const search=document.getElementById('destinationSearch');
  const count=document.getElementById('destinationCount');
  const status=document.getElementById('terrainSelection');
  const buttons=new Map(), markers=new Map();
  let selected=null, map=null;

  function styleMarker(name, hover=false){
    const marker=markers.get(name); if(!marker)return;
    const active=selected===name;
    marker.setStyle({radius:hover?12:active?11:7,weight:hover||active?4:2,
      color:hover||active?'#ffb400':'#ffffff',
      fillColor:hover?'#ffe86a':active?'#ffd700':'#0d9488',fillOpacity:1});
  }
  function choose(name){
    const place=destinations.find(d=>d[0]===name); if(!place)return;
    const prev=selected;selected=name;
    if(prev)styleMarker(prev);
    styleMarker(name);
    buttons.forEach((btn,key)=>{
      const on=key===name;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));
    });
    status.textContent='Selected destination: '+name;
    renderAttractions(name);
    if(map){map.flyTo([place[1],place[2]],name==='Kalayaan'?7:10,{duration:1.1});markers.get(name)?.openTooltip();}
  }
  function renderAttractions(name) {
    const section = Array.from(document.querySelectorAll('.destination-attractions')).find(el => el.dataset.attractionsFor === name);
    document.querySelectorAll('.destination-attractions').forEach(el => { el.hidden = el !== section; });
    if (section) section.scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.querySelectorAll('#terrainButtons [data-destination]').forEach(button => {
    const name=button.dataset.destination;
    buttons.set(name,button);
    button.addEventListener('click',()=>choose(name));
  });
  function filter(){
    const q=search.value.trim().toLocaleLowerCase();let visible=0;
    buttons.forEach((button,name)=>{const match=name.toLocaleLowerCase().includes(q);button.hidden=!match;if(match)visible++;});
    count.textContent=`${visible} of ${destinations.length} destinations`;
  }
  search.addEventListener('input',filter);filter();
  const headerSearch=document.getElementById('home-location-search');
  document.getElementById('headerSearchForm')?.addEventListener('submit',event=>{
    event.preventDefault();
    const query=headerSearch.value.trim();
    search.value=query;
    filter();
    document.getElementById('destinationSearch').scrollIntoView({behavior:'smooth',block:'center'});
    const exact=destinations.find(([name])=>name.toLowerCase()===query.toLowerCase());
    if(exact)choose(exact[0]);
  });

  if(typeof L==='undefined'){
    mapNode.textContent='Terrain map could not load. You can still select a destination below.';
    mapNode.style.padding='24px';return;
  }
  map=L.map(mapNode,{center:[10.4,119.2],zoom:7,minZoom:4,maxZoom:15,scrollWheelZoom:false});
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{
    attribution:'Map data © OpenStreetMap contributors, SRTM | Map style © OpenTopoMap',maxZoom:15
  }).addTo(map);
  // Default view prioritizes mainland Palawan and the Calamianes.
  map.fitBounds([[7.5,116.8],[12.5,121.3]],{padding:[25,25]});
  destinations.forEach(([name,lat,lng])=>{
    const marker=L.circleMarker([lat,lng],{radius:7,color:'#fff',weight:2,fillColor:'#0d9488',fillOpacity:1}).addTo(map);
    marker.bindTooltip(name,{direction:'top',offset:[0,-8]});
    marker.on('mouseover',()=>{styleMarker(name,true);marker.openTooltip();});
    marker.on('mouseout',()=>styleMarker(name));
    marker.on('click',()=>choose(name));
    markers.set(name,marker);
  });
});

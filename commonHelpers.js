import{i as u,a as g,S as h}from"./assets/vendor-5401a4b0.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function a(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=a(e);fetch(e.href,o)}})();const p=document.querySelector("input"),b=document.querySelector(".form"),f=()=>{const t=document.createElement("span");t.classList.add("loader"),document.body.append(t)},m=()=>{const t=document.querySelector(".loader");t&&t.remove()};let i=1;const c=15,d={apiKey:"42337135-3774c2f446ec3f71c1b4c916a",baseUrl:"https://pixabay.com/api/"};function L(t,n=1){return`${d.baseUrl}?key=${d.apiKey}&q=${t}&image_type=photo&orientation=horizontal&safesearch=true&page=${n}&per_page=${c}`}async function y(){const t=p.value.trim(),n=L(t,i);try{const s=(await g.get(n)).data;w(s)}catch(a){console.error("Error fetching data:",a),m(),u.error({title:"Error",message:"An error occurred while fetching data. Please try again later.",position:"center"})}}b.addEventListener("submit",async function(t){if(t.preventDefault(),i=1,!p.value.trim()){u.error({title:"Error",message:"Please enter a valid search term"});return}f(),await y()});const l=document.querySelector(".btn-load");l.addEventListener("click",async function(){i++,f(),await y()});function w(t){const n=document.querySelector(".gallery"),a=new h(".gallery a",{captions:!0,captionType:"attr",captionsData:"alt",captionPosition:"bottom",fadeSpeed:150,captionSelector:"img",captionDelay:250}),s=document.querySelector(".gallery-item");if(s){const r=s.getBoundingClientRect().height;window.scrollBy(0,r*c)}const e=t.hits.map(r=>`
        <li class="gallery-item">
            <a href="${r.largeImageURL}">
                <img class="gallery-image" src="${r.webformatURL}" alt="${r.tags}">
            </a>
            <p><b>Likes: </b>${r.likes}</p>
            <p><b>Views: </b>${r.views}</p>
            <p><b>Comments: </b>${r.comments}</p>
            <p><b>Downloads: </b>${r.downloads}</p>
        </li>`).join("");n.innerHTML+=e,a.refresh(),m(),(t.totalHits||0)<=i*c?(l.style.display="none",u.info({title:"Info",message:"We're sorry, but you've reached the end of search results.",position:"center",transitionIn:"fadeInLeft"})):l.style.display="block"}
//# sourceMappingURL=commonHelpers.js.map

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const tabs = $$('.tab-item');
const panes = $$('.tab-pane');

const line = $('.line');
tabs.forEach((tab, index)=>{
    const pane = panes[index];
    tab.onclick = function(){
        $('.tab-pane.show').classList.remove('show');
        pane.classList.add('show');

        $('.tab-item.active').classList.remove('active');
        this.classList.add('active');
    };
});



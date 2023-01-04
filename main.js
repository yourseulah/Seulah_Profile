/*  
CSIS 1280 + Personal Project 
Seulah's Profile 
Author : Seulah Lee
Date: 2022-08-12 - 

Filename : main.js
 */

'use strict';

//Make navbar transparent when it is on the top 
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  // console.log(window.scrollY);
  // console.log(`navbarHeight: ${navbarHeight}`);
  if(window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark')
  } else {
    navbar.classList.remove('navbar--dark')
  }
});

//Handle scroll when clicking the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  const link = event.target.dataset.link;
  if(link == null) {
    return;
  }
  navbarMenu.classList.remove('open')
  //perform only if there is data-link
  //console.log(event.target.dataset.link);
  scrollIntoViews(link);
});

//Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
  
})

//Handle scroll when clicking "contact me" button 
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoViews('#contact');
});



//Make home content slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
  //console.log(1 - window.scrollY / homeHeight);
})

//Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if(window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

//Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
  scrollIntoViews('#home');
})


// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
  // console.log(filter);

  //Remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected')
  active.classList.remove('selected');
  const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode; //condition ? if yes : if no
  target.classList.add('selected')

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach((project) => {
      console.log(project.dataset.type);
      if (filter ==='*' || filter === project.dataset.type) {
        project.classList.remove('invisible')
      } else {
        project.classList.add('invisible')
      } 
    });
    projectContainer.classList.remove('anim-out');
  }, 300);


  /* two other ways (same as forEach) :
  console.log(`------------`);
  for (let project of projects) {
    console.log(project);
  }

  console.log(`------------`);
  let project;
  for(let i=0; i < projects.length; i++) {
    project = projects[i];
    console.log(project);
  }
  */
  
});

//1. Bring all the section items and corresponding menu items
//2. Observe all the sections via IntersectionObserver
//3. Activate menu items for the section showing on the window

const sectionIds = [ 
  '#home',
  '#about', 
  '#skills',
  '#work',
  '#testimonials',
  '#education',
  '#contact',
];

const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => 
  document.querySelector(`[data-link="${id}"]`)
);
// console.log(sections);
// console.log(navItems);


let selectedNavIndex;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoViews(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({behavior: 'smooth'});
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.4,
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      //console.log(index, entry.target.id);
      
      // .y means the page goes up as scrolling down
      if(entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1; //select +1 page that comes after the page as scrolling down
      } else { 
        selectedNavIndex = index - 1; //select -1 page that comes before the page as scrolling up
      }
    }
    //console.log(entry.target);
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section =>observer.observe(section));

window.addEventListener('wheel', () => { //user scroll : wheel
  if(window.scrollY === 0) { // the first
    selectedNavIndex = 0;
  } else if (window.scrollY + window.innerHeight === document.body.clientHeight) {  // the last
    selectedNavIndex = navItems.length -1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

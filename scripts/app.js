'use strict'

let habbits = []
const HABBIT_KEY = 'HABBIT_KEY'
let globalActiveHabbitId

/* page */
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        daysContainer: document.querySelector('#days'),
        nextDay: document.querySelector('.habbit__day')
    }
}


/* utils */

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY)
    const habbitArray = JSON.parse(habbitsString)
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}

/* render */
function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if (!existed) {
            //Создание
            const element = document.createElement('button')
            element.setAttribute('menu-habbit-id', habbit.id)
            element.classList.add('menu__item')
            element.addEventListener('click', () => rerender(habbit.id))
            element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}"/>`
            if (activeHabbit.id === habbit.id) {
                element.classList.add('menu__item_active')
            }
            page.menu.appendChild(element)
            continue
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active')
        } else {
            existed.classList.remove('menu__item_active')
        }
    }
}

function rerenderHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name
    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100
    page.header.progressPercent.innerText = progress.toFixed(0) + '%'
    page.header.progressCoverBar.setAttribute('style', `width:${progress}%`)
}

function renderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = ''
    for (const index in activeHabbit.days) {
    const element = document.createElement('div')
    element.classList.add('habbit')
    element.innerHTML =
       `<div class="habbit__day">День ${Number(index) + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
        <button  class="habbit__delete" onclick="deleteDay(${index})"> 
        <img  src="images/delete.svg" alt="Удалить день ${Number(index) + 1}"></button>`
    page.content.daysContainer.appendChild(element)
    }
    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId)
    if (!activeHabbit) {
        return
    }
    rerenderMenu(activeHabbit)
    rerenderHead(activeHabbit)
    renderContent(activeHabbit)
    
}

/*Work width days */
function addDay(event) {
    event.preventDefault()
    const form = event.target
    const data = new FormData(form)
    console.log(data)
    const comment = data.get('comment')
    form['comment'].classList.remove('error')

    if(!comment) {
        form['comment'].classList.add('error')
        
    } else {
    
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment }])
            }
        }
        return habbit 
    })
    form['comment'].value = ''
    rerender(globalActiveHabbitId)
    saveData()
            }
}

function deleteDay(index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1)
            return habbit
        }
        return habbit
    })
    rerender(globalActiveHabbitId)
    saveData()
}

/* init */
(() => {
    loadData()
    rerender(habbits[0].id)
})()
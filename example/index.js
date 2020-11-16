const svg = document.querySelector('#main')
svg.setAttribute('width', 800)
svg.setAttribute('height', 600)

const items = [
    { id: 0, x: 200, y: 10 },
    { id: 1, x: 400, y: 300 },
    { id: 2, x: 120, y: 500 },
    { id: 3, x: 600, y: 400 },
]

for (const item of items) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
    circle.setAttribute('cx', item.x)
    circle.setAttribute('cy', item.y)
    circle.setAttribute('fill', 'red')
    circle.setAttribute('r', 10)
    svg.appendChild(circle)
}

const lasso = new Lasso(svg)
lasso.data(items)
lasso.onSelected((selectedItems) => {
    console.log(selectedItems)
})
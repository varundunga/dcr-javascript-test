document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('plot-option');
  let countriesData = [];

  fetch('./data/countries.json')
    .then(res => {
        console.log(res)
        return res.json()})
    .then(data => {
      countriesData = data;
      updateVisuals();
    });

  select.addEventListener('change', updateVisuals);

  function updateVisuals() {
    const option = select.value;
    console.log("Selected option:", option);
    let chartData = [];
    let tableData = [];

    switch(option) {
      case 'population':
        chartData = countriesData.map(c => ({
          label: c.name,
          value: c.population,
          details: c
        }));
        break;
      case 'borders':
        console.log(option)
        break;
      case 'timezones':

        break;
      case 'languages':

        break;
      case 'countries-in-region':

        break;
      case 'unique-timezones-in-region':
        break;
    }
    renderChart(chartData);
  }
    function renderChart(data) {
    // Clear previous chart
    d3.select('#chart').selectAll('*').remove();

    const width = 800, height = 400;
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const maxVal = d3.max(data, d => d.value);
    const radiusScale = d3.scaleSqrt().domain([0, maxVal]).range([10, 50]);
    console.log(data)
    const simulation = d3.forceSimulation(data)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(d => radiusScale(d.value) + 2))
      .stop();
    console.log(data)
    for (let i = 0; i < 120; ++i) simulation.tick();

    const node = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => radiusScale(d.value))
      .attr('fill', '#69b3a2')
      .attr('stroke', '#333')
  }
});
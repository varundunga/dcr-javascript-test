document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('plot-option');
  let countriesData = [];

  fetch('./data/countries.json')
    .then(res => {
      console.log(res)
      return res.json()
    })
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

    switch (option) {
      case 'population':
        chartData = countriesData.map(c => ({
          label: c.name,
          value: c.population,
          details: c
        }));
        tableData = chartData;
        break;
      case 'borders':
        chartData = countriesData.map(c => ({
          label: c.name,
          value: c.borders ? c.borders.length : 0,
          details: c
        }));
        tableData = chartData;
        break;
      case 'timezones':
        chartData = countriesData.map(c => ({
          label: c.name,
          value: c.languages ? c.languages.length : 0,
          details: c
        }));
        tableData = chartData;
        break;
      case 'languages':
        chartData = countriesData.map(c => ({
          label: c.name,
          value: c.languages ? c.languages.length : 0,
          details: c
        }));
        tableData = chartData;
        break;
      case 'countries-in-region':
        {
          const regionCounts = {};
          countriesData.forEach(c => {
            regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
          });
          console.log(regionCounts)
          chartData = Object.entries(regionCounts).map(([region, count]) => ({
            label: region,
            value: count
          }));
          tableData = chartData;
          console.log(chartData)
        }
        break;
      case 'unique-timezones-in-region':
        {
          const regionTimezones = {};
          countriesData.forEach(c => {
            if (!regionTimezones[c.region]) regionTimezones[c.region] = new Set();
            (c.timezones || []).forEach(tz => regionTimezones[c.region].add(tz));
          });
          chartData = Object.entries(regionTimezones).map(([region, tzSet]) => ({
            label: region,
            value: tzSet.size
          }));
          tableData = chartData;
        }
        break;
    }
    renderChart(chartData);
    renderTable(tableData);
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
      .on('mouseover', function (e, d) {
        showTooltip(e, d);
      })
      .on('mouseout', hideTooltip);

    function showTooltip(e, d) {
      let html = `<strong>${d.label}</strong><br>Value: ${d.value}`;
      if (d.details) {
        html += `<br>Region: ${d.details.region || ''}`;
      }
      d3.select('body').append('div')
        .attr('id', 'tooltip')

        .style('position', 'absolute')
        .style('left', (e.pageX + 10) + 'px')
        .style('top', (e.pageY + 10) + 'px')
        .style('background', '#fff')
        .style('border', '1px solid #ccc')
        .style('padding', '8px')
        .style('pointer-events', 'none')
        .html(html);
    }
    function hideTooltip() {
      d3.select('#tooltip').remove();
    }
  }
  function renderTable(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '';
    if (data.length === 0) return;

    const header = table.insertRow();
    header.insertCell().textContent = 'Label';
    header.insertCell().textContent = 'Value';

    data.forEach(row => {
      const tr = table.insertRow();
      tr.insertCell().textContent = row.label;
      tr.insertCell().textContent = row.value;
    });
  }
});
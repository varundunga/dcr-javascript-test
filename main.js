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
        console.log(option)
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
  }
});
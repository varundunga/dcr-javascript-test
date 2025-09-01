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
  }
});
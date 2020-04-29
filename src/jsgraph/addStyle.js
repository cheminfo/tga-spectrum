export default function addStyle(data, spectrum, options = {}) {
  const { color = 'darkgrey' } = options;
  data.styles = {
    unselected: {
      lineColor: color,
      lineWidth: 1,
      lineStyle: 1,
    },
    selected: {
      lineColor: color,
      lineWidth: 3,
      lineStyle: 1,
    },
  };
  data.label = spectrum.label || spectrum.id;
}

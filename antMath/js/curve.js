//current label
var nbIteration = 1;
//add a data in the chart and refresh it
function updateSample(nb) {
    chart.data.datasets[0].data.push(nb);
    chart.data.labels.push(nbIteration + '');
    nbIteration++;
    chart.update();
}

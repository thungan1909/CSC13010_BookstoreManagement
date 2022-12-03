var months = [1,2,3,4,5,6,7,8,9,10,11,12];
// For drawing the lines
var africa = [86,114,106,106,107,111,133,221,783,2478];
var asia = [282,350,411,502,635,809,947,1402,3700,5267];
var europe = [168,170,178,190,203,276,408,547,675,734];
var latinAmerica = [40,20,10,16,24,38,74,167,508,784];
var northAmerica = [6,3,2,2,7,26,82,172,312,433];

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: months,
    datasets: [
        { 
            data: africa,
            label: "Africa",
            backgroundColor: "#3e95cd",
            fill: false
          },
          { 
            data: asia,
            label: "Asia",
            backgroundColor: "#8e5ea2",
            fill: false
          },
          { 
            data: europe,
            label: "Europe",
            borderColor: "#3cba9f",
            fill: false
          },
          { 
            data: latinAmerica,
            label: "Latin America",
            backgroundColor: "#e8c3b9",
            fill: true
          },
          { 
            data: northAmerica,
            label: "North America",
            backgroundColor: "#c45850",
            fill: false
          }
    ]
  }
});
var ctx = document.getElementById("myChart");
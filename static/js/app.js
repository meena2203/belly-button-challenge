// // // Read the json file from the url to confirm and understand the data architecture // // //

// URL for fetching the data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Use the d3.json function to read in samples.json from the url
const dataProm = d3.json(url)

// // Print to console to confirm
// console.log(dataProm)

// // Use "then" method on the promised data (dataProm) to passin a function 
// dataProm.then(function(data){
//     console.log(data)
// })


// // // // Create 'initialize' function (int) to populate the dropdown menu and plot charts with first ID // // // //

function init() {
  // Read in the data from the url
  dataProm.then((data => {

    console.log('data: ' + JSON.stringify(data)) 
    
    // Using d3, select the element with id="selDataset" for rendering/ creating  'dropdown menu' (user input)
    var dropdown = d3.select("#selDataset");

  
    // Populate the dropdown menu with all the participant's ID - For each name (ID) in data.names, add each name as an option to the dropdown menu 
    data.names.forEach((name => {
      console.log('name: ' + name)
      var option = dropdown.append('option').text(name).property('value', name);
      
      console.log('option: ' + JSON.stringify(option));

    }));

    // Get the first participant ID (initID) from 'data.names' for the initial setup of all charts/table
    var initID = data.names[0]
    
    // Call demographic and plotChart (bar and bubble chart) functions with initID as for initial display
    demographicInfo(initID);
    plotChart(initID);  
  }));
}


// // // // Create 'changeOption' function to render/create charts with the 'selected ID' data // // // //

function optionChanged(selectedID) {
  demographicInfo(selectedID);
  plotChart(selectedID);
};

// // // // Create function for plotChart (bar and bubble chart)// // // //

function plotChart(selectedID) {
  // Read in the data from the url
  dataProm.then((data => {

    // To get the test subject (selectedID), filter the 'data.samples' on ID  
    testSubject = data.samples.filter(sample => sample.id == selectedID)[0];
    // console.log("testSubject: " + JSON.stringify(testSubject))    

    // Extract otu_id, sample_values, otu_labels of the test subject for plotting
    var ids = testSubject.otu_ids;
    var values = testSubject.sample_values;
    var labels = testSubject.otu_labels;

    // Horizontal Bar Chart: 
    // 'slice' function is used to get the first 10 (top 10) values from the list
    // 'reverse' function is used to flip the order to get the max value at the top
    // 'text' is used to add hovertext
    var trace1 = {
      x: values.slice(0, 10).reverse(),
      y: ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse(),
      text: labels.slice(0, 10).reverse(),
      name: 'Top 10 OTUs',
      orientation: 'h',
      type: 'bar',
      marker: {
        color: '#e377c2',
        line: {color: 'rgb(8,48,107)', width: 1.5}
      }      
    };

    var data = [trace1]
    var layout = {
      title: {text: `Top 10 OTUs for Test Subject ID# ${selectedID}`, font: {family: 'Arial Black', size: 24}},
      xaxis: { title: {text: 'Sample Values', font: {family: 'Arial Black', size: 14}}},
      yaxis: { title: {text: 'OTU ID', font: {family: 'Arial Black', size: 14}}},
      height: 600,
      width: 900 
    };  
           
    // Plot the bar chart (@ div with id="bar" in html.index)
    Plotly.newPlot('bar', data, layout);


    //  Bubble Chart
    var trace2 = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {color: ids, size: values, colorscale: 'Earth'}
    };
      
    var data = [trace2];
    var layout = {
      title: {text: 'OTU Distribution', font: {family: 'Arial Black', size: 24}},
      xaxis: { title: {text: 'OTU ID', font: {family: 'Arial Black', size: 14}}},
      yaxis: { title: {text: 'Sample Values', font: {family: 'Arial Black', size: 14}}},
      height: 600,
      width: 1200
    };
      
    // Plot the bubble chart (@ div with id="bubble" in html.index)
    Plotly.newPlot('bubble', data, layout);

  }));    
};

// // // Create function for demographic info (metadata) // // //

function demographicInfo(selectedID) {
  // Read in the data from the url
  dataProm.then((data => {

    // To get the test subject ID, filter the 'data.metadata' on ID  
    testSubject = data.metadata.filter(sample => sample.id == selectedID)[0];
    console.log("testSubject: " + JSON.stringify(testSubject)) 

    // Using d3, select the element with id="sample-metadata" for 'demographic info' table
    var demographics = d3.select("#sample-metadata");

    // Reset the element for the selected ID
    demographics.html('');
        
    // Append all the metadata (forEach) associated with test subject as key: value pairs (Object.enteries)
    Object.entries(testSubject).forEach(([key, value]) => {
      demographics.append('h5').text(`${key}:${value}`)
    });  
  }));    
}

// Call the 'init' function to intialize the interactive dashboard
init()
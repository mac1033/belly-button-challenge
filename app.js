
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  
  var selectedSample = data.samples[0];
  var selectedMetadata = data.metadata[0];
  
  var dropdownMenu = d3.select("#selDataset");
  data.names.forEach(function(sample) {
    dropdownMenu.append("option").text(sample).property("value", sample);
  });
  
  updateDashboard(selectedSample, selectedMetadata);
  function updateDashboard(selectedSample, selectedMetadata) {
    
    var metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html('');
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append('p').text(`${key}: ${value}`);
    });
    
    var barTrace = {
      x: selectedSample.sample_values.slice(0, 10).reverse(),
      y: selectedSample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
      type: 'bar',
      orientation: 'h',
      text: selectedSample.otu_labels.slice(0, 10).reverse()
    };
    var barLayout = {
      title: 'Top 10 OTUs'
    };
    Plotly.newPlot('bar', [barTrace], barLayout);
    
    var bubbleTrace = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      mode: 'markers',
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Earth'
      },
      text: selectedSample.otu_labels
    };
    var bubbleLayout = {
      title: 'Sample Data Bubble Chart',
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Sample Value'
      }
    };
    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
    
  }
  
  function optionChanged(newSample) {
    var newSampleIndex = data.names.indexOf(newSample);
    var newSampleData = data.samples[newSampleIndex];
    var newMetadata = data.metadata[newSampleIndex];
    updateDashboard(newSampleData, newMetadata);
  }
  
  dropdownMenu.on('change', function() {
    var newSample = d3.select(this).property('value');
    optionChanged(newSample);
  });
  
});
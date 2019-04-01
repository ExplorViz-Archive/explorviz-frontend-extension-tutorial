import Component from '@ember/component';
import layout from '../../templates/components/landscape-select/timeline';
import Timeline from 'explorviz-frontend/components/visualization/page-setup/timeline/timeline';

export default Timeline.extend({
  tutorialLandscapes:false,
  landscapeTimestamp:false,
  layout,
  renderChart(){
    if(!this.get('tutorialLandscapes')){
      this._super(...arguments);
    }else{
      const self = this;

      self.debug("start timeline init");

      const backgroundColor = self.get('chartColors.default.backgroundColor');
      const borderColor = self.get('chartColors.default.borderColor');

      // chart data
      var chartValues = [];
      var chartLabels = [];

      // setting the context for the chart
      var ctx = $('#timelineCanvas').get(0).getContext('2d');

      // Chart configuration
      var chartConfig = {
          type: 'bar',
          data: {
              labels: chartLabels,
              datasets: [{
                  label: 'Requests',
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  data: chartValues,
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                  padding: {
                      left: 0,
                      right: 35,
                      top: 25,
                      bottom: 0
                  }
              },
              tooltips: {
                  enabled: true,
                  mode: 'point',
              },
              legend: {
                  display: false
              },
              scales: {
                  xAxes: [{
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: 'Time',
                          fontStyle: 'bold'
                      },
                      type: 'time',
                      distribution: 'series',
                      time: {
                          unit: 'second',
                          displayFormats: {
                              second: 'HH:mm:ss'
                          },
                          tooltipFormat: 'DD.MM.YYYY - kk:mm:ss'
                      },
                      ticks: {
                          source: 'labels',
                      }
                  }],
                  yAxes: [{
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: 'Total Requests',
                          fontStyle: 'bold'
                      },
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              },
              // performance optimizations
              elements: {
                  line: {
                      tension: 0, // disables bezier curves
                  }
              },
              'onClick': function (evt) {
                  self.chartClickHandler(evt);
              },
          }
      };

      var timelineChart = new Chart(ctx, chartConfig);
      self.set('tutorialtimelineChart', timelineChart);
      const updatedTimelineChart = self.get('tutorialtimelineChart');

      const newTimelineData = {
          x: 1553961723688,
          y: 100
      };
      updatedTimelineChart.data.datasets[0].data.push(newTimelineData);
      updatedTimelineChart.data.labels.push(1553961723688);
      self.set('tutorialtimelineChart', updatedTimelineChart);
      updatedTimelineChart.update();
      self.debug("end timeline init");
    }
  },
  initChart(){
      if(!this.get('tutorialLandscapes')){
        this._super(...arguments);
      }else{
        const self = this;

        // referencing the canvas
        self.set('canvas', $('#timelineCanvas').get(0));

        // setting the default colors for highlighting and resetting purposes
        const color = Chart.helpers.color;

        self.set('chartColors', {
            default: {
                backgroundColor: color('rgb(0, 123, 255)').alpha(0.5).rgbString(),
                borderColor: 'rgba(0,0,0,0.1)',
                radius: '3'
            },
            highlighted: {
                backgroundColor: 'red',
                borderColor: 'black',
                radius: '4'
            }
        });

        // setting the maximum number of data points shown in the timeline
        self.set('maxNumOfDataPoints', 10);
      }
  },
  chartClickHandler(evt) {
    if(!this.get('tutorialLandscapes')){
      this.super(...arguments);
    }else{
      const self = this;

      const timelineChart = self.get('timelineChart');

      const colorsDefault = self.get('chartColors.default');
      const colorsHighlighted = self.get('chartColors.highlighted');

      var activePoint = timelineChart.getElementAtEvent(evt)[0];
      const lastHighlightedElementIndex = self.get('lastHighlightedElementIndex');

      // data point clicked - only one data point is highlighted at a time
      if (activePoint) {
          var data = activePoint._chart.data;
          var datasetIndex = activePoint._datasetIndex;
          var elementIndex = activePoint._index;
          var retrievedTimestamp = data.datasets[datasetIndex].data[elementIndex].x;

          // data point was already highlighted
          if (lastHighlightedElementIndex === elementIndex) {
              // do nothing
          } else {
              // highlight clicked data point
              timelineChart.getDatasetMeta(datasetIndex).data[elementIndex].custom = colorsHighlighted;

              // reset the style of the previous data point
              if (lastHighlightedElementIndex) {
                  timelineChart.getDatasetMeta(datasetIndex).data[lastHighlightedElementIndex].custom = colorsDefault;
              }

              // save the index of the clicked data point
              self.set('lastHighlightedElementIndex', elementIndex);

              self.set('timelineChart', timelineChart);
              timelineChart.update();

              // load specific landscape and pause visulization

              // convert timestamp to readable date for notification
              const formattedTimestamp = timestampToDate([retrievedTimestamp]);

              self.showAlertifyMessage("Loading landscape [" + formattedTimestamp + "]");
              self.handleNotificationMessage(false);
              self.get('store').queryRecord('tutoriallandscape', {timestamp: timestamp}).then(success, failure).catch(error);
              this.landscapeTimestamp=timestamp;

          }
      } else {
          // reset the style of the previous data point and unpause the visualization
          if (lastHighlightedElementIndex) {

              timelineChart.getDatasetMeta(0).data[lastHighlightedElementIndex].custom = colorsDefault;

              self.set('lastHighlightedElementIndex', null);

              self.set('tutorialtimelineChart', timelineChart);
              timelineChart.update();

              self.handleNotificationMessage(true);

          }
          // TODO
          // maybe Bug within ChartJS? The first data point can't be unhighlighted like the others
          else {
              self.unhighlightFirstDataPoint();
          }
      }
    }
  },

});

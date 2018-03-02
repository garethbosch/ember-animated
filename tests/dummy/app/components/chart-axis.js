import Component from '@ember/component';
import layout from '../templates/components/chart-axis';
import { computed } from '@ember/object';


export default Component.extend({
  layout,
  tagName: '',

  tickCount: 10,
  key: '',
  log: '2',
  axis: 'x',
  label: 'Your Axis',

  isXaxis: computed('axis', function() {
    return this.get('axis') === 'x' || this.get('axis') === 'X';
  }),
  isYaxis: computed('axis', function() {
    return this.get('axis') === 'y' || this.get('axis') === 'Y';
  }),
  axisBounds: computed('model', 'key', function() {
    return keyValueBounds(this.get('model'), this.get('key'));
  }),
  tickMarks: computed('tickCount', 'axisBounds', 'log', function() {
    return tickPositions(this.get('tickCount'), this.get('axisBounds'), this.get('log'), this.get('axis'));
  }),
});

// Find the minimun and maximun values that exist in all rows of
//   the model for the given key.
function keyValueBounds(rows, key) {
  let keyVals = [];
  rows.forEach(row => {
    keyVals.push(row[key]);
  });
  let upperBound = keyVals.reduce(function(a, b) {
    return Math.max(a, b);
  });
  let lowerBound = keyVals.reduce(function(a, b) {
    return Math.min(a, b);
  });
  return [lowerBound, upperBound];
}
// Find the positions (in percent) of the tick marks on the axis
//   and the real (log2 scale) values of those positions.
// Returns an array of objects. Each object is a tick mark on the axis
//   with parameters 'figure' and 'position.'
function tickPositions(numberOfTicks, bounds, log, axis) {
  let min = bounds[0];
  let max = bounds[1];
  if (log === '2') {
    min = Math.log2(bounds[0]);
    max = Math.log2(bounds[1]);
  }
  if (log === '10') {
    min = Math.log10(bounds[0]);
    max = Math.log10(bounds[1]);
  }  
  let marks = [];
  let interval = 100/numberOfTicks;
  // count to each interval from 0-100
  for (let i = 0; i+interval <= 100; i+= interval) { 
    let relativePos = (Math.trunc( (i + interval) * 100 ) / 100);// percent to 2 dec places
    let value = Math.pow(2, (relativePos/100 * (max - min) + min))  // real value on the log scale
    marks.push({figure: Math.round(value), position: relativePos.toString(10)+'%'})
  }
  return marks;
}
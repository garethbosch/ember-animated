import Component from '@ember/component';
import layout from '../templates/components/chart-axis';
import { computed } from '@ember/object';


export default Component.extend({
  layout,
  tagName: '',
  tickCount: 10,
  key: '',
  tickValues: computed('model', function() {
    let bounds = keyValueBounds(this.get('model'), this.get('key'))
    return bounds;
  }),
  tickMarks: computed('tickCount', 'tickValues', function() {
    return tickPositions(this.get('tickCount'), this.get('tickValues'));
  }),

  label: 'Your Axis',
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
//   and the real values of those positions.
// Returns an array of objects. Each object is a tick mark on the axis
//   with parameters 'figure' and 'position.'
function tickPositions(numberOfTicks, bounds) {
  let marks = [];
  let span = bounds[1] - bounds[0]; // the span of values the axis covers
  let interval = 100/numberOfTicks;
  // count to each interval from 0-100
  for (let i = 0; i+interval <= 100; i+= interval) { 
    let relativePos = (Math.trunc( (i + interval) * 100 ) / 100);// percent to 2 dec places
    let value = span * (relativePos/100)  // real value represented by the tick mark
    marks.push({figure: value, position: relativePos.toString(10)+'%'})
  }
  return marks;
}
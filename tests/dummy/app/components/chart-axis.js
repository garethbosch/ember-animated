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
  tickMarks: computed('tickCount', function() {
    return positionsFor(this.get('tickCount'));
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
// Find the positions for the tick marks on the axis.
// Each position is a percentage of the total axis length.
function positionsFor(numberOfTicks) {
  let positions = [];
  let interval = 100/numberOfTicks;
  for (let i = 0; i+interval <= 100; i+= interval) {
    positions.push((Math.trunc( (i + interval) * 100 ) 
      / 100).toString(10) + '%');  // string: percent to 2 dec places
  }
  return positions;
}
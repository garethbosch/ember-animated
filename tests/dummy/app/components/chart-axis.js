import Component from '@ember/component';
import layout from '../templates/components/chart-axis';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';


export default Component.extend({
  layout,
  tagName: '',
  tickCount: 10,
  key: '',
  tickMarks: computed('model', function() {
    let bounds = findMinMax(this.get('model'), this.get('key'))
    return bounds;
  }),

  label: 'This might be an axis',
});

function findMinMax(rows, key) {
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
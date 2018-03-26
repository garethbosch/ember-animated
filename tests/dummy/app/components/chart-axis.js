import Component from '@ember/component';
import layout from '../templates/components/chart-axis';
import { computed } from '@ember/object';


export default Component.extend({
  layout,
  tagName: '',

  key: '',            // element of the model to be used for the axis
  tickCount: 10,      // how many tick marks to display on the axis
  scale: '',          // 'log' or nothing
  axis: 'x',          // 'x' or 'y' axis
  label: 'Your Axis', // name of the axis

  isXaxis: computed('axis', function() {
    return this.get('axis').toLowerCase() === 'x';
  }),
  isYaxis: computed('axis', function() {
    return this.get('axis').toLowerCase() === 'y';
  }),
  axisBounds: computed('model', 'key', function() {
    return keyValueBounds(this.get('model'), this.get('key'));
  }),
  tickMarks: computed('tickCount', 'axisBounds', 'scale', function() {
    return tickPositions(this.get('tickCount'), this.get('axisBounds'), this.get('scale'), this.get('isYaxis'));
  }),
});

// Finds the minimun and maximun values that exist in all rows of
//   the model for the given key.
function keyValueBounds(rows, key) {
  let keyVals = rows.map(row => row[key]);
  let upperBound = keyVals.reduce(function(a, b) {
    return Math.max(a, b);
  });
  let lowerBound = keyVals.reduce(function(a, b) {
    return Math.min(a, b);
  });
  return [lowerBound, upperBound];
}

// Finds the positions (in percent) of the tick marks on the axis
//   and the real values of those positions.
// Returns an array of objects. Each object is a tick mark on the axis
//   with parameters 'figure' and 'position.'
function tickPositions(numberOfTicks, bounds, scale, isYaxis) {
  let min = bounds[0];
  let max = bounds[1];
  let marks = [];
  // catch NaN
  let interval = 100/numberOfTicks;
  let value;
  let posOnAxis;
  if (scale === 'log') {
    min = Math.log2(min);
    max = Math.log2(max);
      // count to each interval from 0-100
    for (let i = 0; i+interval <= 100; i+= interval) { 
      // truncate this percentage of the axis to 2 dec places
      posOnAxis = (Math.trunc( (i + interval) * 100 ) / 100);
      // real value of this percentage on a log base 2 scale
      value = Math.round(Math.pow(2, (posOnAxis/100 * (max - min) + min)));
      marks.push({figure: roundLabel(value), position: posOnAxis.toString(10)+'%'});
    }
    marks.pop();  // ignore the last tickmark on the axis
} 
  else if (scale !== 'log') {
    for (let i = 0; i+interval <= 100; i+= interval) { 
      posOnAxis = (Math.trunc( (i + interval) * 100 ) / 100);
      if (isYaxis) {  // origin of svg element is at lop left, so y-axis values must be inverted
        value = (1 - posOnAxis/100) * (max - min) + min;
      } else { 
        value = posOnAxis/100 * (max - min) + min;
      }
      if (max - min <= 100) {       // the range is too small for roundLabel() to make sense
        value = Math.round(value);  //   (it will cause duplicate tick mark values)
      } else {
        value = roundLabel(value);
      }
      marks.push({figure: Math.round(value), position: posOnAxis.toString(10)+'%'});
    }
    marks.pop();
  }
  return marks;
}

// Rounds the value based on number of digits
function roundLabel(val) {
  val = Math.trunc(val);  // round it as an integer
  let factor;
  switch (val.toString(10).length) {
    case 2:
      factor = Math.pow(10, -1);
      break;
    case 3:
      factor = Math.pow(10, -2);
      break;
    case 4:
      factor = Math.pow(10, -2);
      break;
    case 5:
      factor = Math.pow(10, -3);
      break;
    case 6:
      factor = Math.pow(10, -4);
      break;
    case 7:
      factor = Math.pow(10, -6);
      break;
    default:
      factor = Math.pow(10, 0);
      break;
  }
  return Math.round(val * factor) / factor;
}
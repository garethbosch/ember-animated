import Component from '@ember/component';
import layout from '../templates/components/chart-axis';
import { computed } from '@ember/object';


export default Component.extend({
  layout,
  tagName: '',

  axisTickMarks,

});

function axisTickMarks(n) {
  return ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%" ];
}
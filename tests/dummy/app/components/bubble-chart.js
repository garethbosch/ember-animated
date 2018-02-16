import Component from '@ember/component';
import layout from '../templates/components/bubble-chart';
import { computed } from '@ember/object';
import Move from 'ember-animated/motions/move';

export default Component.extend({

  currentYear: 1980,
  points: computed('currentYear', 'model', function(){
    let currentYear = parseInt(this.get('currentYear'));
    let myRow = this.get('model').filter(row => row.year === currentYear);

    return myRow.sort((a, b) => b.population - a.population);
  }),
  transition,

  layout,

  isTraversingYears: false,
  actions: {
    play() {
      if (this.isTraversingYears) { return; }

      this.set('isTraversingYears', true);

      setInterval(() => {
        this.set('currentYear', parseInt(this.get('currentYear')) + 1);
      }, 100);

    }
  }
});

function * transition() {
  this.keptSprites.forEach(s => this.animate(new Move(s)));
}
import Component from '@ember/component';
import layout from '../templates/components/bubble-chart';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { rAF } from 'ember-animated';
import moveCircle from '../motions/move-circle';


export default Component.extend({
  layout,

  currentYear: 1980,
  fastCurrentYear: 1980,
  points: computed('currentYear', 'model', function(){
    let currentYear = parseInt(this.get('currentYear'));
    let yearlyData = this.get('model').filter(row => row.year === currentYear);
    yearlyData.forEach(bubble => {
      bubble.hue = 'orange';
    });
    return yearlyData.sort((a, b) => b.population - a.population);
  }),
  changeName,

  myColor: 'orange',
  myNum: 999,
  setColor: task(function * () {
    let hues = ['aquamarine', 'coral', 'chocolate', 'chartreuse', 'cornflowerblue', 'gold', 
                'lightgreen', 'lightsteelblue', 'mediumpurple', 'orchid', 'peru', 'thistle'];
    this.set('myNum', Math.floor(Math.random() * 20));
  }).on('init'),

  playID: null, 
  play: task(function * () {
      while (this.get('currentYear') < 2015) {
        this.set('currentYear', parseInt(this.get('currentYear')) + 1);
        yield rAF();
      } 
  }).drop(),
  updateCurrentYear: task(function * () {
    while (true) {
      this.set('currentYear', parseInt(this.get('fastCurrentYear')));
      yield timeout(200);
    } 
  }).on('init'),

  startingYear: 1950,
  endingYear: 2015,
  playLoop: task(function * () {
    while (true) {
      this.set('currentYear', parseInt(this.get('startingYear')));
      while (this.get('currentYear') < parseInt(this.get('endingYear'))) {
        this.set('currentYear', parseInt(this.get('currentYear')) + 1);
        yield rAF();
      } 
    }
  }).drop(),

  moveThem: function * ({ keptSprites }) {
    keptSprites.forEach(moveCircle);
  },

  actions: { pause() {
    this.get('play').cancelAll();
    this.get('playLoop').cancelAll();
  }},
});

function changeName(name) {
  return name + "00000";
}
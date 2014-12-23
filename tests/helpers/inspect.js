import Em from 'ember';

export function inspect(app, name, useJquery) {
  var element = find('[data-test="notify-' + name + '"]')[0];

  if (useJquery === false) {
    return element;
  } else {
    return $(element);
  }
}

export default Em.Test.registerHelper('inspect', inspect);
function logobj(obj) {
  if (typeof console !== 'undefined')
    console.log(JSON.stringify(obj, null, '\t'));
}

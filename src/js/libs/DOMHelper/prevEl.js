/*function prevEl()*/
function prevEl(name, options) {
  if (typeof options !== 'object') {
    options = {};
  }

  if (typeof options.rev !== 'boolean') {
    options.rev = true;
  }

  options.manifest = buildPath;

  return getLmnTask(name, options);
}
const union = require('folktale/adt/union/union');

const IncrementedOrReleasedBlock = union('IncrementedOrReleasedBlock', {
  Incremented(value) {
    return { value };
  },
  Released(value) {
    return { value };
  },
  Nil(value) {
    return { value };
  }
});

Object.defineProperty(IncrementedOrReleasedBlock, 'value', {
  get: function () {
    return this._value;
  },
  set: function (val) {
    this._value = val;
  }
});

IncrementedOrReleasedBlock.or = function (fn) {
  return this.matchWith({
    Incremented: ({ value }) => {
      return this;
    },
    Released: ({ value }) => {
      return this;
    },
    Nil: () => {
      return fn();
    }
  });
};

export default IncrementedOrReleasedBlock;




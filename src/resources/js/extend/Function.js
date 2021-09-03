Function.prototype.inherits = function (Parent) {
    this.prototype = Object.create(Parent.prototype);
    this.prototype.parent = Parent;
    this.prototype.constructor = this;
    Object.setPrototypeOf(this, Parent);
    return this;
};
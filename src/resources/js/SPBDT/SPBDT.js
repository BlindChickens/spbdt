function registerInheritance(parent, sub) {
    parent._registerInheritance(sub);
    parent._subclasses.push(sub);
    //parent._onSubclass(sub);
}

export default class SPBDT {
    constructor() {
        this.constructor._registerInheritance();
    }
    static _registerInheritance(subclass){
        if (this !== SPBDT) {
            let parentclass = Object.getPrototypeOf(this);
            if (!parentclass.hasOwnProperty('_subclasses')) {
                parentclass._subclasses = [];
            }
            if (this._parentclass !== parentclass) {
                registerInheritance(parentclass, this);
                this._parentclass = parentclass;
            }
            if (subclass) {
                registerInheritance(parentclass, subclass);
            }
        }
        return this;
    }
};
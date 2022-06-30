/**
 ArpeggioPatterns
 https://codepen.io/jakealbaugh/pen/PzpzEO/
 returns arrays of arpeggio patterns for a given length of notes
 @param steps {Integer} number of steps
 @return {Object}
 patterns: {Array} of arpeggiated index patterns
 */

export default class ArpeggioPatterns {
    constructor(params) {
        this.steps = params.steps;
        this._loadPatterns();
        this.updatePatterns = this.pubUpdatePatterns;
    };

    pubUpdatePatterns(params) {
        this.steps = params.steps;
        this._loadPatterns();
    };

    _loadPatterns() {
        this.arr = [];
        this.patterns = [];
        for(let i = 0; i < this.steps; i++) { this.arr.push(i); }
        this._used = [];
        this.permutations = this._permute(this.arr);
        this.looped = this._loop();
        this.patterns = {
            straight: this.permutations,
            looped: this.looped
        };
    };

    _permute(input, permutations) {
        permutations = permutations || [];
        var i, ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            this._used.push(ch);
            if (input.length === 0) {
                permutations.push(this._used.slice());
            }
            this._permute(input, permutations);
            input.splice(i, 0, ch);
            this._used.pop();
        }
        return permutations;
    };

    _loop() {
        let looped = [];
        for(let p = 0; p < this.permutations.length; p++) {
            let perm = this.permutations[p];
            let arr = Array.from(perm);
            for(let x = 1; x < perm.length - 1; x++) {
                arr.push(perm[perm.length - 1 - x]);
            }
            looped.push(arr);
        }
        return looped;
    };

};
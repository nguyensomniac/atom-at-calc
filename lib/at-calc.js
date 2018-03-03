'use babel';

import { CompositeDisposable } from 'atom';
import math from 'mathjs';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'at-calc:calculate': () => this.calculate()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  calculate() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const cursorPositions = editor.getCursorBufferPositions();
      cursorPositions.map((pos) => {
        const content = editor.lineTextForBufferRow(pos.row);
        const regexMatch = /(@@|@@rem)\((.*)\)/
        if (regexMatch.test(content)) {
          const newLine = content.replace(regexMatch, (match, p1, p2) => {
            switch (p1) {
              case '@@rem':
                return `${math.eval(p2) / 16.0}rem`;
              case '@@':
                return math.eval(p2);
            }
          });
          editor.setTextInBufferRange([[pos.row, 0], [pos.row, content.length]], `${newLine}`);
        }
      })
    }
  }

};

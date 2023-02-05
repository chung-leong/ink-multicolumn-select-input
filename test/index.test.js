import { expect } from 'chai';
import { createElement } from 'react';
import { delay } from 'react-seq';
import { Text } from 'ink';
import { render } from 'ink-testing-library';

import MulticolumnSelectInput from '../index.js';

describe('#MulticolumnSelectInput', function() {
  it('should render a list of items', function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12 });
    }
    const el = createElement(Test);
    const { lastFrame } = render(el);
    const s = lastFrame();
    const t = s.replace(/\u001b\[.*?[@-~]/g, '');
    const lines = t.split('\n');
    expect(lines).to.have.lengthOf(12);
    expect(lines[0]).to.match(/^\s+filename1\.ext\s+filename13\.ext\s+filename25\.ext/);
    expect(lines[11]).to.match(/^\s+filename12\.ext\s+filename24\.ext\s+filename36\.ext/);
  })
  it('should use custom indicator', function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent });
    }
    const el = createElement(Test);
    const { lastFrame } = render(el);
    const s = lastFrame();
    const t = s.replace(/\u001b\[.*?[@-~]/g, '');
    const lines = t.split('\n');
    expect(lines[0]).to.match(/^X filename1\.ext\s+filename13\.ext\s+filename25\.ext/);
    expect(lines[11]).to.match(/^\s+filename12\.ext\s+filename24\.ext\s+filename36\.ext/);
  })
  it('should shift columns when initialIndex indicates the selected item is out of view', function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const initialIndex = 50;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, initialIndex, });
    }
    const el = createElement(Test);
    const { lastFrame } = render(el);
    const s = lastFrame();
    const t = s.replace(/\u001b\[.*?[@-~]/g, '');
    const lines = t.split('\n');
    expect(lines[1]).to.match(/^\s+filename26\.ext\s+filename38\.ext\s+filename50\.ext/);
  })
  it('should select the next item when j or down-arrow is pressed', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('j');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[1]).to.match(/^X filename2\.ext\s+filename14\.ext\s+filename26\.ext/);
    stdin.write('\u001B[B');
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[2]).to.match(/^X filename3\.ext\s+filename15\.ext\s+filename27\.ext/);
  })
  it('should select the next item when k or up-arrow is pressed', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 3;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('k');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[2]).to.match(/^X filename3\.ext\s+filename15\.ext\s+filename27\.ext/);
    stdin.write('\u001B[A');
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[1]).to.match(/^X filename2\.ext\s+filename14\.ext\s+filename26\.ext/);
  })
  it('should move to the next column when l or right-arrow is pressed', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 2;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('l');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[2]).to.match(/^  filename3\.ext\s+X filename15\.ext\s+filename27\.ext/);
    stdin.write('\u001B[C');
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[2]).to.match(/^  filename3\.ext\s+filename15\.ext\s+X filename27\.ext/);
  })
  it('should move to the previous column when h or left-arrow is pressed', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 26;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('h');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[2]).to.match(/^  filename3\.ext\s+X filename15\.ext\s+filename27\.ext/);
    stdin.write('\u001B[D');
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[2]).to.match(/^X filename3\.ext\s+filename15\.ext\s+filename27\.ext/);
  })
  it('should select first item when ^ or home is pressed', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 123;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('^');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[0]).to.match(/^X filename1\.ext\s+filename13\.ext\s+filename25\.ext/);
    stdin.write('j');
    stdin.write('l');
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[1]).to.match(/^  filename2\.ext\s+X filename14\.ext\s+filename26\.ext/);
    stdin.write('\u001B[H');
    const t3 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines3 = t3.split('\n');
    expect(lines3[0]).to.match(/^X filename1\.ext\s+filename13\.ext\s+filename25\.ext/);
  })
  it('should select last item when $ or end is pressed', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 4;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('$');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[5]).to.match(/^  filename126\.ext\s+filename138\.ext\s+X filename150\.ext/);
    stdin.write('k');
    stdin.write('h');
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[4]).to.match(/^  filename125\.ext\s+X filename137\.ext\s+filename149\.ext/);
    stdin.write('\u001B[F');
    const t3 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines3 = t3.split('\n');
    expect(lines3[5]).to.match(/^  filename126\.ext\s+filename138\.ext\s+X filename150\.ext/);
  })
  it('should select last item when l is pressed and the currently selected item is in next to last column', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 143;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('l');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[5]).to.match(/^  filename126\.ext\s+filename138\.ext\s+X filename150\.ext/);
  })
  it('should not select last item when the currently selected item is in last column', async function() {
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      const initialIndex = 145;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent, initialIndex });
    }
    const el = createElement(Test);
    const { lastFrame, stdin } = render(el);
    await delay(0);
    stdin.write('l');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[5]).to.match(/^  filename126\.ext\s+filename138\.ext\s+filename150\.ext/);
  })
  it('should call onHiglight when the selection changes', async function() {
    let highlighted;
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const onHighlight = item => highlighted = item;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, onHighlight });
    }
    const el = createElement(Test);
    const { stdin } = render(el);
    await delay(0);
    stdin.write('j');
    expect(highlighted).to.have.property('value', 'filename2.ext');
  })
  it('should call onSelect when enter is pressed', async function() {
    let selected;
    function Test() {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = `filename${i}.ext`;
        items.push({ label: filename, value: filename });
      }
      const onSelect = item => selected = item;
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, onSelect });
    }
    const el = createElement(Test);
    const { stdin } = render(el);
    await delay(0);
    stdin.write('j');
    stdin.write('\r');
    expect(selected).to.have.property('value', 'filename2.ext');
  })
  it('should reset selection index upon receiving items with different values', async function() {
    function Test({ stage }) {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const filename = (stage === 1) ? `filename${i}.ext` : `FILENAME${i}.EXT`;
        items.push({ label: filename, value: filename });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent });
    }
    const el1 = createElement(Test, { stage: 1 });
    const { lastFrame, stdin, rerender } = render(el1);
    await delay(0);
    stdin.write('l');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[0]).to.match(/^\s+filename1\.ext\s+X filename13\.ext\s+filename25\.ext/);
    const el2 = createElement(Test, { stage: 2 });
    rerender(el2);
    // wait for useEffect to trigger
    await delay(0);
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[0]).to.match(/^X FILENAME1\.EXT\s+FILENAME13\.EXT\s+FILENAME25\.EXT/);
  })
  it('should not reset selection index when only the item labels have changed', async function() {
    function Test({ stage }) {
      const items = [];
      for (let i = 1; i <= 150; i++) {
        const label = (stage === 1) ? `filename${i}.ext` : `FILENAME${i}.EXT`;
        const value = `filename${i}.ext`;
        items.push({ label, value });
      }
      const indicatorComponent = ({ isSelected }) => {
        return createElement(Text, {}, isSelected ? 'X' : ' ');
      };
      return createElement(MulticolumnSelectInput, { items, width: 80, limit: 12, indicatorComponent });
    }
    const el1 = createElement(Test, { stage: 1 });
    const { lastFrame, stdin, rerender } = render(el1);
    await delay(0);
    stdin.write('l');
    const t1 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines1 = t1.split('\n');
    expect(lines1[0]).to.match(/^\s+filename1\.ext\s+X filename13\.ext\s+filename25\.ext/);
    const el2 = createElement(Test, { stage: 2 });
    rerender(el2);
    // wait for useEffect to trigger
    await delay(0);
    const t2 = lastFrame().replace(/\u001b\[.*?[@-~]/g, '');
    const lines2 = t2.split('\n');
    expect(lines2[0]).to.match(/^  FILENAME1\.EXT\s+X FILENAME13\.EXT\s+FILENAME25\.EXT/);
  })
})

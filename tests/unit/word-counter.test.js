/**
 * Word Counter Unit Tests
 */

// Mock DOM elements
document.body.innerHTML = `
  <textarea id="text-input"></textarea>
  <div id="word-count">0</div>
  <div id="char-count">0</div>
  <div id="char-no-space">0</div>
  <div id="sentence-count">0</div>
  <div id="paragraph-count">0</div>
  <div id="line-count">0</div>
  <div id="reading-time">0 min</div>
  <div id="speaking-time">0 min</div>
  <button id="copy-text"></button>
  <button id="clear-text"></button>
`;

// Load the module
require('../../src/js/word-counter.js');

describe('WordCounter', () => {
  beforeEach(() => {
    document.getElementById('text-input').value = '';
  });

  describe('countWords', () => {
    test('counts words correctly', () => {
      expect(WordCounter.countWords('Hello world')).toBe(2);
      expect(WordCounter.countWords('One')).toBe(1);
      expect(WordCounter.countWords('  Multiple   spaces   here  ')).toBe(3);
    });

    test('returns 0 for empty text', () => {
      expect(WordCounter.countWords('')).toBe(0);
      expect(WordCounter.countWords('   ')).toBe(0);
      expect(WordCounter.countWords(null)).toBe(0);
    });

    test('handles special characters', () => {
      expect(WordCounter.countWords('Hello, world!')).toBe(2);
      expect(WordCounter.countWords('test@email.com')).toBe(1);
    });
  });

  describe('countCharacters', () => {
    test('counts all characters including spaces', () => {
      expect(WordCounter.countCharacters('Hello')).toBe(5);
      expect(WordCounter.countCharacters('Hello world')).toBe(11);
      expect(WordCounter.countCharacters('  ')).toBe(2);
    });

    test('returns 0 for empty or null', () => {
      expect(WordCounter.countCharacters('')).toBe(0);
      expect(WordCounter.countCharacters(null)).toBe(0);
    });
  });

  describe('countCharactersNoSpaces', () => {
    test('counts characters excluding spaces', () => {
      expect(WordCounter.countCharactersNoSpaces('Hello world')).toBe(10);
      expect(WordCounter.countCharactersNoSpaces('a b c')).toBe(3);
    });

    test('handles tabs and newlines', () => {
      expect(WordCounter.countCharactersNoSpaces('Hello\tworld')).toBe(10);
      expect(WordCounter.countCharactersNoSpaces('Hello\nworld')).toBe(10);
    });
  });

  describe('countSentences', () => {
    test('counts sentences ending with period', () => {
      expect(WordCounter.countSentences('Hello. World.')).toBe(2);
      expect(WordCounter.countSentences('One sentence.')).toBe(1);
    });

    test('counts sentences with different punctuation', () => {
      expect(WordCounter.countSentences('Hello! How are you? Fine.')).toBe(3);
    });

    test('returns 0 for no sentences', () => {
      expect(WordCounter.countSentences('')).toBe(0);
      expect(WordCounter.countSentences('No punctuation here')).toBe(0);
    });
  });

  describe('countParagraphs', () => {
    test('counts paragraphs separated by blank lines', () => {
      expect(WordCounter.countParagraphs('Para 1\n\nPara 2')).toBe(2);
      expect(WordCounter.countParagraphs('Single paragraph')).toBe(1);
    });

    test('handles multiple blank lines', () => {
      expect(WordCounter.countParagraphs('Para 1\n\n\n\nPara 2')).toBe(2);
    });

    test('returns 0 for empty text', () => {
      expect(WordCounter.countParagraphs('')).toBe(0);
      expect(WordCounter.countParagraphs('   ')).toBe(0);
    });
  });

  describe('countLines', () => {
    test('counts lines correctly', () => {
      expect(WordCounter.countLines('Line 1\nLine 2\nLine 3')).toBe(3);
      expect(WordCounter.countLines('Single line')).toBe(1);
    });

    test('returns 0 for empty text', () => {
      expect(WordCounter.countLines('')).toBe(0);
      expect(WordCounter.countLines(null)).toBe(0);
    });
  });

  describe('getReadingTime', () => {
    test('calculates reading time correctly', () => {
      expect(WordCounter.getReadingTime(200)).toBe('1 min');
      expect(WordCounter.getReadingTime(400)).toBe('2 min');
      expect(WordCounter.getReadingTime(50)).toBe('15 sec');
    });

    test('handles zero words', () => {
      expect(WordCounter.getReadingTime(0)).toBe('0 sec');
    });

    test('handles large word counts', () => {
      expect(WordCounter.getReadingTime(12000)).toBe('1 hr');
      expect(WordCounter.getReadingTime(13000)).toBe('1 hr 5 min');
    });
  });

  describe('getSpeakingTime', () => {
    test('calculates speaking time correctly', () => {
      expect(WordCounter.getSpeakingTime(150)).toBe('1 min');
      expect(WordCounter.getSpeakingTime(300)).toBe('2 min');
    });
  });

  describe('analyze', () => {
    test('returns complete analysis object', () => {
      const text = 'Hello world. This is a test.';
      const result = WordCounter.analyze(text);

      expect(result).toHaveProperty('words');
      expect(result).toHaveProperty('characters');
      expect(result).toHaveProperty('charactersNoSpaces');
      expect(result).toHaveProperty('sentences');
      expect(result).toHaveProperty('paragraphs');
      expect(result).toHaveProperty('lines');
      expect(result).toHaveProperty('readingTime');
      expect(result).toHaveProperty('speakingTime');

      expect(result.words).toBe(6);
      expect(result.sentences).toBe(2);
    });
  });
});

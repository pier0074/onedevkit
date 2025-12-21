/**
 * Unit tests for Lorem Ipsum Generator
 */

// Load the Lorem Ipsum module
require('../../src/js/lorem-ipsum.js');

describe('LoremIpsumGenerator', () => {
  const LoremIpsum = window.LoremIpsumGenerator;

  describe('generateWords()', () => {
    test('generates correct number of words', () => {
      const result = LoremIpsum.generateWords(10);
      const words = result.split(/\s+/).filter(w => w.length > 0);
      expect(words.length).toBe(10);
    });

    test('starts with "Lorem ipsum" when option enabled', () => {
      const result = LoremIpsum.generateWords(10, true);
      expect(result.toLowerCase()).toMatch(/^lorem ipsum/);
    });

    test('generates single word', () => {
      const result = LoremIpsum.generateWords(1);
      expect(result.split(/\s+/).length).toBe(1);
    });

    test('generates many words', () => {
      const result = LoremIpsum.generateWords(100);
      const words = result.split(/\s+/).filter(w => w.length > 0);
      expect(words.length).toBe(100);
    });
  });

  describe('generateSentences()', () => {
    test('generates correct number of sentences', () => {
      const result = LoremIpsum.generateSentences(5);
      // Count sentences by any punctuation (.!?) followed by space or end
      const sentences = result.split(/[.!?]\s*/).filter(s => s.length > 0);
      expect(sentences.length).toBe(5);
    });

    test('each sentence ends with punctuation', () => {
      const result = LoremIpsum.generateSentences(3);
      // Sentences can end with . ! or ?
      expect(result.trim()).toMatch(/[.!?]$/);
    });

    test('sentences start with capital letter', () => {
      const result = LoremIpsum.generateSentences(3);
      const sentences = result.split(/\.\s+/);
      sentences.forEach(sentence => {
        if (sentence.length > 0) {
          expect(sentence[0]).toMatch(/[A-Z]/);
        }
      });
    });

    test('starts with "Lorem ipsum" when option enabled', () => {
      const result = LoremIpsum.generateSentences(3, true);
      expect(result).toMatch(/^Lorem ipsum/);
    });
  });

  describe('generateParagraphs()', () => {
    test('generates correct number of paragraphs', () => {
      const result = LoremIpsum.generateParagraphs(3);
      const paragraphs = result.split(/\n\n/).filter(p => p.length > 0);
      expect(paragraphs.length).toBe(3);
    });

    test('paragraphs are separated by double newlines', () => {
      const result = LoremIpsum.generateParagraphs(2);
      expect(result).toContain('\n\n');
    });

    test('each paragraph has multiple sentences', () => {
      const result = LoremIpsum.generateParagraphs(1);
      const periods = (result.match(/\./g) || []).length;
      expect(periods).toBeGreaterThan(1);
    });

    test('starts with "Lorem ipsum" when option enabled', () => {
      const result = LoremIpsum.generateParagraphs(2, true);
      expect(result).toMatch(/^Lorem ipsum/);
    });
  });

  describe('generateList()', () => {
    test('generates correct number of list items', () => {
      const result = LoremIpsum.generateList(5);
      // Result is a string with bullet points separated by newlines
      const items = result.split('\n').filter(line => line.startsWith('•'));
      expect(items.length).toBe(5);
    });

    test('each item starts with bullet point', () => {
      const result = LoremIpsum.generateList(3);
      const items = result.split('\n');
      items.forEach(item => {
        expect(item.startsWith('•')).toBe(true);
        expect(item.length).toBeGreaterThan(2);
      });
    });

    test('starts with Lorem ipsum when option enabled', () => {
      const result = LoremIpsum.generateList(3, true);
      expect(result.toLowerCase()).toMatch(/lorem ipsum/);
    });
  });
});

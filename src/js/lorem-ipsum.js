/**
 * OneDevKit - Lorem Ipsum Generator
 * Generate placeholder text for designs and mockups
 */

(function() {
  'use strict';

  const LoremIpsumGenerator = {
    // Classic Lorem Ipsum words (from original Cicero text)
    WORDS: [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
      'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
      'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
      'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
      'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
      'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
      'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
      'eius', 'modi', 'tempora', 'quaerat', 'magnam', 'aliquam', 'quam', 'minima',
      'nostrum', 'exercitationem', 'ullam', 'corporis', 'suscipit', 'laboriosam',
      'aliquid', 'commodi', 'consequatur', 'autem', 'vel', 'eum', 'iure', 'nihil',
      'molestiae', 'illum', 'quo', 'at', 'vero', 'accusamus', 'iusto', 'odio',
      'dignissimos', 'ducimus', 'blanditiis', 'praesentium', 'voluptatum', 'deleniti',
      'atque', 'corrupti', 'quos', 'quas', 'molestias', 'excepturi', 'obcaecati',
      'cupiditate', 'provident', 'similique', 'mollitia', 'animi', 'eligendi',
      'optio', 'cumque', 'impedit', 'placeat', 'facere', 'possimus', 'assumenda',
      'repellendus', 'temporibus', 'quibusdam', 'officiis', 'debitis', 'rerum',
      'necessitatibus', 'saepe', 'eveniet', 'voluptates', 'repudiandae', 'recusandae',
      'itaque', 'earum', 'hic', 'tenetur', 'sapiente', 'delectus', 'reiciendis',
      'coniunctio', 'maxime', 'harum', 'odit', 'perferendis', 'doloribus', 'asperiores',
      'repellat'
    ],

    // The classic opening
    CLASSIC_START: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',

    /**
     * Generate random words
     */
    generateWords(count, startWithLorem = false) {
      const words = [];

      if (startWithLorem) {
        // Start with classic opening
        words.push('Lorem', 'ipsum');
        count = Math.max(0, count - 2);
      }

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * this.WORDS.length);
        words.push(this.WORDS[randomIndex]);
      }

      return words.join(' ');
    },

    /**
     * Generate a sentence (5-15 words)
     */
    generateSentence(startWithLorem = false) {
      const wordCount = Math.floor(Math.random() * 11) + 5; // 5-15 words
      let sentence = this.generateWords(wordCount, startWithLorem);

      // Capitalize first letter
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

      // Add random punctuation
      const punctuation = Math.random() > 0.1 ? '.' : (Math.random() > 0.5 ? '!' : '?');

      return sentence + punctuation;
    },

    /**
     * Generate sentences
     */
    generateSentences(count, startWithLorem = false) {
      const sentences = [];

      for (let i = 0; i < count; i++) {
        sentences.push(this.generateSentence(i === 0 && startWithLorem));
      }

      return sentences.join(' ');
    },

    /**
     * Generate a paragraph (4-8 sentences)
     */
    generateParagraph(startWithLorem = false) {
      const sentenceCount = Math.floor(Math.random() * 5) + 4; // 4-8 sentences
      return this.generateSentences(sentenceCount, startWithLorem);
    },

    /**
     * Generate paragraphs
     */
    generateParagraphs(count, startWithLorem = false) {
      const paragraphs = [];

      for (let i = 0; i < count; i++) {
        paragraphs.push(this.generateParagraph(i === 0 && startWithLorem));
      }

      return paragraphs.join('\n\n');
    },

    /**
     * Generate list items
     */
    generateList(count, startWithLorem = false) {
      const items = [];

      for (let i = 0; i < count; i++) {
        const wordCount = Math.floor(Math.random() * 6) + 3; // 3-8 words per item
        let item = this.generateWords(wordCount, i === 0 && startWithLorem);
        item = item.charAt(0).toUpperCase() + item.slice(1);
        items.push('• ' + item);
      }

      return items.join('\n');
    },

    /**
     * Main generate function
     */
    generate(options = {}) {
      const {
        type = 'paragraphs',
        count = 3,
        startWithLorem = true
      } = options;

      switch (type) {
        case 'words':
          return this.generateWords(count, startWithLorem);
        case 'sentences':
          return this.generateSentences(count, startWithLorem);
        case 'paragraphs':
          return this.generateParagraphs(count, startWithLorem);
        case 'list':
          return this.generateList(count, startWithLorem);
        default:
          return this.generateParagraphs(count, startWithLorem);
      }
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
      this.updateCountLabel();
      this.generate_(); // Generate initial text
    },

    bindEvents() {
      // Generate button
      const generateBtn = document.getElementById('generate-lorem');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generate_());
      }

      // Copy button
      const copyBtn = document.getElementById('copy-lorem');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      // Type selector
      const typeSelect = document.getElementById('lorem-type');
      if (typeSelect) {
        typeSelect.addEventListener('change', () => {
          this.updateCountLabel();
          this.generate_();
        });
      }

      // Count input
      const countInput = document.getElementById('lorem-count');
      if (countInput) {
        countInput.addEventListener('change', () => {
          const value = parseInt(countInput.value, 10);
          const max = this.getMaxCount();
          if (value < 1) countInput.value = 1;
          if (value > max) countInput.value = max;
          this.generate_();
        });
      }

      // Start with Lorem checkbox
      const startCheckbox = document.getElementById('start-with-lorem');
      if (startCheckbox) {
        startCheckbox.addEventListener('change', () => this.generate_());
      }

      // Clear button
      const clearBtn = document.getElementById('clear-lorem');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }
    },

    getMaxCount() {
      const type = document.getElementById('lorem-type')?.value || 'paragraphs';
      switch (type) {
        case 'words': return 1000;
        case 'sentences': return 100;
        case 'paragraphs': return 50;
        case 'list': return 50;
        default: return 50;
      }
    },

    updateCountLabel() {
      const type = document.getElementById('lorem-type')?.value || 'paragraphs';
      const label = document.getElementById('count-label');
      const countInput = document.getElementById('lorem-count');

      if (label) {
        const labels = {
          words: 'Number of Words',
          sentences: 'Number of Sentences',
          paragraphs: 'Number of Paragraphs',
          list: 'Number of List Items'
        };
        label.textContent = labels[type] || 'Count';
      }

      if (countInput) {
        countInput.max = this.getMaxCount();
        // Adjust current value if exceeds max
        if (parseInt(countInput.value, 10) > this.getMaxCount()) {
          countInput.value = Math.min(parseInt(countInput.value, 10), this.getMaxCount());
        }
      }
    },

    getOptions() {
      return {
        type: document.getElementById('lorem-type')?.value || 'paragraphs',
        count: parseInt(document.getElementById('lorem-count')?.value, 10) || 3,
        startWithLorem: document.getElementById('start-with-lorem')?.checked ?? true
      };
    },

    generate_() {
      const options = this.getOptions();
      const text = this.generate(options);

      const output = document.getElementById('lorem-output');
      if (output) {
        output.textContent = text;
        output.classList.remove('tool-output-placeholder');
      }

      // Update word/character count
      this.updateStats(text);

      // Track analytics
      if (window.OneDevKit && window.OneDevKit.Analytics) {
        window.OneDevKit.Analytics.trackToolUsage('lorem-ipsum', 'generate');
      }
    },

    updateStats(text) {
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
      const charCount = text.length;

      const wordCountEl = document.getElementById('word-count');
      const charCountEl = document.getElementById('char-count');

      if (wordCountEl) wordCountEl.textContent = wordCount.toLocaleString();
      if (charCountEl) charCountEl.textContent = charCount.toLocaleString();
    },

    copy() {
      const output = document.getElementById('lorem-output');
      if (!output) return;

      const text = output.textContent;
      const copyBtn = document.getElementById('copy-lorem');

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(text, copyBtn);
        window.OneDevKit.Analytics.trackCopy('lorem-ipsum');
      }
    },

    clear() {
      const output = document.getElementById('lorem-output');
      if (output) {
        output.textContent = 'Click "Generate" to create Lorem Ipsum text';
        output.classList.add('tool-output-placeholder');
      }
      this.updateStats('');
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LoremIpsumGenerator.init());
  } else {
    LoremIpsumGenerator.init();
  }

  // Export for external access
  window.LoremIpsumGenerator = LoremIpsumGenerator;

})();

/**
 * OneDevKit - Word Counter
 * Count words, characters, sentences, paragraphs with reading/speaking time
 */

(function() {
  'use strict';

  const WordCounter = {
    // Average reading speed (words per minute)
    READING_WPM: 200,
    // Average speaking speed (words per minute)
    SPEAKING_WPM: 150,

    /**
     * Count words in text
     */
    countWords(text) {
      if (!text || !text.trim()) return 0;
      return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    },

    /**
     * Count characters (with spaces)
     */
    countCharacters(text) {
      return text ? text.length : 0;
    },

    /**
     * Count characters (without spaces)
     */
    countCharactersNoSpaces(text) {
      return text ? text.replace(/\s/g, '').length : 0;
    },

    /**
     * Count sentences (based on .!? followed by space or end)
     */
    countSentences(text) {
      if (!text || !text.trim()) return 0;
      const matches = text.match(/[.!?]+(?:\s|$)/g);
      return matches ? matches.length : 0;
    },

    /**
     * Count paragraphs (non-empty lines separated by blank lines)
     */
    countParagraphs(text) {
      if (!text || !text.trim()) return 0;
      return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    },

    /**
     * Count lines (including empty)
     */
    countLines(text) {
      if (!text) return 0;
      if (!text.trim()) return 0;
      return text.split('\n').length;
    },

    /**
     * Calculate reading time in minutes
     */
    getReadingTime(wordCount) {
      const minutes = wordCount / this.READING_WPM;
      return this.formatTime(minutes);
    },

    /**
     * Calculate speaking time in minutes
     */
    getSpeakingTime(wordCount) {
      const minutes = wordCount / this.SPEAKING_WPM;
      return this.formatTime(minutes);
    },

    /**
     * Format time as readable string
     */
    formatTime(minutes) {
      if (minutes < 1) {
        const seconds = Math.round(minutes * 60);
        return seconds <= 0 ? '0 sec' : `${seconds} sec`;
      }
      if (minutes < 60) {
        return `${Math.round(minutes)} min`;
      }
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
    },

    /**
     * Analyze text and return all stats
     */
    analyze(text) {
      const wordCount = this.countWords(text);

      return {
        words: wordCount,
        characters: this.countCharacters(text),
        charactersNoSpaces: this.countCharactersNoSpaces(text),
        sentences: this.countSentences(text),
        paragraphs: this.countParagraphs(text),
        lines: this.countLines(text),
        readingTime: this.getReadingTime(wordCount),
        speakingTime: this.getSpeakingTime(wordCount)
      };
    },

    /**
     * Update the UI with stats
     */
    updateUI(stats) {
      const elements = {
        'word-count': stats.words,
        'char-count': stats.characters,
        'char-no-space': stats.charactersNoSpaces,
        'sentence-count': stats.sentences,
        'paragraph-count': stats.paragraphs,
        'line-count': stats.lines,
        'reading-time': stats.readingTime,
        'speaking-time': stats.speakingTime
      };

      for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
      }
    },

    /**
     * Handle input change
     */
    handleInput() {
      const input = document.getElementById('text-input');
      if (!input) return;

      const text = input.value;
      const stats = this.analyze(text);
      this.updateUI(stats);
    },

    /**
     * Copy text to clipboard
     */
    copy() {
      const input = document.getElementById('text-input');
      const copyBtn = document.getElementById('copy-text');
      if (!input || !input.value) return;

      if (window.OneDevKit && window.OneDevKit.Clipboard) {
        window.OneDevKit.Clipboard.copy(input.value, copyBtn);
        window.OneDevKit.Analytics.trackCopy('word-counter');
      }
    },

    /**
     * Clear the text input
     */
    clear() {
      const input = document.getElementById('text-input');
      if (input) {
        input.value = '';
        input.focus();
        this.handleInput();
      }
    },

    /**
     * Get sample text for demonstration
     */
    getSampleText() {
      return `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.

Writing is an essential skill in today's digital world. Whether you're crafting a blog post, composing an email, or working on an academic paper, knowing your word count matters. Many platforms have specific requirements: Twitter limits you to 280 characters, while college essays often require 500-1000 words.

Here are some interesting word count facts:
- The average novel contains 80,000 to 100,000 words
- A typical blog post is between 1,000 and 2,000 words
- Academic abstracts are usually 150-300 words
- The longest novel ever written has over 1 million words

This sample text demonstrates how the word counter handles multiple paragraphs, punctuation, and various sentence structures. Try editing it to see the statistics update in real-time!`;
    },

    /**
     * Load sample text
     */
    loadSample() {
      const input = document.getElementById('text-input');
      if (input) {
        input.value = this.getSampleText();
        this.handleInput();
      }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      const input = document.getElementById('text-input');
      if (input) {
        // Use input event for real-time updates
        input.addEventListener('input', () => this.handleInput());
      }

      const copyBtn = document.getElementById('copy-text');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copy());
      }

      const clearBtn = document.getElementById('clear-text');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      const sampleBtn = document.getElementById('load-sample');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => this.loadSample());
      }
    },

    /**
     * Initialize the tool
     */
    init() {
      this.bindEvents();
      this.handleInput(); // Initial calculation
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WordCounter.init());
  } else {
    WordCounter.init();
  }

  // Export for testing
  window.WordCounter = WordCounter;

})();

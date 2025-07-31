import { MessageBuilder } from '../builders/MessageBuilder';
import { ColorUtils } from '../utils/ColorUtils';

describe('MessageBuilder', () => {
  let builder: MessageBuilder;

  beforeEach(() => {
    builder = new MessageBuilder();
  });

  describe('addText', () => {
    it('should add text component', () => {
      builder.addText('Hello, World!');
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').TextDisplayBuilder);
    });

    it('should add multiple text components', () => {
      builder.addText('Line 1').addText('Line 2');
      const components = builder.build();
      
      expect(components).toHaveLength(2);
      expect(components[0]).toBeInstanceOf(require('discord.js').TextDisplayBuilder);
      expect(components[1]).toBeInstanceOf(require('discord.js').TextDisplayBuilder);
    });

    it('should throw error when text exceeds limit', () => {
      const longText = 'A'.repeat(4001);
      expect(() => builder.addText(longText)).toThrow('Text too long: 4001/4000 characters');
    });
  });

  describe('addSection', () => {
    it('should add section with text', () => {
      builder.addSection({
        text: 'Section text'
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').SectionBuilder);
    });

    it('should add section with button accessory', () => {
      builder.addSection({
        text: 'Section with button',
        accessory: {
          type: 'button',
          customId: 'test-btn',
          label: 'Test Button',
          style: 'primary'
        }
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').SectionBuilder);
    });

    it('should throw error for more than 3 text components', () => {
      expect(() => {
        builder.addSection({
          text: ['Text 1', 'Text 2', 'Text 3', 'Text 4']
        });
      }).toThrow('Section can have at most 3 text elements');
    });
  });

  describe('addContainer', () => {
    it('should add container with accent color', () => {
      builder.addContainer({
        accentColor: ColorUtils.hexToInt('#FF0000'),
        children: [
          { type: 'text', content: 'Container text' }
        ]
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').ContainerBuilder);
    });

    it('should add container with multiple children', () => {
      builder.addContainer({
        accentColor: ColorUtils.hexToInt('#00FF00'),
        children: [
          { type: 'text', content: 'Title' },
          { type: 'text', content: 'Description' },
          { type: 'button', customId: 'btn', label: 'Button', style: 'primary' }
        ]
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').ContainerBuilder);
    });
  });

  describe('addSeparator', () => {
    it('should add separator with default options', () => {
      builder.addSeparator();
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').SeparatorBuilder);
    });

    it('should add separator with custom options', () => {
      builder.addSeparator({
        divider: false,
        spacing: 1 // Large spacing
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').SeparatorBuilder);
    });
  });

  describe('addButton', () => {
    it('should add button with primary style', () => {
      builder.addButton({
        customId: 'test-btn',
        label: 'Test Button',
        style: 'primary'
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').ActionRowBuilder);
    });

    it('should add button with all options', () => {
      builder.addButton({
        customId: 'test-btn',
        label: 'Test Button',
        style: 'primary',
        emoji: '👍',
        disabled: false
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').ActionRowBuilder);
    });

    it('should add button with URL', () => {
      builder.addButton({
        url: 'https://discord.js.org',
        label: 'Visit Discord.js',
        style: 'link'
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').ActionRowBuilder);
    });
  });

  describe('addSelectMenu', () => {
    it('should add string select menu', () => {
      builder.addSelectMenu({
        type: 'string',
        customId: 'test-select',
        placeholder: 'Select an option',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').ActionRowBuilder);
    });

    it('should add user select menu', () => {
      builder.addSelectMenu({
        type: 'user',
        customId: 'user-select',
        placeholder: 'Select users'
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
    });
  });

  describe('addMediaGallery', () => {
    it('should add media gallery', () => {
      builder.addMediaGallery([
        { url: 'attachment://image1.png', description: 'Image 1' },
        { url: 'https://example.com/image2.jpg', description: 'Image 2', spoiler: true }
      ]);
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').MediaGalleryBuilder);
    });

    it('should throw error for too many media items', () => {
      const items = Array.from({ length: 11 }, (_, i) => ({
        url: `https://example.com/image${i}.jpg`,
        description: `Image ${i}`
      }));
      
      expect(() => builder.addMediaGallery(items)).toThrow('Media gallery can have at most 10 items');
    });
  });

  describe('addFile', () => {
    it('should add file component', () => {
      builder.addFile({
        url: 'attachment://document.pdf'
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
      expect(components[0]).toBeInstanceOf(require('discord.js').FileBuilder);
    });

    it('should add file with spoiler', () => {
      builder.addFile({
        url: 'attachment://document.pdf',
        spoiler: true
      });
      const components = builder.build();
      
      expect(components).toHaveLength(1);
    });
  });

  describe('validation', () => {
    it('should validate text length', () => {
      const longText = 'A'.repeat(4001);
      expect(() => builder.addText(longText)).toThrow('Text too long: 4001/4000 characters');
    });

    it('should warn for empty message', () => {
      const result = builder.validateMessage();
      expect(result.warnings).toContain('Message has no components');
    });
  });

  describe('utility methods', () => {
    it('should get component count', () => {
      builder.addText('Text 1').addText('Text 2');
      expect(builder.getComponentCount()).toBe(2);
    });

    it('should get text length', () => {
      builder.addText('Hello').addText('World');
      expect(builder.getTextLength()).toBe(10);
    });

    it('should clear components', () => {
      builder.addText('Text 1').addText('Text 2');
      expect(builder.getComponentCount()).toBe(2);
      
      builder.clear();
      expect(builder.getComponentCount()).toBe(0);
      expect(builder.getTextLength()).toBe(0);
    });
  });
}); 
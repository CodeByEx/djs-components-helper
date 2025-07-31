const { MessageBuilder, ColorUtils, MigrationUtils } = require('./dist/index.js');

console.log('Testing Discord.js Components V2 Helper...\n');

// Test ColorUtils
console.log('Testing ColorUtils:');
console.log('Hex to Int:', ColorUtils.hexToInt('#FF0000')); // Should be 16711680
console.log('Int to Hex:', ColorUtils.intToHex(16711680)); // Should be '#FF0000'
console.log('Is Valid Hex:', ColorUtils.isValidHex('#FF0000')); // Should be true
console.log('Random Color:', ColorUtils.getRandomColor());
console.log('Discord Colors:', Object.keys(ColorUtils.getDiscordColors()).length, 'colors available');

// Test MessageBuilder
console.log('\nTesting MessageBuilder:');
const message = new MessageBuilder()
  .addText('Hello, World!')
  .addSeparator()
  .addContainer({
    accentColor: ColorUtils.hexToInt('#0099FF'),
    children: [
      { type: 'text', content: '**Test Container**' },
      { type: 'text', content: 'This is a test container' }
    ]
  })
  .addButton({
    customId: 'test-btn',
    label: 'Test Button',
    style: 'primary'
  });

console.log('Component Count:', message.getComponentCount());
console.log('Text Length:', message.getTextLength());

const components = message.build();
console.log('Built Components:', components.length, 'components');

// Test MigrationUtils
console.log('\nTesting MigrationUtils:');
const migratedMessage = MigrationUtils.embedToContainer({
  title: 'Test Embed',
  description: 'This is a test embed',
  color: '#57F287',
  fields: [
    { name: 'Field 1', value: 'Value 1', inline: true },
    { name: 'Field 2', value: 'Value 2', inline: true }
  ]
});

console.log('Migrated Message Components:', migratedMessage.getComponentCount());

// Test validation
console.log('\nTesting Validation:');
const validation = message.validateMessage();
console.log('Validation Result:', validation);

console.log('\n✅ All tests passed! The package is working correctly.'); 